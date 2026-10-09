# PALIAPP

Herramienta de consulta para cuidados paliativos. Una sola página, sin servidor: los datos quedan en el navegador.

## Publicar en GitHub Pages

1. Crear un repositorio público.
2. Subir a la raíz `index.html`, `manifest.json`, `sw.js` y la carpeta `laminas/`.
3. Settings → Pages → Branch `main` / carpeta root.
4. La dirección queda en `https://usuario.github.io/nombre-del-repo/`.

El service worker solo se registra si la página se sirve por HTTPS (GitHub Pages lo es). Abrir el HTML como archivo local no instala la PWA. En el celular, desde Chrome o Safari: compartir o menú → Agregar a inicio.
