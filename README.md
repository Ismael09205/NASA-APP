# NASA Space Explorer

Aplicación móvil desarrollada con Expo, React Native y TypeScript para consultar el descubrimiento astronómico del día de NASA (APOD), explorar asteroides cercanos a la Tierra y guardar observaciones en una bitácora personal.

## Requisitos y ejecución

- Node.js y npm.
- Una clave de API de NASA.
- Una URL de MockAPI para almacenar las entradas de la bitácora.

Define estas variables en el entorno local; no guardes claves reales en el repositorio:

```env
EXPO_PUBLIC_NASA_API_KEY=tu_clave_de_nasa
EXPO_PUBLIC_MOCKAPI_URL=https://tu-api.mockapi.io
```

Instala las dependencias y ejecuta la app:

```bash
npm install
npx expo start
```

Comprobaciones disponibles:

```bash
npx expo lint
npx tsc --noEmit
```

## Recorrido de la aplicación

La navegación usa Expo Router: los archivos dentro de `src/app/` representan pantallas y las carpetas con `_layout.tsx` definen sus navegadores.

| Archivo | Responsabilidad |
| --- | --- |
| [`src/app/_layout.tsx`](./src/app/_layout.tsx) | Inicializa el estado de conexión, React Query y la persistencia de caché en AsyncStorage. Al restaurar el estado persistido, reanuda las mutaciones que quedaron pausadas. |
| [`src/app/(tabs)/_layout.tsx`](<./src/app/(tabs)/_layout.tsx>) | Configura la navegación inferior entre Descubrimiento, Asteroides y Mi bitácora. |
| [`src/app/(tabs)/apod.tsx`](<./src/app/(tabs)/apod.tsx>) | Muestra la imagen o el contenido multimedia APOD, permite compartirlo y marcarlo como favorito o guardarlo en la bitácora. También enlaza a su explicación completa. |
| [`src/app/apod-detail.tsx`](./src/app/apod-detail.tsx) | Presenta la explicación completa de APOD en español y permite alternar al texto original de NASA. |
| [`src/app/(tabs)/asteroids.tsx`](<./src/app/(tabs)/asteroids.tsx>) | Consulta asteroides cercanos; permite elegir fechas, buscar, filtrar por PHA y ordenar por distancia, velocidad o diámetro. |
| [`src/app/asteroid/[id].tsx`](<./src/app/asteroid/[id].tsx>) | Muestra los datos de un asteroide, reutiliza primero los datos disponibles del feed en caché y ofrece el enlace de NASA/JPL y la opción de guardarlo. |
| [`src/app/(tabs)/log.tsx`](<./src/app/(tabs)/log.tsx>) | Lista las entradas de la bitácora, destaca la más reciente, agrupa por fecha y ofrece búsqueda, filtros y estadísticas. |
| [`src/app/entry/form.tsx`](<./src/app/entry/form.tsx>) | Crea o edita entradas. Valida el formulario y envía la operación mediante las mutaciones `addLog` o `editLog`. |
| [`src/app/entry/[id].tsx`](<./src/app/entry/[id].tsx>) | Presenta una entrada, permite editarla o eliminarla, y enlaza al descubrimiento del que proviene cuando corresponde. |

## TanStack Query: consultas, caché y mutaciones

TanStack Query administra los datos remotos de NASA y la bitácora. Las pantallas consumen hooks compartidos, en vez de implementar peticiones de red en cada componente.

### Archivos centrales

