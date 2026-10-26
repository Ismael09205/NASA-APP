# Implementar pantalla de Asteroides

## Objetivo
Diseñar e implementar una pantalla de **Asteroides** para la aplicación móvil de NASA, desarrollada con React Native y Expo. La pantalla debe permitir consultar asteroides cercanos a la Tierra (Near-Earth Objects, NEO), revisar sus datos principales y acceder a información detallada de cada objeto.

## Diseño visual

Aplicar el estilo **Dark Minimalism**, priorizando una interfaz moderna, limpia, espacial y fácil de utilizar.

Usar exclusivamente esta paleta de colores para la interfaz:

- Fondo principal: `#080B12`
- Superficie de tarjetas: `#151C2B`
- Superficie elevada: `#202B3D`
- Azul NASA: `#0B3D91`
- Azul de acento: `#58A6FF`
- Rojo NASA: `#FC3D21`
- Texto principal: `#F4F7FB`
- Texto secundario: `#A3ACBC`
- Bordes: `#2B3547`
- Estado positivo: `#7EE0B5`
- Advertencia: `#F5C36A`

Usar el rojo NASA con moderación y reservar los colores de estado para información que realmente lo requiera. Mantener contraste suficiente, espaciado consistente, tarjetas con bordes redondeados de 12–16 px y una jerarquía visual clara.

## Estructura de la pantalla

### 1. Encabezado
- Título: **Asteroides**.
- Subtítulo breve: “Objetos cercanos a la Tierra”.
- Icono relacionado con el espacio o las órbitas.
- Mantener el encabezado compacto y consistente con el resto de la aplicación.

### 2. Resumen de resultados
Mostrar una tarjeta de resumen con:
- Cantidad de asteroides encontrados en la consulta.
- Rango de fechas seleccionado.
- Fecha de última consulta, si se encuentra disponible.

Los valores deben proceder de la respuesta real de la API. No inventar cantidades ni mostrar datos de ejemplo como si fueran reales.

### 3. Filtro por fecha
Permitir seleccionar una fecha o un rango de fechas compatible con la API de NASA.

Incluir accesos rápidos para:
- Hoy.
- Próximos 7 días.
- Selección personalizada, si resulta compatible con el diseño y las restricciones de la API.

Validar las fechas antes de realizar la consulta y respetar los límites del endpoint.

### 4. Lista de asteroides
Mostrar los resultados mediante tarjetas reutilizables. Cada tarjeta debe incluir, cuando los datos estén disponibles:

- Nombre del asteroide.
- Fecha de aproximación más cercana dentro del rango consultado.
- Diámetro estimado mínimo y máximo, en metros o kilómetros.
- Velocidad relativa, expresada en km/s.
- Distancia de aproximación a la Tierra, expresada en kilómetros o unidades astronómicas (UA).
- Indicador de si NASA lo clasifica como potencialmente peligroso.
- Acción visual para acceder al detalle.

Priorizar la distancia de aproximación y la velocidad como datos destacados. Mantener el resto de la información secundaria para evitar tarjetas saturadas.

No confundir la clasificación de potencialmente peligroso con una predicción de impacto. No declarar que un objeto representa un peligro inminente únicamente por su clasificación.

### 5. Búsqueda y filtros
Incluir, si encaja con la estructura actual del proyecto:
- Búsqueda por nombre del asteroide.
- Filtro para mostrar únicamente objetos clasificados como potencialmente peligrosos.
- Ordenamiento por distancia de aproximación, velocidad o diámetro.

Los filtros deben trabajar sobre los datos disponibles y actualizar los resultados mostrados de forma coherente.

### 6. Pantalla de detalle
Al seleccionar una tarjeta, navegar a una pantalla de detalle del asteroide.

Mostrar:
- Nombre y designación del objeto.
- Diámetro estimado mínimo y máximo.
- Velocidad relativa.
- Distancia de aproximación.
- Fecha y hora de aproximación, cuando estén disponibles.
- Clasificación de potencialmente peligroso.
- Enlace externo a la página de datos de NASA, si existe una URL apropiada en la respuesta.

Presentar la información en secciones compactas y fáciles de leer. No mostrar campos vacíos como valores inventados.

### 7. Navegación inferior
Si la aplicación ya utiliza navegación inferior, conservarla y marcar **Asteroides** como la sección activa.

No crear un segundo sistema de navegación ni modificar las demás pantallas sin necesidad.

