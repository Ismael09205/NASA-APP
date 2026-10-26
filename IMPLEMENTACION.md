# Implementación UI NASA — Resumen

Estilo: Dark Minimalism (skill `UI_Nasa`). Tokens únicos en `src/constants/nasaTheme.ts`.

## 1. Descubrimiento (`descubrimiento_mejora.md`) — `src/app/(tabs)/apod.tsx`
- Foto APOD a pantalla completa (1:1, `hdurl`), chips "NASA APOD" + fecha. Si es video: miniatura (`thumbs=true`) + botón para abrirlo.
- Título (traducido al español, con el original debajo) y explicación limitada a 3 líneas.
- "Leer explicación completa" → `src/app/apod-detail.tsx` (texto completo; alterna traducción / original NASA).
- Acciones reales: favorito (persistido en AsyncStorage, `useApodFavorites`), compartir (`Share`), guardar en bitácora.
- "Explora más": tarjetas hacia Asteroides y Bitácora.

## 2. Asteroides (`asteroides_tab.md`) — `src/app/(tabs)/asteroids.tsx`
- Encabezado, resumen real (cantidad, rango, última consulta).
- Filtro de fechas: Hoy, Próximos 7 días, Personalizado (valida formato, orden y máximo 7 días).
- Búsqueda por nombre, filtro "Solo PHA", orden por distancia / velocidad / diámetro.
- `AsteroidCard`: distancia y velocidad destacadas; diámetro secundario; etiqueta PHA sin lenguaje alarmista.
- Detalle `src/app/asteroid/[id].tsx`: datos + enlace JPL; los campos ausentes no se muestran.
- Estados: carga, error con reintento, sin conexión, vacío, filtros sin resultados, pull-to-refresh.
- Endpoints: `GET /neo/rest/v1/feed` y `GET /neo/rest/v1/neo/{id}` (cliente `nasaApi` existente).

## 3. Bitácora (`nasa_apod.md`) — `src/app/(tabs)/log.tsx`
- Encabezado "Mi bitácora", botón "Nueva entrada".
- Estadísticas reales: entradas, descubrimientos guardados, categorías exploradas.
- Entrada destacada (la más reciente), lista agrupada por fecha (línea temporal), búsqueda por título, filtro por categoría y orden.
- Estado vacío con acción para crear la primera entrada.
- `src/app/entry/[id].tsx`: detalle, editar y eliminar (con confirmación).
- `src/app/entry/form.tsx`: crear/editar (título, reflexión, categoría, imagen y fecha automática).
- Integración: `SaveToLogButton` guarda desde APOD y desde el detalle de asteroide reutilizando sus datos (sin reintroducir nada); si ya existe, abre la entrada.
- Persistencia: MockAPI vía mutaciones existentes (`addLog`, `editLog`, `deleteLog`); campos nuevos opcionales (`category`, `imageUrl`, `source`, `refId`, `createdAt`). Entradas antiguas siguen funcionando.

## Archivos
**Nuevos:** `src/constants/{nasaTheme,categories}.ts`, `src/api/{neo,translate}.ts`, `src/utils/{dates,format}.ts`, `src/hooks/useApodFavorites.ts`, `src/components/{AppButton,Chip,EmptyState,ErrorState,ScreenHeader,SearchBar,StatCard,AsteroidCard,LogEntryCard,SaveToLogButton}.tsx`, `src/app/apod-detail.tsx`, `src/app/asteroid/[id].tsx`, `src/app/entry/{[id],form}.tsx`.

**Modificados:** `app.json`, `src/app/_layout.tsx` (ahora `Stack` con rutas de detalle), `src/app/(tabs)/{_layout,apod,asteroids,log}.tsx`, `src/api/{client,queries,queryKeys,mutations}.ts`, `src/types/{nasa,log}.ts`, `src/components/OfflineBanner.tsx`.

**Eliminados:** `LogForm.tsx` y `LogItem.tsx` (reemplazados por las pantallas de entrada).

## Verificación
- `npx tsc --noEmit`: sin errores.
- `npx expo lint`: 0 errores, 2 warnings preexistentes (`src/api/client.ts`).
- `npx expo export --platform ios`: compila.
- No probado en dispositivo/simulador.

## Notas
- La API de NASA responde 500/503 de forma intermitente; hay reintentos con espera creciente.
- La traducción usa MyMemory (gratuita, con límites); si falla, se muestra el texto original.
- No se agregaron dependencias.
