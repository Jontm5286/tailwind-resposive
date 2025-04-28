# Tailwind Responsive Plugin

## Description
A Tailwind CSS plugin that enhances responsive design capabilities, providing additional utilities and breakpoints for creating more flexible and adaptable layouts.

## Descripción
Un plugin para Tailwind CSS que mejora las capacidades de diseño responsivo, proporcionando utilidades y puntos de ruptura adicionales para crear diseños más flexibles y adaptables.

## Installation / Instalación

### English
```bash
npm install tailwind-responsive
```

Add the plugin to your `tailwind.config.js` file:

```javascript
module.exports = {
  plugins: [
    require('tailwind-responsive'),
    // other plugins...
  ],
}
```

### Español
```bash
npm install tailwind-responsive
```

Agrega el plugin a tu archivo `tailwind.config.js`:

```javascript
module.exports = {
  plugins: [
    require('tailwind-responsive'),
    // otros plugins...
  ],
}
```

## Usage / Uso

### English
The plugin adds additional responsive utilities that are accessible using Tailwind's responsive prefixes.

Example:
```html
<div class="flex-col md:flex-row lg:flex-col-reverse xl:gap-8">
  <!-- Content here -->
</div>
```

### Español
El plugin agrega utilidades responsivas adicionales que son accesibles utilizando los prefijos responsivos de Tailwind.

Ejemplo:
```html
<div class="flex-col md:flex-row lg:flex-col-reverse xl:gap-8">
  <!-- Contenido aquí -->
</div>
```

## Configuration / Configuración

### English
You can customize the plugin by passing an options object to the plugin function:

```javascript
module.exports = {
  plugins: [
    require('tailwind-responsive')({
      breakpoints: {
        'xs': '320px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      container: {
        center: true,
        padding: '1rem',
      },
    }),
  ],
}
```

### Español
Puedes personalizar el plugin pasando un objeto de opciones a la función del plugin:

```javascript
module.exports = {
  plugins: [
    require('tailwind-responsive')({
      breakpoints: {
        'xs': '320px',
        '2xl': '1536px',
        '3xl': '1920px',
      },
      container: {
        center: true,
        padding: '1rem',
      },
    }),
  ],
}
```

## Available Options / Opciones Disponibles

### English
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `breakpoints` | Object | `{}` | Additional breakpoints to add to Tailwind's default set |
| `container` | Object | `{}` | Container configuration options |
| `useRem` | Boolean | `true` | Use rem units instead of px for breakpoints |

### Español
| Opción | Tipo | Valor Predeterminado | Descripción |
|--------|------|---------------------|-------------|
| `breakpoints` | Objeto | `{}` | Puntos de ruptura adicionales para agregar al conjunto predeterminado de Tailwind |
| `container` | Objeto | `{}` | Opciones de configuración del contenedor |
| `useRem` | Booleano | `true` | Usar unidades rem en lugar de px para puntos de ruptura |

## License / Licencia

### English
This project is licensed under the MIT License - see the LICENSE file for details.

### Español
Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo LICENSE para más detalles.

