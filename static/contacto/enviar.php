<?php
/**
 * Endpoint del formulario de contacto: POST /contacto/enviar.php
 *
 * Vive en static/contacto/ para que Hugo lo copie a public/ y suba con el resto del
 * sitio (ver «Formulario de contacto: despliegue» en CLAUDE.md). Las direcciones
 * NO estan aqui: las lee de config.php, que Hugo GENERA en cada build desde
 * data/site.yaml (contact.form.to / contact.form.from). No editar config.php a mano.
 *
 * Una sola implementacion para los dos caminos:
 *   - Con JS: fetch() con "Accept: application/json" -> responde JSON.
 *   - Sin JS: POST normal del <form> -> 303 a /contacto/#recibido (la pagina estatica
 *     muestra la confirmacion con :target) o, si hay errores, una pagina HTML propia.
 *
 * Envio: SMTP AUTENTICADO contra smtp.hostinger.com con PHPMailer (lib/PHPMailer/).
 * NO mail(): medido en real (sep 2026), mail() en el alojamiento compartido de Hostinger
 * ignora -f, reescribe el remitente del sobre (noreply@srvXXXX.main-hosting.eu) y no firma
 * DKIM, asi que DMARC falla y el propio Hostinger lo marca X-Spam. Por SMTP autenticado el
 * mensaje sale igual que desde el webmail: DKIM de opticasfausto.com, SPF y DMARC en pass.
 *
 * CREDENCIALES: fuera del repo y fuera de public_html, en CF_SMTP_FILE (ver abajo). Nunca en
 * config.php (lo genera Hugo desde un repo publico) ni en ningun fichero versionado.
 *
 * NO PERSISTE NADA: ni base de datos, ni archivos, ni log de envios; el envio por SMTP no
 * guarda copia en el buzon remitente. Los error_log() dicen el motivo de un rechazo o de un
 * fallo, nunca datos del visitante ni la contrasena.
 */

/** Tiempo minimo, en ms, entre que se carga la pagina y se envia. Lo mide el cliente. */
const CF_MIN_MS = 3000;

/**
 * Credenciales SMTP: un PHP que devuelve ['user' => ..., 'pass' => ...], FUERA de public_html:
 *   /home/<usuario>/domains/opticasfausto.com/smtp.php   (dos niveles por encima de este fichero)
 * Se sube a mano una vez y la sincronizacion de public/ no lo toca. Claves opcionales, con estos
 * valores por defecto: 'host' => 'smtp.hostinger.com', 'port' => 465, 'secure' => 'ssl'.
 */
define('CF_SMTP_FILE', dirname(__DIR__, 2) . '/smtp.php');

/** Longitud maxima de cada campo, en caracteres. */
const CF_LIM = array('nombre' => 100, 'telefono' => 30, 'email' => 254, 'mensaje' => 2000);

header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

// ---------------------------------------------------------------------------
// Utilidades
// ---------------------------------------------------------------------------

