// DOM Elements
const checkoutModal = document.getElementById('checkoutModal');
const cartBtn = document.querySelector('.cart .btn');
const navLinks = document.querySelectorAll('.nav-menu a');

// Cart functionality
let cart = {
    items: [],
    total: 0
};

// USDT Wallet Configuration
const USDT_WALLET = 'TCJMLCURwm53B3e7Vrtyv2oohDkvZa5HaT'; // Wallet USDT TRC20

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadCartFromStorage();
    updateCartUI();
    setupColombiaValueSelector();
});

// Setup Event Listeners
function setupEventListeners() {
    // Navigation
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        setupProductCard(card);
    });
    
    // Payment method change
    const paymentMethod = document.getElementById('paymentMethod');
    if (paymentMethod) {
        paymentMethod.addEventListener('change', updatePaymentDetails);
    }
    
    // Close modal on outside click
    window.addEventListener('click', function(e) {
        if (e.target === checkoutModal) {
            closeCheckout();
        }
    });
}

// Navigation
function handleNavigation(e) {
    e.preventDefault();
    
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    e.currentTarget.classList.add('active');
    
    // Smooth scroll to section (if exists)
    const targetId = e.currentTarget.getAttribute('href').substring(1);
    const targetSection = document.getElementById(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Product Card Setup
function setupProductCard(card) {
    const quickViewBtn = card.querySelector('.product-actions .btn:first-child');
    const wishlistBtn = card.querySelector('.product-actions .btn:last-child');
    
    if (quickViewBtn) {
        quickViewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = card.querySelector('h3').textContent;
            showQuickView(productName);
        });
    }
    
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleWishlist(wishlistBtn, card);
        });
    }
}

// Add to Cart Function
function addToCart(productName, price, quantity = 1) {
    const actualQuantity = parseInt(quantity) || 1;
    
    const existingItem = cart.items.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += actualQuantity;
    } else {
        cart.items.push({
            id: Date.now(),
            name: productName,
            price: price,
            quantity: actualQuantity
        });
    }
    
    updateCartTotal();
    saveCartToStorage();
    updateCartUI();
    
    showNotification(`${productName} (${actualQuantity} unidad${actualQuantity > 1 ? 'es' : ''}) añadido al carrito`, 'success');
    
    // Open checkout modal
    setTimeout(() => {
        openCheckout();
    }, 1000);
}

// Quantity Functions
function increaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    const currentValue = parseInt(input.value);
    const maxValue = parseInt(input.max);
    
    if (currentValue < maxValue) {
        input.value = currentValue + 1;
    }
}

function decreaseQuantity(productId) {
    const input = document.getElementById(`qty-${productId}`);
    const currentValue = parseInt(input.value);
    const minValue = parseInt(input.min);
    
    if (currentValue > minValue) {
        input.value = currentValue - 1;
    }
}

// Cart Functions
function updateCartTotal() {
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    const cartTotal = document.querySelector('.cart-price');
    
    const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
    
    if (cartCount) cartCount.textContent = itemCount;
    if (cartTotal) cartTotal.textContent = `$${cart.total.toFixed(2)} USD`;
}

