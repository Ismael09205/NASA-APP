## Identidad visual: NASA Dark Minimalism

### Objetivo
Aplicar un estilo Dark Minimalism a la aplicación móvil NASA Space Explorer, combinando una interfaz científica sobria con colores inspirados en la identidad institucional de NASA.

### Paleta de colores

Definir los siguientes tokens como fuente única de verdad:

- `background`: `#080B12` — fondo principal.
- `surface`: `#151C2B` — tarjetas y superficies.
- `surfaceElevated`: `#202B3D` — modales y elementos elevados.
- `nasaBlue`: `#0B3D91` — azul institucional inspirado en NASA.
- `nasaRed`: `#FC3D21` — rojo característico de NASA.
- `accentBlue`: `#58A6FF` — enlaces, botones principales y selección.
- `textPrimary`: `#F4F7FB` — texto principal.
- `textSecondary`: `#A3ACBC` — descripciones y metadatos.
- `border`: `#2B3547` — separadores y bordes.
- `success`: `#7EE0B5` — estados positivos.
- `warning`: `#F5C36A` — advertencias.

### Reglas de uso del color

1. Mantener los fondos oscuros como base de todas las pantallas.
2. Utilizar `nasaBlue` y `accentBlue` para navegación, selección y acciones.
3. Reservar `nasaRed` para acentos puntuales, detalles de identidad y estados que realmente requieran atención.
4. No utilizar el rojo como decoración repetida ni representar riesgos científicos sin datos que los respalden.
5. Mantener el texto principal en tonos claros y verificar el contraste.
6. No introducir colores adicionales fuera de los tokens sin una justificación funcional.
7. No cambiar la paleta entre pantallas.

### Diseño móvil

- Desarrollar para React Native y Expo.
- Utilizar una columna principal y desplazamiento vertical.
- Priorizar fotografías astronómicas y contenido científico real.
- Usar tarjetas con radios de 12–16 px, bordes discretos y padding consistente.
- Mantener una navegación inferior sencilla con iconos y etiquetas.
- Respetar safe areas, teclado, tamaños de pantalla y áreas táctiles.
- Implementar estados de carga, error, reintento y contenido vacío.
- Evitar sombras pesadas, neones excesivos y glassmorphism generalizado.

### Implementación

1. Inspeccionar el proyecto antes de modificar archivos.
2. Centralizar los tokens en un módulo de tema reutilizable.
3. Aplicar los tokens a todas las pantallas y componentes.
4. Reutilizar los componentes existentes y conservar la lógica de negocio.
5. Verificar contraste, legibilidad y comportamiento en diferentes tamaños.
6. Ejecutar las comprobaciones disponibles y reportar los archivos modificados.

La identidad visual debe ser consistente, accesible y funcional. No basta con cambiar el fondo a negro: todos los componentes deben respetar el mismo sistema de diseño.