function cf_h($s)
{
    return htmlspecialchars((string) $s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function cf_len($s)
{
    return function_exists('mb_strlen') ? mb_strlen($s, 'UTF-8') : strlen($s);
}

/** Config generada por Hugo. Si falta o es invalida el endpoint falla cerrado. */
function cf_config()
{
    $f = __DIR__ . '/config.php';
    $c = is_file($f) ? require $f : null;
    if (!is_array($c) || empty($c['to']) || empty($c['from']) || empty($c['host']) || !is_array(isset($c['msg']) ? $c['msg'] : null)) {
        error_log('contacto/enviar.php: falta config.php o es invalido (lo genera Hugo en el build)');
        http_response_code(500);
        header('Content-Type: text/plain; charset=utf-8');
        echo 'Servicio no disponible.';
        exit;
    }
    return $c;
}

function cf_json($status, $data)
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/** Pagina HTML autocontenida para los errores del camino sin JS. */
function cf_pagina_error($cfg, $status, $mensajes)
{
    $m = $cfg['msg'];
    http_response_code($status);
    header('Content-Type: text/html; charset=utf-8');
    $lista = '';
    foreach ($mensajes as $t) {
        $lista .= '<li>' . cf_h($t) . '</li>';
    }
    $tel = isset($cfg['phone']) ? $cfg['phone'] : '';
    $telLabel = isset($cfg['phoneLabel']) ? $cfg['phoneLabel'] : $tel;
    $wa = isset($cfg['whatsapp']) ? preg_replace('/\D+/', '', $cfg['whatsapp']) : '';
    echo '<!doctype html><html lang="es"><head><meta charset="utf-8">'
        . '<meta name="viewport" content="width=device-width, initial-scale=1">'
        . '<meta name="robots" content="noindex"><title>' . cf_h($m['errPageTitle']) . '</title>'
        . '<style>body{font:1.15rem/1.6 system-ui,-apple-system,"Segoe UI",sans-serif;color:#1c1a17;background:#fffdf8;margin:0;padding:1.5rem}'
        . 'main{max-width:38rem;margin:0 auto}h1{font-size:1.6rem;line-height:1.2}'
        . 'a{color:#08783e}.b{display:inline-block;margin:.25rem .5rem .25rem 0;padding:.8rem 1.2rem;border-radius:999px;background:#08783e;color:#fff;text-decoration:none;font-weight:600}'
        . '</style></head><body><main><h1>' . cf_h($m['errPageTitle']) . '</h1>'
        . '<ul>' . $lista . '</ul>'
        . '<p><a href="' . cf_h($cfg['contactUrl']) . '">' . cf_h($m['errBack']) . '</a></p>'
        . '<p>' . cf_h($m['errOrCall'])
        . '</p><p>' . ($tel !== '' ? '<a class="b" href="tel:' . cf_h($tel) . '">' . cf_h($telLabel) . '</a>' : '')
        . ($wa !== '' ? '<a class="b" href="https://wa.me/' . cf_h($wa) . '">WhatsApp</a>' : '')
        . '</p></main></body></html>';
    exit;
}

/** Devuelve el error por el canal que corresponda (JSON o pagina). */
function cf_error($cfg, $json, $status, $errores, $general = null)
{
    if ($json) {
        cf_json($status, array('ok' => false, 'errors' => $errores, 'message' => $general !== null ? $general : ''));
    }
    $mensajes = array_values($errores);
    if ($general !== null) {
        array_unshift($mensajes, $general);
    }
    cf_pagina_error($cfg, $status, $mensajes);
}

/** El exito es el MISMO para un envio real y para el honeypot: no se le da pistas al bot. */
function cf_exito($json)
{
    if ($json) {
        cf_json(200, array('ok' => true));
    }
    header('Location: /contacto/#recibido', true, 303);
    exit;
}

// ---------------------------------------------------------------------------
// Peticion
// ---------------------------------------------------------------------------

$cfg = cf_config();
$msg = $cfg['msg'];
$host = strtolower($cfg['host']);

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    if (isset($_SERVER['REQUEST_METHOD']) && $_SERVER['REQUEST_METHOD'] === 'GET') {
        header('Location: ' . $cfg['contactUrl'], true, 303);
        exit;
    }
    header('Allow: POST');
    http_response_code(405);
    exit;
}

$json = isset($_SERVER['HTTP_ACCEPT']) && stripos($_SERVER['HTTP_ACCEPT'], 'application/json') !== false;

// Solo se acepta un envio que venga de nuestro propio sitio (cuando el navegador manda Origin).
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
if ($origin !== '' && $origin !== 'null') {
    $oh = strtolower((string) parse_url($origin, PHP_URL_HOST));
    if ($oh !== $host && $oh !== 'www.' . $host) {
        // Sin datos del visitante: solo el host desde el que se cargo el formulario.
        error_log('contacto/enviar.php: 403, Origin no permitido: ' . $oh . ' (se esperaba ' . $host . ')');
        cf_error($cfg, $json, 403, array(), $msg['errGeneric']);
    }
}

// Honeypot: un campo que un humano no ve ni rellena. Si viene con algo, es un bot:
// se le responde EXACTAMENTE lo mismo que a un envio bueno, y no se envia nada.
$hp = isset($_POST['sitio_web']) ? $_POST['sitio_web'] : '';
if (is_array($hp) || trim((string) $hp) !== '') {
    // Sin datos del visitante. Si esto aparece con envios de personas reales, el autorrelleno
    // del navegador esta rellenando el campo: cambiarle nombre y etiqueta.
    error_log('contacto/enviar.php: honeypot relleno, envio descartado');
    cf_exito($json);
}

// Los campos deben ser cadenas (nombre[]=x es manipulacion, no un formulario).
$campos = array();
foreach (array('nombre', 'telefono', 'email', 'mensaje', 'acepto', '_t') as $k) {
    $v = isset($_POST[$k]) ? $_POST[$k] : '';
    if (!is_string($v)) {
        error_log('contacto/enviar.php: 400, campo con tipo no valido: ' . $k);
        cf_error($cfg, $json, 400, array(), $msg['errGeneric']);
    }
    $campos[$k] = trim($v);
}

$errores = array();

// INYECCION DE CABECERAS. nombre, telefono y email pueden acabar en una cabecera
// (Subject, Reply-To): cualquier caracter de control, y en particular \r o \n, permitiria
// anadir cabeceras y convertir el formulario en un rele de spam. Se RECHAZA el envio;
// no se filtra en silencio, porque un usuario legitimo nunca los escribe en un campo de una linea.
foreach (array('nombre', 'telefono', 'email', '_t') as $k) {
    if (preg_match('/[\x00-\x1F\x7F]/', $campos[$k])) {
        $errores[$k === '_t' ? 'nombre' : $k] = $msg['errLineas'];
    }
}
// El mensaje si puede tener saltos de linea, pero no otros caracteres de control.
if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', $campos['mensaje'])) {
    $errores['mensaje'] = $msg['errLineas'];
}
if ($errores) {
    cf_error($cfg, $json, 400, $errores);
}