// Checkout Functions
function openCheckout() {
    if (cart.items.length === 0) {
        showNotification('El carrito está vacío', 'warning');
        return;
    }
    
    updateCheckoutSummary();
    checkoutModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeCheckout() {
    checkoutModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function updateCheckoutSummary() {
    const cartItemsContainer = document.getElementById('cartItems');
    const checkoutTotal = document.getElementById('checkoutTotal');
    
    // Clear current items
    cartItemsContainer.innerHTML = '';
    
    // Add items to summary with controls
    cart.items.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-details">
                <div class="cart-item-info">
                    <strong>${item.name}</strong>
                    <div class="cart-item-price">$${item.price.toFixed(2)} USD c/u</div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls-small">
                        <button type="button" onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})" 
                                ${item.quantity <= 1 ? 'disabled' : ''}>-</button>
                        <span>${item.quantity}</span>
                        <button type="button" onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})"
                                ${item.quantity >= 10 ? 'disabled' : ''}>+</button>
                    </div>
                    <button type="button" class="btn-remove" onclick="removeFromCart(${item.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="cart-item-total">
                $${(item.price * item.quantity).toFixed(2)} USD
            </div>
        `;
        cartItemsContainer.appendChild(itemElement);
    });
    
    // Update total
    checkoutTotal.textContent = `$${cart.total.toFixed(2)} USD`;
}

// Update cart item quantity
function updateCartItemQuantity(itemId, newQuantity) {
    if (newQuantity < 1 || newQuantity > 10) return;
    
    const item = cart.items.find(item => item.id === itemId);
    if (item) {
        item.quantity = newQuantity;
        updateCartTotal();
        saveCartToStorage();
        updateCartUI();
        updateCheckoutSummary();
        
        showNotification(`Cantidad actualizada: ${item.name} x${newQuantity}`, 'info');
    }
}

// Remove item from cart
function removeFromCart(itemId) {
    const item = cart.items.find(item => item.id === itemId);
    if (item) {
        cart.items = cart.items.filter(item => item.id !== itemId);
        updateCartTotal();
        saveCartToStorage();
        updateCartUI();
        updateCheckoutSummary();
        
        showNotification(`${item.name} eliminado del carrito`, 'info');
        
        // Close modal if cart is empty
        if (cart.items.length === 0) {
            closeCheckout();
        }
    }
}

// Process Checkout
function processCheckout(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const paymentProofFile = document.getElementById('paymentProof').files[0];
    
    // Llenar campos ocultos para Netlify Forms
    document.getElementById('carrito-productos').value = cart.items.map(item => 
        `${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)} USD`
    ).join('\n');
    
    document.getElementById('total-pedido').value = `$${cart.total.toFixed(2)} USD`;
    document.getElementById('fecha-pedido').value = new Date().toLocaleString('es-CO');
    
    const orderData = {
        customerEmail: formData.get('customerEmail'),
        customerName: formData.get('customerName'),
        txHash: formData.get('txHash'),
        cart: cart,
        total: cart.total,
        timestamp: new Date().toISOString(),
        paymentProof: paymentProofFile ? paymentProofFile.name : null
    };
    
    // Show loading
    const submitBtn = event.target.querySelector('button[type="submit"]');
    showLoading(submitBtn);
    
    // Simulate order processing
    setTimeout(() => {
        hideLoading(submitBtn);
        
        // PRIMERO: Cerrar modal y vaciar carrito
        cart = { items: [], total: 0 };
        saveCartToStorage();
        updateCartUI();
        closeCheckout();
        
        // SEGUNDO: Enviar emails (cliente y vendedor)
        sendEmailSummary(orderData);
        sendEmailToSeller(orderData);
        
        // Mostrar notificación de éxito
        showNotification('¡Pedido enviado! Recibirás un email con los detalles', 'success');
        
    }, 2000);

// File Upload Functions
let uploadedFile = null;

    }
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        // Check if file is image
        if (!file.type.startsWith('image/')) {
            showNotification('Por favor sube solo archivos de imagen', 'error');
            event.target.value = '';
            return;
        }
        
        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification('El archivo no puede ser mayor a 5MB', 'error');
            event.target.value = '';
            return;
        }
        
        uploadedFile = file;
        
        // Show preview
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('preview-image').src = e.target.result;
            document.getElementById('file-preview').style.display = 'block';
            document.getElementById('file-name').textContent = file.name;
        };
        reader.readAsDataURL(file);
        
        showNotification('Comprobante de pago cargado', 'success');
    }
}

function removeFile() {
    uploadedFile = null;
    document.getElementById('paymentProof').value = '';
    document.getElementById('file-preview').style.display = 'none';
    document.getElementById('preview-image').src = '';
    document.getElementById('file-name').textContent = 'Haz clic para subir captura de pantalla del pago';
    showNotification('Comprobante eliminado', 'info');
}

function resetFileUpload() {
    removeFile();
}

// Send Email Summary (Simulated)
function sendEmailSummary(orderData) {
    const emailContent = `
        📧 RESUMEN DE TU PEDIDO - PinCodes Virtuales
        
        🛒 Productos:
        ${orderData.cart.map(item => `- ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)} USD`).join('\n')}
        
        💰 Total: $${orderData.total.toFixed(2)} USD
        
        💳 Hash de Transacción: ${orderData.txHash}
        
        ⏰ Tiempo de entrega: 1-5 minutos
        
        🎯 Tus pines Netflix serán enviados a este correo una vez confirmado el pago.
        
        Gracias por tu compra en PinCodes Virtuales!
    `;
    
    // Enviar email con EmailJS
    const templateParams = {
        email: orderData.customerEmail,
        customer_name: orderData.customerName || 'Cliente',
        order_id: Date.now(),
        products: cart.items.map(item => `${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)} USD`).join('\n'),
        total: `$${cart.total.toFixed(2)} USD`,
        tx_hash: orderData.txHash,
        wallet: 'TCJMLCURwm53B3e7Vrtyv2oohDkvZa5HaT',
        payment_proof: orderData.paymentProof || 'No adjuntado'
    };

    emailjs.send('service_pq8gsmr', 'template_gdmpoud    ', templateParams)
        .then(function(response) {
            console.log('Email enviado exitosamente:', response.status);
            showNotification(`Email de confirmación enviado a ${orderData.customerEmail}`, 'success');
                    
    })
    .catch(function(error) {
        console.error('Error al enviar email:', error);
    });
}
// Send Email to Seller (TÚ)
function sendEmailToSeller(orderData) {
    const sellerEmailContent = `
        🛒 NUEVO PEDIDO RECIBIDO - PinCodes Virtuales
        
        📧 Cliente: ${orderData.customerEmail}
        👤 Nombre: ${orderData.customerName || 'No proporcionado'}
        
        🛍️ Pedido:
        ${orderData.cart.map(item => `- ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)} USD`).join('\n')}
        
        💰 Total: $${orderData.total.toFixed(2)} USD
        
        💳 Hash de Transacción: ${orderData.txHash}
        
        📎 Comprobante de Pago: ${orderData.paymentProof || 'No adjuntado'}
        
        ⏰ Fecha: ${new Date().toLocaleString('es-CO')}
        
        🔍 VERIFICAR PAGO EN BLOCKCHAIN
        🎯 ENVIAR PINES AL CLIENTE DESPUÉS DE CONFIRMAR
        
        Wallet: TCJMLCURwm53B3e7Vrtyv2oohDkvZa5HaT
    `;
    
// Enviar email real con EmailJS
    const sellerTemplateParams = {
        customer_email: orderData.customerEmail,
        customer_name: orderData.customerName || 'No proporcionado',
        order_id: Date.now(),
        products: cart.items.map(item => `${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)} USD`).join('\n'),
        total: `$${cart.total.toFixed(2)} USD`,
        tx_hash: orderData.txHash,
        wallet: 'TCJMLCURwm53B3e7Vrtyv2oohDkvZa5HaT',
        order_date: new Date().toLocaleString('es-CO')
    };    
    emailjs.send('service_pq8gsmr', 'template_1d9l65o', sellerTemplateParams)
        .then(function(response) {
            console.log('Email enviado al vendedor exitosamente:', response.status);
        })
        .catch(function(error) {
            console.error('Error al enviar email al vendedor:', error);
        })
}

// Send WhatsApp Notification (SOLO PARA TI - EL VENDEDOR)
function sendWhatsAppNotification(orderData) {
    const message = `
        NUEVO PEDIDO - PinCodes Virtuales
        🛒 NUEVO PEDIDO - PinCodes Virtuales
        
        📧 Cliente: ${orderData.customerEmail}
        👤 Nombre: ${orderData.customerName || 'No proporcionado'}
        
        🛍️ Pedido:
        ${orderData.cart.map(item => `- ${item.name} x${item.quantity}`).join('\n')}
        
        💰 Total: $${orderData.total.toLocaleString('es-CO')}
        
        💳 Hash de Transacción: ${orderData.txHash}
        
        ⏰ Fecha: ${new Date().toLocaleString('es-CO')}
        
        🔍 VERIFICAR PAGO EN BLOCKCHAIN
        🎯 ENVIAR PINES DESPUÉS DE CONFIRMAR
        
        Wallet: TCJMLCURwm53B3e7Vrtyv2oohDkvZa5HaT
    `;
    
    const whatsappUrl = `https://wa.me/573138664577?text=${encodeURIComponent(message)}`;
    
    console.log('WhatsApp notification para TI (vendedor):', message);
    
    // Abrir WhatsApp automáticamente para que tú veas el pedido
    window.open(whatsappUrl, '_blank');
}

