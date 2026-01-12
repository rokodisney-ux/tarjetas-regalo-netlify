function openCheckout() {
  alert('Ir al carrito de compras');
}

function addToCartColombia() {
  alert('Producto agregado al carrito');
}

function decreaseQuantity(product) {
  const input = document.getElementById('qty-' + product);
  if (input.value > 1) input.value--;
}

function increaseQuantity(product) {
  const input = document.getElementById('qty-' + product);
  if (input.value < 10) input.value++;
}
