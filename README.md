# Reseñas 360 — web

Web de una sola página para Reseñas 360 (tarjetas y expositores NFC + QR para reseñas de Google, Huelva). El objetivo es captar contactos por WhatsApp al +34 621 36 51 47.

Es HTML, CSS y JS estático, sin build. Se despliega tal cual en Cloudflare Pages.

## Estructura

```
index.html          Página principal
aviso-legal.html    Aviso legal (LSSI-CE)
privacidad.html     Política de privacidad (RGPD)
cookies.html        Política de cookies
404.html            Página de error
favicon.svg
robots.txt
sitemap.xml
_headers            Cabeceras de seguridad y caché para Cloudflare Pages
assets/
  css/styles.css    Estilos compartidos (tokens de color, claro y oscuro)
  js/main.js        Enlaces de WhatsApp, botón copiar, patrón QR decorativo
  fonts/            Anton y Poppins servidas desde el propio dominio (OFL 1.1)
```

## Antes de publicar

- [ ] Rellenar los datos marcados en amarillo en `aviso-legal.html` y `privacidad.html`: titular, NIF, domicilio y correo.
- [ ] Si sois sociedad, rellenar los datos registrales del aviso legal. Si no, borrar ese párrafo.
- [ ] Indicar la gestoría en `privacidad.html` si la tenéis, o borrar esa línea.
- [ ] Sustituir los dos huecos de foto de la sección de precios por fotos reales.
- [ ] Confirmar los textos dados por supuestos: "pago único", "sin cuotas", "comprobamos contigo que funciona".
- [ ] Comprar el dominio y, si no es `resenas360.com`, cambiarlo en `index.html` (canonical, og:url, JSON-LD), en las páginas legales, `robots.txt` y `sitemap.xml`.

## Cambiar el número de WhatsApp

En `assets/js/main.js`, variable `PHONE` (sin `+` ni espacios). También aparece como texto en `index.html` (contacto y pie), en los `href` de respaldo `https://wa.me/...` y en las páginas legales.

## Desplegar en Cloudflare Pages

1. Cloudflare → Workers & Pages → Create → Pages → Connect to Git.
2. Elegir el repo `BertoProyect/resenas360`, rama `main`.
3. Framework preset: **None**. Build command: vacío. Build output directory: `/`.
4. Deploy. Después, en *Custom domains*, añadir `resenas360.com` y `www.resenas360.com`.
5. Si también se compra `reseñas360.com` (en Cloudflare aparece como `xn--reseas360-o6a.com`), crear una redirección 301 a `resenas360.com`.

## Cookies

La web no usa cookies de analítica ni de publicidad, así que no necesita banner de consentimiento. Si se añade Google Analytics, Meta Pixel o similar, hay que añadir un banner y actualizar `cookies.html` antes de activarlo.