| Archivo | Responsabilidad |
| --- | --- |
| [`src/api/queryClient.ts`](./src/api/queryClient.ts) | Crea la instancia compartida de `QueryClient`. Configura los datos de consultas para permanecer en memoria hasta 48 horas (`gcTime`) y reintenta consultas fallidas dos veces por defecto. |
| [`src/api/queryKeys.ts`](./src/api/queryKeys.ts) | Define claves consistentes para identificar consultas de NASA y de la bitácora. Las claves permiten leer o invalidar grupos específicos de datos. |
| [`src/api/queries.ts`](./src/api/queries.ts) | Define las consultas y hooks: `useLogs`, `useApod`, `useAsteroids`, `useAsteroidDetail` y traducción. Aquí se establecen sus claves, funciones de carga y tiempos de frescura. |
| [`src/api/mutations.ts`](./src/api/mutations.ts) | Registra las funciones por defecto de crear, editar y eliminar entradas, junto con la invalidación de caché y logs de depuración. |
| [`src/api/client.ts`](./src/api/client.ts) | Configura los clientes Axios para NASA y MockAPI. Añade la clave de NASA a las solicitudes de ese servicio. |
| [`src/app/_layout.tsx`](./src/app/_layout.tsx) | Envuelve la app con `PersistQueryClientProvider`, guarda y restaura estado desde AsyncStorage por hasta 24 horas y conecta TanStack Query con los cambios de red de Expo. |

### Qué ocurre al crear una entrada

1. `src/app/entry/form.tsx` valida título, nota y categoría con Zod y React Hook Form. Después llama `mutate` con la clave `['addLog']`.
2. En `src/api/mutations.ts`, `queryClient.setMutationDefaults(['addLog'], ...)` asocia esa clave con la función que hace `POST /logs` mediante MockAPI. Registrar esta función por defecto es importante: una mutación persistida guarda su estado y variables, pero no puede guardar una función JavaScript para ejecutarla después de reiniciar la app.
3. El `onlineManager` de TanStack Query recibe el estado de Expo Network. Si la mutación no puede ejecutarse por falta de conexión, queda pausada en lugar de descartarse.
4. `PersistQueryClientProvider` conserva el estado de consultas y mutaciones en AsyncStorage. Al restaurarlo, `_layout.tsx` llama `resumePausedMutations()`; cuando vuelve la conexión, TanStack Query reintenta la mutación usando la función por defecto registrada.
5. Si el servidor confirma la operación, `onSuccess` invalida `queryKeys.log.lists()`. La consulta de la bitácora puede volver a cargarse para mostrar el estado del servidor. Los errores se registran con `onError`.

El formulario vuelve a la pantalla anterior inmediatamente si la mutación queda en cola offline, y evita repetir la navegación cuando el envío pendiente se confirma más tarde. La lista descarta entradas que compartan el mismo `id` para mantener claves únicas en `SectionList`.

Las operaciones de editar (`PUT /logs/:id`) y eliminar (`DELETE /logs/:id`) siguen el mismo patrón. La edición invalida la lista y el detalle correspondiente; la eliminación invalida la lista.

**Importante:** la entrada pendiente se muestra en la bitácora leyendo las variables de la mutación activa de TanStack Query; no se agrega como si ya estuviera confirmada por el servidor en `useLogs`. La tarjeta indica «Pendiente de envío» mientras no hay conexión y «Enviando al servidor» cuando se reanuda. Al confirmarse, se invalida la lista y la tarjeta temporal se reemplaza por el registro del servidor.

### Cómo interpretar los logs de desarrollo

En modo desarrollo, los mensajes de red y bitácora incluyen una hora local. Al iniciar, el layout registra cuántas entradas de bitácora y cuántas mutaciones pausadas restauró de la caché. Al crear una entrada sin conexión se registra cuándo queda pendiente; al volver a abrir la app y reconectar, se puede observar cuándo se reanuda, cuándo se envía y si el servidor la acepta o devuelve un error. `useLogs` registra la lista visible y las solicitudes/respuestas del servidor.

## Otras áreas importantes de `src/`

### API y transformación

| Archivo | Responsabilidad |
| --- | --- |
| [`src/api/neo.ts`](./src/api/neo.ts) | Convierte la respuesta de NeoWs a un modelo uniforme para la interfaz, incluyendo fechas, distancia, velocidad y diámetro. |
| [`src/api/translate.ts`](./src/api/translate.ts) | Traduce texto de inglés a español con MyMemory. Divide el texto en fragmentos para respetar el límite por solicitud. |

### Hooks y tipos

