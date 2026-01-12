# PinCodes Virtuales

Tienda online de pines digitales y tarjetas de regalo Netflix para Colombia, Turquía y más.

## Características

- 🎨 **Diseño Moderno**: Interfaz elegante y profesional con gradientes y animaciones suaves
- 📱 **Totalmente Responsive**: Funciona perfectamente en móviles, tablets y desktop
- 🛒 **Sistema de Carrito**: Gestión completa del carrito de compras con localStorage
- 🔐 **Sistema de Login**: Formulario de autenticación con opción de "recordarme"
- 💬 **Integración WhatsApp**: Botón directo para contactar por WhatsApp
- ❤️ **Lista de Deseos**: Funcionalidad para agregar productos a favoritos
- 🎯 **Vista Rápida**: Previsualización rápida de productos
- 📦 **Gestión de Productos**: Tarjetas de productos con estados (agotado/disponible)

## Estructura del Proyecto

```
personal-website/
├── index.html          # Página principal
├── styles.css          # Estilos CSS completos
├── script.js           # Funcionalidad JavaScript
├── package.json        # Configuración del proyecto
└── README.md          # Documentación
```

## Tecnologías Utilizadas

- **HTML5**: Semántico y accesible
- **CSS3**: Con gradientes, animaciones y diseño responsive
- **JavaScript Vanilla**: Sin dependencias externas
- **Font Awesome**: Iconos profesionales
- **LocalStorage**: Persistencia de datos del carrito

## Funcionalidades Principales

### 🏪 Tienda Virtual
- Catálogo de productos con pines Netflix
- Filtrado por región (Colombia, Turquía, USA)
- Estados de disponibilidad de productos

### 🛒 Carrito de Compras
- Agregar/eliminar productos
- Cálculo automático del total
- Persistencia en localStorage
- Contador de artículos en tiempo real

### 👤 Sistema de Usuarios
- Formulario de login/registro
- Opción "recordarme"
- Gestión de sesión
- UI dinámica según estado de autenticación

### 📱 Diseño Responsive
- Adaptación a todos los dispositivos
- Navegación móvil optimizada
- Touch-friendly interactions

## Instalación y Uso

1. **Clonar o descargar los archivos**
2. **Abrir `index.html`** en tu navegador
3. **Opcional**: Para desarrollo con live-server:
   ```bash
   npm install
   npm run dev
   ```

## Personalización

### Cambiar Colores y Branding
Edita `styles.css` y modifica las variables CSS:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #ffd700;
  --success-color: #25d366;
  --error-color: #ff4757;
}
```

### Agregar Nuevos Productos
Edita `index.html` en la sección `.products-grid`:
```html
<div class="product-card">
    <div class="product-image">
        <img src="URL_IMAGEN" alt="NOMBRE_PRODUCTO">
        <span class="badge sold-out">Agotado</span>
    </div>
    <div class="product-info">
        <h3>NOMBRE_PRODUCTO</h3>
        <!-- ... resto del contenido -->
    </div>
</div>
```

### Configurar WhatsApp
Cambia el número en `script.js`:
```javascript
const phoneNumber = 'TUNUMEROAQUI'; // Sin + ni espacios
```

## Características Técnicas

### Performance
- ✅ Optimizado para velocidad de carga
- ✅ Imágenes con lazy loading
- ✅ CSS y JavaScript minificados (producción)
- ✅ Cache con localStorage

### SEO
- ✅ Meta tags optimizados
- ✅ Estructura semántica HTML5
- ✅ URLs amigables
- ✅ Open Graph ready

### Accesibilidad
- ✅ Navegación por teclado
- ✅ Screen reader friendly
- ✅ Contraste de colores WCAG
- ✅ ARIA labels

## Navegación

- **INICIO**: Página principal con hero section
- **TIENDA**: Catálogo completo de productos
- **RECARGAR CRÉDITOS**: Sistema de recarga de saldo
- **MONEDERO**: Historial y gestión de fondos

## Integraciones

### WhatsApp
- Contacto directo con vendedores
- Mensaje pre-configurado
- Abre en WhatsApp Web/móvil

### Pagos (Placeholder)
- Estructura preparada para integración con:
  - Stripe
  - PayPal
  - Pasarelas locales

## Deploy

La aplicación es 100% estática y puede ser desplegada en:
- Netlify
- Vercel
- GitHub Pages
- Cualquier hosting estático

## Licencia

MIT License - Libre para uso comercial y personal

---

**PinCodes Virtuales** - Tu tienda confiable de pines digitales
