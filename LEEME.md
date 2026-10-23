# Bolero Techno · sitio web

Sitio de literatura digital de **Bolero Techno**.
Poemas: Abraham Truxillo · Producción musical, proyecto digital y sitio: Lidya Cota.

Dirección final: **https://bolerotechno.lidyacota.com**

El sitio es HTML, CSS y JavaScript puros. No necesita instalar nada ni compilar nada. GitHub Pages lo publica tal cual.

---

## Qué hay en esta carpeta

| Archivo o carpeta | Qué es |
|---|---|
| `index.html` | Portada con las hojas flotantes en 3D |
| `poemas/` | Lista de poemas y una carpeta por poema, con video, poema y ficha sonora |
| `acerca/` | Página "Acerca de" |
| `assets/css/estilos.css` | Todos los estilos y la paleta de colores |
| `assets/js/portada.js` | Animación 3D de la portada |
| `assets/js/sitio.js` | Menú en celular y video de YouTube bajo demanda |
| `assets/video/tocadiscos.mp4` | Video de fondo (Pexels, licencia libre) recortado y comprimido |
| `assets/img/` | Imagen del video, ícono e imagen para redes sociales |
| `assets/fonts/` | Tipografía Montserrat (licencia libre OFL) |
| `CNAME` | Le dice a GitHub que use bolerotechno.lidyacota.com |
| `README.md` | Presentación del proyecto que GitHub muestra en el repositorio (ayuda al SEO) |
| `llms.txt` | Resumen del proyecto para modelos de lenguaje (ChatGPT, Claude, Perplexity…) |
| `llms-full.txt` | Texto completo de los 27 poemas y sus fichas sonoras, para modelos de lenguaje |
| `404.html`, `sitemap.xml`, `robots.txt` | Página de error y archivos para buscadores |

---

## Cómo publicarlo en GitHub Pages

### 1. Crear el repositorio
1. Entra a github.com con tu cuenta y da clic en **New repository**.
2. Nómbralo, por ejemplo, `bolerotechno`.
3. Déjalo como **Public** y da clic en **Create repository**.

### 2. Subir los archivos
1. En el repositorio nuevo, da clic en **uploading an existing file**.
2. Abre la carpeta `sitio-bolero-techno` en Finder, selecciona **todo su contenido** (no la carpeta en sí, sino lo que está dentro) y arrástralo a la página.
3. Espera a que suban todos los archivos y da clic en **Commit changes**.

> Revisa que en la raíz del repositorio queden `index.html`, `CNAME` y las carpetas `assets`, `poemas` y `acerca`.

### 3. Activar GitHub Pages
1. En el repositorio, ve a **Settings → Pages**.
2. En **Source**, elige **Deploy from a branch**.
3. En **Branch**, elige `main` y la carpeta `/ (root)`. Da clic en **Save**.
4. En **Custom domain** debe aparecer `bolerotechno.lidyacota.com`. Si no aparece, escríbelo y guarda.

### 4. Configurar el subdominio (en tu proveedor de lidyacota.com)
Es lo mismo que ya hiciste para `alfonsinatrapypoesia.lidyacota.com`. En el panel DNS de tu dominio, agrega:

| Tipo | Nombre / Host | Valor / Apunta a |
|---|---|---|
| `CNAME` | `bolerotechno` | `TU-USUARIO.github.io` |

Cambia `TU-USUARIO` por tu nombre de usuario de GitHub.

### 5. Activar HTTPS
Cuando el DNS se propague (de minutos a unas horas), vuelve a **Settings → Pages** y marca **Enforce HTTPS**.

---

## Para hacer cambios después
- **Textos de "Acerca de":** `acerca/index.html`
- **Colores:** variables al inicio de `assets/css/estilos.css` (`--salvia`, `--niebla`, `--crema`, `--rojo`…)
- **Un poema:** `poemas/nombre-del-poema/index.html`

Si cambias algo en GitHub desde el navegador (botón del lápiz), el sitio se actualiza solo en uno o dos minutos.
