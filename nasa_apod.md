# Rediseñar la pantalla Bitácora Espacial

## Objetivo

Transformar la pantalla Bitácora Espacial de la aplicación NASA en un diario personal de exploración del universo. Actualmente la pantalla resulta visualmente sencilla y poco atractiva. Se busca una experiencia más inmersiva, visual y personal, sin perder la funcionalidad existente.

## Dirección visual

Aplicar Dark Minimalism con una estética de diario de misión espacial.

Paleta de colores:
- Fondo principal: `#080B12`
- Superficies: `#151C2B`
- Superficie elevada: `#202B3D`
- Azul NASA: `#0B3D91`
- Azul de acento: `#58A6FF`
- Rojo NASA: `#FC3D21`
- Texto principal: `#F4F7FB`
- Texto secundario: `#A3ACBC`
- Bordes: `#2B3547`

Mantener una estética minimalista, con jerarquía visual clara, tarjetas con bordes redondeados, imágenes astronómicas y espacios bien distribuidos. Evitar colores ajenos a la paleta, exceso de elementos decorativos, gradientes llamativos y sombras pesadas.

## Estructura de la pantalla

### 1. Encabezado de la bitácora
- Título: "Mi bitácora".
- Subtítulo breve que transmita la idea de un diario personal de exploración.
- Icono relacionado con el registro o la exploración espacial.
- Numeración o identificador de misión únicamente si tiene sentido para el modelo de datos existente.

### 2. Resumen personal
Mostrar estadísticas calculadas a partir de los datos reales:
- Cantidad de entradas creadas.
- Cantidad de descubrimientos guardados.
- Categorías exploradas, si la aplicación las registra.

Utilizar tarjetas compactas con iconos discretos. No inventar contadores ni mostrar valores de demostración en la versión funcional.

### 3. Entrada destacada
Si existen entradas, destacar una de ellas mediante una tarjeta visual que incluya:
- Imagen asociada, si existe.
- Título.
- Fecha.
- Categoría.
- Extracto breve del contenido.
- Acción para abrir la entrada completa.

Si no existen entradas, mostrar un estado vacío atractivo con un mensaje invitando al usuario a registrar su primer descubrimiento y una acción para crear una entrada.

### 4. Lista cronológica de registros
- Mostrar las entradas agrupadas por fecha o mediante una línea temporal.
- Utilizar tarjetas con título, fecha, categoría, extracto e imagen opcional.
- Diferenciar visualmente las categorías mediante iconos o etiquetas discretas.
- Permitir abrir cada entrada para consultar todo su contenido.
- Mantener una lista clara y cómoda de recorrer en dispositivos móviles.

### 5. Crear una nueva entrada
Añadir un botón claramente visible para crear una entrada.

El formulario debe respetar el modelo de datos existente y permitir editar los campos que ya soporte la aplicación. Si corresponde, contemplar:
- Título.
- Texto o reflexión personal.
- Categoría.
- Imagen o descubrimiento relacionado.
- Fecha de creación.

Permitir guardar y editar las entradas, así como eliminarlas si la funcionalidad actual lo permite o se implementa de forma coherente.

### 6. Integración con los descubrimientos
Si la aplicación tiene pantallas de fotografía astronómica o asteroides, permitir que el usuario guarde un descubrimiento desde esas pantallas en su bitácora.

Reutilizar los datos disponibles, como título, imagen, fecha y referencia al objeto, evitando pedir al usuario que vuelva a introducir información que ya existe.

No implementar esta integración mediante datos ficticios ni crear una segunda fuente de verdad innecesaria.

### 7. Búsqueda y filtros
Si encaja con las funcionalidades existentes, permitir:
- Buscar entradas por título.
- Filtrar por categoría.
- Ordenar por fecha.

Mantener los controles compactos y coherentes con el diseño.

## Requisitos técnicos

1. Inspeccionar primero la pantalla actual, el modelo de datos, el almacenamiento, los servicios y la navegación.
2. Conservar las funcionalidades existentes.
3. Reutilizar los componentes y el sistema de tema actuales.
4. Si las entradas se guardan localmente, mantener el mecanismo de persistencia existente.
5. Si el proyecto utiliza una API o base de datos, respetar la arquitectura y las operaciones actuales.
6. Evitar duplicar datos de descubrimientos que ya estén almacenados.
7. Utilizar TypeScript y respetar las convenciones del proyecto Expo.
8. Implementar estados de carga, error y lista vacía cuando correspondan.
9. Respetar las áreas seguras, la accesibilidad y los distintos tamaños de pantalla.
10. No agregar dependencias nuevas sin una justificación concreta.

## Criterios de aceptación

- La pantalla se siente como un diario personal de exploración espacial y no como una lista genérica.
- Las estadísticas corresponden a los datos reales.
- Las entradas se presentan de forma visual y cronológica.
- El usuario puede consultar el contenido completo de cada entrada.
- La creación y edición respetan el almacenamiento existente.
- El estado vacío invita a crear la primera entrada.
- La integración con los descubrimientos reutiliza los datos existentes cuando sea posible.
- La interfaz respeta Dark Minimalism y la paleta definida.
- No se rompe ninguna funcionalidad ni navegación existente.
- Se ejecutan las verificaciones disponibles y se informa de los resultados.

## Forma de trabajo

Antes de modificar archivos, inspeccionar la implementación actual de Bitácora Espacial y determinar cómo se crean, guardan, consultan y editan las entradas.

Implementar el rediseño directamente en el proyecto. No reemplazar el almacenamiento ni rehacer la arquitectura si no es necesario.

Al finalizar, informar los archivos modificados, las funcionalidades implementadas y las verificaciones ejecutadas.
