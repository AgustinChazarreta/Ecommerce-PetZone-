document.addEventListener("DOMContentLoaded", () => {
    const cartCount = document.getElementById("carrito-cantidad"); // Referencia al contador de carrito

    // Función para obtener la cantidad de productos en el carrito
    function obtenerCantidadCarrito() {
        const carrito = JSON.parse(localStorage.getItem('cart')) || [];
        const totalProductos = carrito.reduce((acc, item) => acc + item.quantity, 0);
        cartCount.textContent = totalProductos;
    }

    // Llamar la función al cargar la página
    obtenerCantidadCarrito();
});
