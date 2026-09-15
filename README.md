# NEXA - El punto de encuentro para tus servicios

Aplicación web para encontrar, comparar y contactar profesionales de servicios locales en Asunción.

**Sitio desplegado:** https://araortigoza.github.io/2_App_de_Servicios_The_Hatch/

## El problema que resuelve

En Asunción encontrar un profesional confiable es una lotería: las recomendaciones se pierden en grupos de WhatsApp y nadie deja constancia de las malas experiencias. NEXA reúne a los profesionales en un solo lugar, con sus calificaciones visibles y contacto directo por llamada o WhatsApp.

## Estructura del proyecto

```
2_App_de_Servicios_The_Hatch/
├── index.html            Inicio: qué es la app, cómo funciona y CTA
├── proveedores.html      Listado de profesionales en tarjetas
├── detalle.html          Perfil individual del profesional
├── css/
│   ├── index.css
│   ├── proveedores.css
│   └── detalle.css
├── js/
│   ├── proveedores.js    Fetch, filtrado por categoría y estados de carga
│   └── detalle.js        Fetch del profesional según el id de la URL
├── data/
│   └── proveedores.json  Fuente de datos desacoplada
├── assets/               Logo y fotos de los profesionales
├── README.md
└── CHANGELOG.md
```

## Cómo ejecutar el proyecto localmente

El proyecto es HTML, CSS y JavaScript puro, sin dependencias ni instalación.

Como los datos se cargan con `fetch()` desde `data/proveedores.json`, no se puede abrir con doble clic en el navegador: los navegadores bloquean `fetch` sobre `file://`. Hay que levantar un servidor local:

**Con la extensión Live Server de VS Code:**
1. Abrir la carpeta del proyecto en VS Code.
2. Click derecho sobre `index.html` y elegir "Open with Live Server".

**Con Python:**
```
python -m http.server 5500
```
Luego entrar a `http://localhost:5500` en el navegador.

## Cómo desplegar

El sitio está publicado con GitHub Pages. Para replicar el despliegue:

1. Subir el proyecto a un repositorio de GitHub.
2. Ir a **Settings** del repositorio y luego a **Pages** en el menú lateral.
3. En "Source" elegir "Deploy from a branch", rama `main` y carpeta `/ (root)`.
4. Guardar y esperar uno o dos minutos.
5. GitHub publica el sitio en `https://usuario.github.io/nombre-del-repositorio/`.

Cada nuevo push a `main` vuelve a desplegar el sitio automáticamente.

## Decisiones técnicas

**Datos desacoplados.** Ningún profesional está escrito directamente en el HTML. Todo se consume desde `data/proveedores.json` mediante `fetch()`, de modo que el frontend se comporta como si hablara con un backend real. Las categorías del filtro también se generan dinámicamente a partir de los datos.

**Los tres estados del listado.** `proveedores.html` contempla los estados de carga, sin resultados y error. El estado de carga incluye una demora simulada para que sea visible; el de sin resultados aparece al filtrar una categoría sin coincidencias; el de error se activa si falla la carga del JSON (se puede probar renombrando temporalmente el archivo).

**Estilos.** CSS puro, sin frameworks, con un archivo por página para mantener cada hoja corta y fácil de mantener.

**Accesibilidad.** Navegación por teclado en el filtro de categorías (flechas, Enter y Escape), `label` asociado al control, atributos `aria-expanded` y `role="listbox"`, texto alternativo en las imágenes y contraste suficiente entre texto y fondo.

## Evidencia Lighthouse

Pendiente de completar con los puntajes de Performance y Accessibility, y las capturas del reporte.

Para generarla: abrir el sitio desplegado en Chrome, presionar F12, ir a la pestaña **Lighthouse**, tildar "Performance" y "Accessibility" y ejecutar "Analyze page load".

**Mejoras aplicadas:**

1. **Reducción del Cumulative Layout Shift en la página de detalle.** Lighthouse detectó un CLS de 0.299 provocado por el contenido que aparecía después del `fetch` y empujaba el resto de la página. Se reservó una altura mínima en el contenedor principal y se declararon `width` y `height` explícitos en la foto del profesional, para que el navegador reserve el espacio antes de que el contenido termine de cargar.

2. **Optimización del peso de las imágenes.** El logo y las fotos de los profesionales se convirtieron a formato WebP y se redimensionaron al tamaño en que realmente se muestran, reduciendo considerablemente los bytes transferidos. El logo se sirve con una etiqueta `<picture>` que ofrece WebP a los navegadores compatibles y PNG como respaldo.

## Registro de cambios

Las pruebas con usuarios y las mejoras aplicadas a partir de su feedback están documentadas en [CHANGELOG.md](CHANGElog.md).
