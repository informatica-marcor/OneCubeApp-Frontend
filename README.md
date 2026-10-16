# OneCubeApp Frontend

PWA de control de accesos con React 19, Vite 7, Tailwind CSS y React Query. Repositorio independiente extraído de `OneCube_Acceso_Biometrico/frontend`: conserva su estructura interna y no necesita archivos del monorepo. El backend se administra y despliega por separado.

## Requisitos y arranque local

- Node.js 20.19+ o 22.12+ (validado con Node 24.20.0 y npm 12.2.0).
- Backend accesible desde el navegador; no se incluye aquí.

Desde la raíz de este repositorio:

```sh
npm ci
cp .env.example .env
# Editar .env con la URL de tu backend.
npm run dev
```

En PowerShell, usar `Copy-Item .env.example .env` en lugar de `cp`. Si ya existe un `.env` configurado, no sobrescribirlo. La copia de trabajo inicial incluye un `.env` local con una URL de desarrollo sin credenciales; está ignorado por Git y Docker.

Vite muestra la dirección local (por defecto `http://localhost:5173`). Para compilar o revisar estilo, sin iniciar servidores:

```sh
npm run build
npm run lint
```

El build se genera en `dist/`. No hay script de pruebas automatizadas en el proyecto.

## Configuración de backend y entorno

| Variable | Uso |
| --- | --- |
| `VITE_API_URL` | URL base pública del backend, accesible desde el navegador. Sin barra final; incluir el prefijo de API si corresponde. |

Ejemplo local sin secretos en `.env.example`. Para producción se puede usar `https://api.example.com` o `https://api.example.com/api/v1`, según las rutas que exponga el backend. La autenticación agrega `/auth/request-code` y `/auth/verify-code` a esta base; no incluir `/auth` en la variable.

- Los consumidores están en `src/components/config/api.js` y `src/components/hooks/useAuthApi.js`. No se encontraron dependencias de rutas al monorepo en ellos.
- No dejar la variable vacía: el cliente general puede consultar accidentalmente al frontend y el de autenticación genera una base inválida.
- Todas las variables `VITE_*` quedan **públicas en el JavaScript compilado**. Nunca poner contraseñas, claves privadas, tokens ni secretos del backend.
- Vite lee `.env` durante desarrollo/build. Reiniciar el proceso de desarrollo después de cambiarlo; en producción hay que **recompilar y redesplegar**.
- `.env` y `.env.*` están ignorados, excepto `.env.example`. Docker excluye también estos archivos: el build de la imagen recibe la URL mediante un argumento explícito.
- No usar nombres internos de contenedores como URL del backend: las solicitudes las realiza el navegador del usuario, no nginx.
- Coordinar en el backend CORS para el origen local y el dominio HTTPS del frontend. Este nginx no hace proxy de API. Evitar mixed content: frontend HTTPS requiere backend HTTPS.

## Docker

Ejecutar desde la raíz, con Docker instalado:

```sh
docker build --build-arg VITE_API_URL=https://api.example.com -t onecube-frontend .
```

El Dockerfile usa Node 20 Alpine para compilar con `npm ci` y nginx Alpine para servir únicamente `dist/` en el puerto **80**. El build falla si no se proporciona `VITE_API_URL`. No se necesitan volúmenes, Node en runtime ni acceso al monorepo. `.dockerignore` excluye dependencias locales, builds, Git, logs, cachés y archivos de entorno locales.

Para una prueba manual posterior (inicia un servidor; no se ejecutó durante la separación):

```sh
docker run --rm -p 8080:80 onecube-frontend
```

Abrir `http://localhost:8080` y comprobar login, llamadas al backend y recarga de una ruta interna.

## Despliegue en Dokploy

1. Publicar este repositorio frontend en tu proveedor Git. La carpeta que contiene este README debe ser la raíz del repositorio, sin envolverla en otra carpeta `frontend/`. No se crearon commits ni branches durante esta separación.
2. Crear una **Application** en Dokploy y vincular el repositorio y la rama que decidas publicar.
3. Elegir **Dockerfile** como método de build, contexto `.` (raíz) y archivo `Dockerfile`. Si la interfaz usa una ruta de directorio de build, seleccionar la raíz `/`; no el antiguo subdirectorio del monorepo.
4. Configurar `VITE_API_URL=https://api.example.com` como **build argument**. Si la versión de Dokploy lo toma de la sección Environment, comprobar que se pasa a los argumentos de construcción. Una variable presente solo en runtime no sirve para Vite. El Dockerfile declara `ARG VITE_API_URL` y exige un valor no vacío.
5. Configurar el dominio público del frontend y el **puerto de destino/contenedor 80**, con HTTPS en Dokploy/Traefik. No usar 5173 ni 4173: son puertos de desarrollo/preview de Vite.
6. Desplegar. Cuando cambie la URL del backend, volver a construir la imagen y redesplegar.
7. Verificar desde el navegador: login, API sin errores CORS, recarga de rutas internas, manifiesto y actualización/instalación de la PWA. Estas comprobaciones requieren el backend coordinado por separado.

