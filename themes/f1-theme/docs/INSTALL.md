Añadir `theme = "f1-theme"` a hugo.toml.

## Política del hero

El tema no impone ninguna. Sin configurar, los heros van en `overlay` (texto
sobre la foto) en todos los anchos. Para cambiarlo, en el `hugo.toml` del
sitio:

```toml
[params.hero]
  layout = "stacked"      # stacked | overlay | split
  mobileOverlay = false   # overlay apilado en móvil
```

Detalle en `docs/FRONTMATTER.md`, «Hero: layouts».