// Show Order Confirmation
function showOrderConfirmation(orderData) {
    const confirmationHtml = `
        <div style="text-align: center; padding: 40px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #25d366; margin-bottom: 20px;">✅ Pedido Confirmado!</h2>
            <p style="font-size: 18px; margin-bottom: 20px;">
                Tu pedido #${Date.now()} ha sido recibido exitosamente.
            </p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>📧 Resumen enviado a:</h3>
                <p><strong>${orderData.customerEmail}</strong></p>
                <p>Revisa tu bandeja de entrada (y spam) en los próximos minutos.</p>
            </div>
            <div style="background: #e7f3ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                <h3>⏱️ Tiempo de entrega</h3>
                <p><strong>1-5 minutos</strong> después de confirmar tu pago</p>
            </div>
            <button onclick="location.reload()" class="btn btn-primary">
                🛍️ Seguir Comprando
            </button>
        </div>
    `;
    
    // Replace modal content with confirmation
    checkoutModal.querySelector('.modal-content').innerHTML = confirmationHtml;
    checkoutModal.style.display = 'block';
}

// Quick View
function showQuickView(productName) {
    showNotification(`Vista rápida: ${productName}`, 'info');
}

// Wishlist
function toggleWishlist(btn, card) {
    const icon = btn.querySelector('i');
    const productName = card.querySelector('h3').textContent;
    
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.style.color = '#ff4757';
        showNotification(`${productName} añadido a la lista de deseos`, 'success');
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.style.color = '';
        showNotification(`${productName} eliminado de la lista de deseos`, 'info');
    }
}