| Archivo | Responsabilidad |
| --- | --- |
| [`src/hooks/useNetworkStatus.ts`](./src/hooks/useNetworkStatus.ts) | Expone a los componentes el estado de conectividad observado con Expo Network. |
| [`src/hooks/useApodFavorites.ts`](./src/hooks/useApodFavorites.ts) | Guarda localmente en AsyncStorage las fechas APOD marcadas como favoritas. |
| [`src/types/log.ts`](./src/types/log.ts) | Define la estructura y el origen posible de una entrada de bitácora. |
| [`src/types/nasa.ts`](./src/types/nasa.ts) | Define las respuestas usadas de NASA y el modelo normalizado de asteroide que consume la UI. |

### Componentes reutilizables

| Archivo | Responsabilidad |
| --- | --- |
| [`src/components/AppButton.tsx`](./src/components/AppButton.tsx) | Botón compartido con variantes, icono, estado de carga y accesibilidad. |
| [`src/components/Chip.tsx`](./src/components/Chip.tsx) | Etiqueta seleccionable o informativa para categorías, fechas y estados. |
| [`src/components/SearchBar.tsx`](./src/components/SearchBar.tsx) | Campo de búsqueda con acción para borrar el texto. |
| [`src/components/ScreenHeader.tsx`](./src/components/ScreenHeader.tsx) | Encabezado consistente que respeta el área segura del dispositivo. |
| [`src/components/EmptyState.tsx`](./src/components/EmptyState.tsx) | Presenta estados vacíos y una acción opcional. |
| [`src/components/ErrorState.tsx`](./src/components/ErrorState.tsx) | Presenta un error y la acción para reintentar. |
| [`src/components/ApodCard.tsx`](./src/components/ApodCard.tsx) | Archivo vacío actualmente; no participa en la interfaz activa. |
| [`src/components/AsteroidCard.tsx`](./src/components/AsteroidCard.tsx) | Tarjeta de asteroide con métricas y clasificación PHA. |
| [`src/components/LogEntryCard.tsx`](./src/components/LogEntryCard.tsx) | Tarjeta de bitácora reutilizable, con variante destacada e imagen opcional. |
| [`src/components/SaveToLogButton.tsx`](./src/components/SaveToLogButton.tsx) | Evita duplicar un descubrimiento guardado y enlaza a su entrada; si aún no existe, abre el formulario con los datos iniciales. |
| [`src/components/OfflineBanner.tsx`](./src/components/OfflineBanner.tsx) | Banner reutilizable para informar que el dispositivo no tiene conexión. |
| [`src/components/StatCard.tsx`](./src/components/StatCard.tsx) | Tarjeta compacta para mostrar una métrica y su etiqueta. |

### Configuración visual y utilidades

| Archivo | Responsabilidad |
| --- | --- |
| [`src/constants/nasaTheme.ts`](./src/constants/nasaTheme.ts) | Tokens de color, espaciado, radios y tamaño mínimo táctil del tema oscuro NASA. |
| [`src/constants/categories.ts`](./src/constants/categories.ts) | Categorías de bitácora e icono asociado a cada una. |
| [`src/constants/theme.ts`](./src/constants/theme.ts) | Constantes de tema heredadas del template Expo; las pantallas principales usan `nasaTheme.ts`. |
| [`src/utils/dates.ts`](./src/utils/dates.ts) | Rangos de fecha, validación del rango para NeoWs y formato localizado en español. |
| [`src/utils/format.ts`](./src/utils/format.ts) | Formato de distancias, unidades astronómicas, velocidades y diámetros. |
| [`src/utils/logTimestamp.ts`](./src/utils/logTimestamp.ts) | Proporciona la hora local que se añade a los logs de diagnóstico. |
| [`src/global.css`](./src/global.css) | Variables de fuentes usadas en la plataforma web. |

## Variables de entorno

- `EXPO_PUBLIC_NASA_API_KEY`: clave para consultar la API de NASA.
- `EXPO_PUBLIC_MOCKAPI_URL`: URL base del recurso MockAPI que contiene `/logs`.

Las variables con prefijo `EXPO_PUBLIC_` se incorporan al cliente de la app. No coloques secretos que deban mantenerse confidenciales en ellas ni compartas un archivo `.env` con valores reales.
