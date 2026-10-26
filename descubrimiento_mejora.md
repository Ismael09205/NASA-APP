# Rediseñar la pantalla principal de NASA APOD

## Objetivo

Mejorar la pantalla principal de la aplicación móvil desarrollada con React Native, Expo y TypeScript. Actualmente muestra una fotografía de NASA junto con una descripción demasiado extensa. El objetivo es convertirla en una portada de exploración espacial visual, moderna y fácil de utilizar, manteniendo la información real obtenida de la API de NASA.

## Dirección visual

Aplicar el estilo Dark Minimalism y respetar la paleta existente:

- Fondo principal: `#080B12`
- Superficies: `#151C2B`
- Superficie elevada: `#202B3D`
- Azul NASA: `#0B3D91`
- Azul de acento: `#58A6FF`
- Rojo NASA: `#FC3D21`
- Texto principal: `#F4F7FB`
- Texto secundario: `#A3ACBC`
- Bordes: `#2B3547`

Priorizar la fotografía astronómica, el espacio en blanco, la legibilidad y una jerarquía visual clara. Evitar interfaces saturadas, tarjetas innecesarias, gradientes llamativos y sombras pesadas.

## Estructura de la pantalla

### 1. Fotografía principal

- Mostrar la imagen astronómica del día (APOD) obtenida de la API de NASA.
- Darle protagonismo visual, utilizando una proporción apropiada para móviles.
- Mantener un diseño limpio que permita apreciar la fotografía.
- Mostrar la fecha y una etiqueta discreta que identifique el contenido como NASA APOD.
- Si la respuesta contiene un vídeo u otro tipo de medio, adaptar la interfaz al tipo de contenido sin asumir que siempre habrá una imagen.

### 2. Información resumida

Debajo de la fotografía, mostrar:
- Título original de la publicación.
- Fecha de publicación.
- Una versión resumida visualmente de la explicación.

En la pantalla principal, limitar la descripción a aproximadamente 2–3 líneas mediante las propiedades adecuadas de React Native. Añadir una acción visible, como «Leer explicación completa», que permita abrir una pantalla de detalle o expandir el texto.

No eliminar ni sobrescribir la explicación original de NASA. El detalle debe mostrar el contenido completo recibido de la API.

No generar resúmenes ficticios ni modificar el significado de la información científica.

### 3. Acciones sobre la publicación

Incluir acciones compactas para:
- Guardar o quitar de favoritos.
- Compartir la publicación.
- Consultar otras fechas, si la aplicación ya dispone de esta funcionalidad o puede integrarse sin duplicar lógica.

Las acciones deben funcionar realmente. No agregar botones decorativos que no tengan comportamiento.

### 4. Sección «Explora más»

Debajo del contenido principal, añadir tarjetas compactas que permitan navegar a las secciones existentes, priorizando:
- Asteroides.
- Galería o exploración de imágenes.
- Otras secciones que ya existan en la aplicación.

Reutilizar el sistema de navegación actual. No crear rutas duplicadas ni modificar pantallas no relacionadas.

### 5. Diseño adaptable

- Mantener compatibilidad con diferentes tamaños de pantalla.
- Respetar las áreas seguras del dispositivo.
- Evitar que el texto o las acciones queden cortados.
- Permitir desplazamiento vertical cuando el contenido exceda la altura disponible.
- Mantener tamaños táctiles y contraste adecuados.

## Requisitos técnicos

1. Inspeccionar primero la implementación actual y conservar la arquitectura existente.
2. Reutilizar el servicio que consulta la API de NASA y sus tipos TypeScript.
3. No duplicar llamadas a la API ni la configuración de la clave.
4. Conservar los estados de carga, error, reintento y contenido vacío.
5. Si existe una pantalla de detalle, reutilizarla; crear una nueva solo si es necesario.
6. Centralizar los colores en el tema existente.
7. Si el proyecto utiliza TanStack Query, respetar sus claves de consulta, caché y convenciones.
8. No introducir dependencias nuevas sin una necesidad clara.
9. Mantener el contenido y los metadatos reales de NASA.
10. Verificar que los botones, la navegación y la presentación del contenido funcionen correctamente.

## Criterios de aceptación

- La fotografía es el elemento visual principal.
- La descripción extensa no ocupa toda la pantalla inicial.
- El usuario puede acceder a la explicación completa.
- Las acciones de favoritos y compartir funcionan si se implementan.
- La sección de exploración navega a las pantallas existentes.
- El diseño respeta Dark Minimalism y la paleta definida.
- No se rompe la funcionalidad actual ni la integración con la API.
- Se ejecutan las verificaciones disponibles y se informa de sus resultados.

## Forma de trabajo

Inspeccionar primero los archivos existentes, identificar la pantalla principal, el servicio APOD, el sistema de navegación y los componentes reutilizables. Implementar el rediseño directamente en el proyecto, evitando reescribir funcionalidades que ya existen.

Al terminar, informar los archivos modificados, las mejoras implementadas y las verificaciones ejecutadas.