// Copy Address Function
function copyAddress(address) {
    navigator.clipboard.writeText(address).then(() => {
        showNotification('Dirección copiada al portapapeles', 'success');
    }).catch(() => {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = address;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Dirección copiada al portapapeles', 'success');
    });
}

function copyCurrentAddress() {
    const walletAddress = document.getElementById('walletAddress').textContent;
    copyAddress(walletAddress);
}

// Storage Functions
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartTotal();
    }
}

// Loading States
function showLoading(button) {
    button.disabled = true;
    button.innerHTML = '<span class="loading"></span> Procesando...';
}

function hideLoading(button) {
    button.disabled = false;
    button.innerHTML = '<i class="fas fa-check"></i> Enviar Pedido y Recibir Pines';
}

// Notifications
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#25d366',
        error: '#ff4757',
        warning: '#ffa502',
        info: '#667eea'
    };
    return colors[type] || colors.info;
}

// Update Payment Details (for future use)
function updatePaymentDetails() {
    const paymentMethod = document.getElementById('paymentMethod').value;
    const paymentDetails = document.getElementById('paymentDetails');
    const walletAddress = document.getElementById('walletAddress');
    
    if (paymentMethod && paymentDetails && walletAddress) {
        paymentDetails.style.display = 'block';
        // Update wallet address based on payment method
        const addresses = {
            'bitcoin': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
            'ethereum': '0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45',
            'usdt': USDT_WALLET,
            'binance': 'binancepay://payment?link=XYZ123'
        };
        walletAddress.textContent = addresses[paymentMethod] || USDT_WALLET;
    }
}

// Smooth Scroll
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Form Validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.style.borderColor = '#ff4757';
        } else {
            input.style.borderColor = '#e1e8ed';
        }
    });
    
    return isValid;
}

// Add some interactivity to product cards
document.addEventListener('DOMContentLoaded', function() {
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach((card, index) => {
        // Add staggered animation
        card.style.animationDelay = `${index * 0.1}s`;
        
        // Add hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Colombia Value Selector Functions
function setupColombiaValueSelector() {
    const radioButtons = document.querySelectorAll('input[name="colombia-value"]');
    const priceDisplay = document.getElementById('colombia-price-display');
    
    radioButtons.forEach(radio => {
        radio.addEventListener('change', function() {
            const price = this.getAttribute('data-price');
            priceDisplay.textContent = `$${parseFloat(price).toFixed(2)} USD`;
        });
    });
}

function addToCartColombia() {
    const selectedValue = document.querySelector('input[name="colombia-value"]:checked');
    const quantity = document.getElementById('qty-colombia').value;
    
    if (!selectedValue) {
        showNotification('Por favor selecciona un valor', 'warning');
        return;
    }
    
    const value = selectedValue.value;
    const price = parseFloat(selectedValue.getAttribute('data-price'));
    const productName = `Pines Netflix Colombia - $${value}`;
    
    addToCart(productName, price, quantity);
}

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const nav = document.querySelector('.main-nav');
    nav.classList.toggle('mobile-open');
}