## Integración con la API

Utilizar NASA Near Earth Object Web Service (NeoWs).

Endpoint de consulta por fechas:

`GET https://api.nasa.gov/neo/rest/v1/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&api_key=API_KEY`

Endpoint para consultar un asteroide por su identificador:

`GET https://api.nasa.gov/neo/rest/v1/neo/{asteroid_id}?api_key=API_KEY`

Requisitos:
- Revisar primero la estructura y las convenciones existentes en el proyecto.
- Reutilizar el cliente HTTP y la configuración de API existentes, si ya están implementados.
- No duplicar la configuración de la clave API.
- No escribir la clave API directamente en los componentes.
- Aprovechar las variables de entorno compatibles con Expo si el proyecto ya las utiliza.
- Adaptar los datos recibidos a los componentes mediante tipos TypeScript.
- Controlar campos ausentes, valores nulos y respuestas inesperadas.
- Evitar consultas duplicadas cuando no sea necesario realizarlas.

## Estados de interfaz

Implementar los siguientes estados:

- **Carga:** indicador visual discreto mientras se consultan los datos.
- **Éxito:** lista de asteroides con información real.
- **Lista vacía:** mensaje explicativo cuando no existen resultados para los filtros seleccionados.
- **Error:** mensaje claro y opción para reintentar la consulta.
- **Sin conexión:** mensaje apropiado si la aplicación no puede acceder a la API.
- **Actualización:** permitir volver a consultar los datos mediante un mecanismo coherente con el proyecto, por ejemplo, pull-to-refresh si se usa una lista compatible.

## Requisitos técnicos

- Utilizar React Native, Expo y TypeScript, respetando las versiones y dependencias actuales del proyecto.
- Reutilizar los componentes, estilos, sistema de navegación y estructura de carpetas existentes.
- Separar la obtención y transformación de datos de la presentación visual.
- Crear componentes reutilizables para las tarjetas de asteroides y los indicadores de estado.
- Mantener los colores centralizados en el sistema de tema existente. Si todavía no existe, crear una configuración centralizada y utilizarla en todos los componentes nuevos.
- Si el proyecto utiliza TanStack Query, aprovechar `useQuery` y sus claves de consulta para gestionar la carga, la caché y las nuevas consultas.
- Si el proyecto ya cuenta con servicios HTTP, utilizarlos en lugar de crear una segunda implementación.
- Respetar las áreas seguras del dispositivo, la navegación existente y las buenas prácticas de accesibilidad.
- Evitar dependencias nuevas cuando la funcionalidad pueda implementarse con las herramientas existentes.

## Restricciones de diseño

- No utilizar gradientes llamativos, neón, glassmorphism ni sombras pesadas.
- No saturar las tarjetas con demasiados datos.
- No usar colores fuera de la paleta definida.
- No inventar información de asteroides ni utilizar cifras ilustrativas en la versión funcional.
- No modificar las pantallas que no formen parte de este requerimiento, salvo que sea indispensable para integrar la navegación.
- No reemplazar la arquitectura existente por otra nueva.

## Criterios de aceptación

1. La pantalla de Asteroides se visualiza correctamente en dispositivos móviles.
2. Los asteroides se obtienen de la API real de NASA.
3. El usuario puede consultar los objetos correspondientes a un rango de fechas válido.
4. Cada tarjeta presenta los datos principales disponibles sin inventar valores.
5. El usuario puede acceder al detalle de un asteroide.
6. La búsqueda y los filtros funcionan correctamente si se implementan.
7. Los estados de carga, error, lista vacía y reintento están implementados.
8. La interfaz respeta la paleta Dark Minimalism y el sistema visual de la aplicación.
9. La implementación no rompe las pantallas ni la navegación existentes.
10. Se ejecutan las verificaciones disponibles del proyecto y se corrigen los errores introducidos.

## Forma de trabajo

Antes de modificar archivos, inspeccionar la estructura del proyecto, identificar la navegación, los servicios de API, el sistema de estilos y los componentes reutilizables.

Después, implementar la funcionalidad siguiendo las convenciones actuales. Al finalizar, informar:
- Archivos creados y modificados.
- Funcionalidades implementadas.
- Endpoint utilizado.
- Verificaciones ejecutadas y sus resultados.
- Configuración adicional necesaria para ejecutar la pantalla.

Implementar la funcionalidad real, no limitarse a generar una maqueta visual.