No se necesita Docker Compose ni despliegue conjunto con el backend. Dokploy termina TLS; nginx escucha HTTP dentro del contenedor.

## nginx, PWA y dominio

- `nginx.conf` soporta React Router con fallback a `index.html`.
- HTML, manifiesto y assets sin hash se revalidan; `sw.js` no se almacena en caché HTTP. Solo `/assets/` con nombres versionados tiene caché larga. Los assets inexistentes devuelven 404 en lugar de HTML.
- `vite.config.js` genera automáticamente el service worker y usa `registerType: 'autoUpdate'`. No se agregó caché de respuestas API ni almacenamiento offline de datos del backend.
- La app se sirve en la raíz `/` de un dominio, coherente con el router, `start_url`, `scope` y las rutas de iconos. Desplegar en un subdirectorio requeriría cambios adicionales.
- La instalación PWA requiere HTTPS, excepto en localhost. Al cambiar de dominio, la instalación anterior no migra automáticamente.
- Se añadió `public/robots.txt`, ya referenciado por Vite, porque el original solo contenía `public/roboto.txt` con contenido duplicado. Se conserva ese archivo original por compatibilidad.
- `public/robots.txt` y `public/sitemap.xml` apuntan al dominio público heredado `https://app.onecube.cl`. Si se usa otro dominio definitivo, actualizar ambos antes del despliegue. `index.html` conserva la etiqueta pública de verificación de Google del sitio anterior: revisar o reemplazar si cambia su titular/dominio. No es una credencial privada.

## Estructura

```text
src/
  components/     # Componentes, hooks y clientes API
  pages/          # Pantallas
public/           # Iconos, capturas y archivos estáticos
vite.config.js    # React y generación de PWA
Dockerfile        # Build multietapa y nginx
nginx.conf        # SPA, estáticos y política de caché
.env.example      # Única plantilla de entorno versionable
```

## Validación de la separación

Realizada el 2026-10-16, únicamente dentro del destino y sin iniciar servidores:

| Comprobación | Resultado |
| --- | --- |
| Repositorio independiente | `git rev-parse --show-toplevel` apunta al destino. Ya existía un repo sin commits: no se ejecutó `git init`, ni commits ni creación de ramas. |
| Copia | Realizada con `copy_path`. Comparación binaria: los 136 archivos originales de `src/` y `public/` y 7 archivos de configuración/dependencias permanecen iguales en la copia. Solo se añadió `robots.txt` a `public/`. El origen no se modificó. |
| Instalación | `npm ci --cache .npm-cache --no-audit --no-fund`: correcta, 517 paquetes. Caché local ignorada. |
| Build previo a ajustes | `npm run build`: correcto, incluso sin variable; esto no garantizaba conectividad con el backend. |
| Build final con `.env` local | `npm run build`: correcto; PWA generada con 13 entradas precacheadas. |
| PWA | Comprobados manifiesto, iconos, capturas, registro, worker y `robots.txt` en `dist/`; robots incluido en precaché. |
| Lint previo y final | `npm run lint`: ambos fallan con **58 errores y 1 advertencia**; la salida es idéntica antes y después. Se conservaron los problemas heredados, ajenos a la extracción. |
| Exclusiones | `git check-ignore` confirma exclusión de `.env`, `.env.production`, dependencias, caché y build; `.env.example` no está ignorado. |
| Docker/nginx | Docker no está instalado (`docker: command not found`); no fue posible construir la imagen ni ejecutar `nginx -t` dentro de ella. Dockerfile y nginx revisados estáticamente; validación real pendiente en Dokploy o una máquina con Docker. |
| Integración | Sin pruebas de API, login, CORS ni instalación PWA en navegador: requieren backend y entorno de despliegue. |

Advertencias heredadas: bundle JavaScript de unos 537 kB, superior al umbral de 500 kB; paquetes deprecados `sourcemap-codec`, `source-map` beta y `glob`. npm 12 bloqueó el postinstall de esbuild por su política de scripts, pero el build funcionó igualmente. No se actualizaron dependencias ni se ejecutó auditoría de vulnerabilidades. Los errores de lint incluyen variables sin usar y reglas de hooks/refresh; el detalle local quedó en `.baseline-lint.log` y `.validation-lint.log` (ignorados por Git/Docker).