// Validacion (el JS del cliente hace la misma, pero el servidor es el que manda).
$n = $campos['nombre'];
if ($n === '' || cf_len($n) > CF_LIM['nombre']) {
    $errores['nombre'] = $msg['errNombre'];
}
$t = $campos['telefono'];
if (!preg_match('/^[0-9+()\s.\-]{6,' . CF_LIM['telefono'] . '}$/', $t) || strlen(preg_replace('/\D+/', '', $t)) < 6) {
    $errores['telefono'] = $msg['errTelefono'];
}
$e = $campos['email'];
if ($e !== '') {
    if (strlen($e) > CF_LIM['email']
        || !filter_var($e, FILTER_VALIDATE_EMAIL)
        || !preg_match('/^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/', $e)) {
        $errores['email'] = $msg['errEmail'];
    }
}
$m = $campos['mensaje'];
if (cf_len($m) < 5 || cf_len($m) > CF_LIM['mensaje']) {
    $errores['mensaje'] = $msg['errMensaje'];
}
if (!in_array(strtolower($campos['acepto']), array('1', 'on', 'si', 'true'), true)) {
    $errores['acepto'] = $msg['errAcepto'];
}
if ($errores) {
    cf_error($cfg, $json, 422, $errores);
}

// Tiempo minimo entre carga y envio. Lo mide el JS del cliente (evita el desfase de reloj);
// sin JS el campo llega vacio y no se puede comprobar: solo actua el honeypot.
if ($campos['_t'] !== '') {
    if (!ctype_digit($campos['_t']) || (int) $campos['_t'] < CF_MIN_MS) {
        cf_error($cfg, $json, 400, array(), $msg['errTiempo']);
    }
}

// ---------------------------------------------------------------------------
// Envio
// ---------------------------------------------------------------------------

$to = $cfg['to'];
$from = $cfg['from'];

// El From es SIEMPRE una direccion del propio dominio, fija y salida de la config, NUNCA lo que
// escriba el visitante: con el correo del visitante en From, SPF y DKIM dejan de estar alineados
// y el mensaje pasa a ser suplantacion a ojos del receptor. El visitante va en Reply-To.
$fromNombre = isset($cfg['fromName']) ? $cfg['fromName'] : '';

$cuerpo = $msg['mailIntro'] . "\n\n"
    . $msg['mailName'] . ': ' . $n . "\n"
    . $msg['mailPhone'] . ': ' . $t . "\n"
    . $msg['mailEmail'] . ': ' . ($e !== '' ? $e : $msg['mailNone']) . "\n\n"
    . $msg['mailMessage'] . ":\n" . $m . "\n\n--\n"
    . $msg['mailFooter'] . "\n";

// Credenciales. Si faltan, falla cerrado: sin ellas no hay envio autenticado, y un envio sin
// autenticar (mail()) es justo lo que se ha eliminado. NO hay respaldo con mail().
$smtp = is_readable(CF_SMTP_FILE) ? include CF_SMTP_FILE : null;
if (!is_array($smtp) || empty($smtp['user']) || empty($smtp['pass'])) {
    error_log('contacto/enviar.php: faltan o no se pueden leer las credenciales SMTP en ' . CF_SMTP_FILE);
    cf_error($cfg, $json, 500, array(), $msg['errSend']);
}

require __DIR__ . '/lib/PHPMailer/Exception.php';
require __DIR__ . '/lib/PHPMailer/PHPMailer.php';
require __DIR__ . '/lib/PHPMailer/SMTP.php';

$correo = new \PHPMailer\PHPMailer\PHPMailer(true);
try {
    $correo->isSMTP();
    $correo->Host = isset($smtp['host']) ? $smtp['host'] : 'smtp.hostinger.com';
    $correo->Port = isset($smtp['port']) ? (int) $smtp['port'] : 465;
    $correo->SMTPSecure = isset($smtp['secure']) ? $smtp['secure'] : 'ssl'; // TLS implicito
    $correo->SMTPAuth = true;
    $correo->Username = $smtp['user'];
    $correo->Password = $smtp['pass'];
    $correo->Timeout = 15; // una peticion web no puede quedarse colgada los 300 s por defecto

    $correo->CharSet = 'UTF-8';
    $correo->Encoding = 'quoted-printable';
    $correo->isHTML(false);
    $correo->MessageID = '<' . bin2hex(random_bytes(12)) . '@' . $host . '>';

    // From = la cuenta autenticada, siempre del propio dominio y salida de la config, NUNCA lo que
    // escriba el visitante. setFrom() fija tambien el remitente del sobre. El visitante va en
    // Reply-To, solo la direccion (ya validada arriba).
    $correo->setFrom($from, $fromNombre);
    $correo->addAddress($to);
    if ($e !== '') {
        $correo->addReplyTo($e);
    }
    $correo->Subject = $msg['mailSubject'] . ': ' . $n; // PHPMailer lo codifica (RFC 2047)
    $correo->Body = $cuerpo;

    $correo->send();
} catch (\Exception $ex) {
    // ErrorInfo es la respuesta del servidor SMTP: sin datos del visitante ni la contrasena.
    error_log('contacto/enviar.php: fallo SMTP: ' . substr((string) $correo->ErrorInfo, 0, 300));
    cf_error($cfg, $json, 500, array(), $msg['errSend']);
}

cf_exito($json);
