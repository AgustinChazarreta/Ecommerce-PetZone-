document.addEventListener("DOMContentLoaded", () => {
    const productosContainer = document.querySelector("#productos-container");
    const cartCount = document.getElementById("carrito-cantidad"); // Referencia al contador de carrito

    // Capturo los elementos HTML (botones y página actual)
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");

    // Variables de control
    let currentPage = 1;
    const limit = 15;
    let totalProductos = 0;

    function fetchProductos(page) {
        const skip = (page - 1) * limit;

        fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`)
            .then((response) => response.json())
            .then((data) => {
                totalProductos = data.total;
                const productos = data.products;

                // Limpia el contenedor de productos
                productosContainer.innerHTML = "";

                // Genera las cards de productos
                productos.forEach((product) => {
                    const cardDiv = document.createElement("div");
                    cardDiv.className = "col-md-4";

                    // Añadimos la descripción ampliada en el atributo "data-descripcion"
                    cardDiv.innerHTML = `
                    <div class="card">
                        <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                        <div class="card-body">
                            <h5 class="card-title">${product.title}</h5>
                            <p class="card-brand">${product.brand}</p>
                            <p class="card-description">Breve descripción del producto...</p>
                            <p class="card-price">$ ${product.price} <button type="button" class="btn btn-primary">Agregar</button></p>
                        </div>
                    </div>
                    `;

                    // Añadir el atributo data-descripcion con la descripción completa del producto
                    cardDiv.querySelector(".card-description").setAttribute("data-descripcion", product.description);

                    // Evento para el botón "Agregar"
                    const botonAgregar = cardDiv.querySelector("button");
                    botonAgregar.addEventListener("click", () => {
                        agregarAlCarrito(product);
                    });

                    // Evento para mostrar la descripción ampliada al pasar el mouse
                    cardDiv.addEventListener("mouseover", () => {
                        const descripcionCompleta = cardDiv.querySelector(".card-description").getAttribute("data-descripcion");
                        const descripcionElement = cardDiv.querySelector(".card-description");
                        descripcionElement.textContent = descripcionCompleta;
                        descripcionElement.classList.add("expanded");
                    });

                    // Evento para restaurar la descripción breve al salir el mouse
                    cardDiv.addEventListener("mouseout", () => {
                        const descripcionElement = cardDiv.querySelector(".card-description");
                        descripcionElement.textContent = "Breve descripción del producto...";
                        descripcionElement.classList.remove("expanded");
                    });

                    // Añadir la card al contenedor
                    productosContainer.appendChild(cardDiv);
                });

                actualizarInfoPaginacion();
            })
            .catch((error) => console.error("Error fetching products:", error));
    }

    // Función para actualizar la información de paginación
    function actualizarInfoPaginacion() {
        pageInfo.textContent = `Página ${currentPage}`;
        prevBtn.disabled = currentPage === 1;
        nextBtn.disabled = (currentPage * limit) >= totalProductos;
    }

    // Función para agregar al carrito
    function agregarAlCarrito(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        
        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        if (existingProductIndex !== -1) {
            // Si el producto ya está, solo incrementar la cantidad
            cart[existingProductIndex].quantity += 1;
        } else {
            // Si el producto no está, agregarlo con cantidad 1
            product.quantity = 1;
            cart.push(product);
        }
        
        localStorage.setItem("cart", JSON.stringify(cart));

        // Actualizar el contador de productos
        actualizarContadorCarrito();

        // Crear el mensaje flotante
        const toast = document.createElement("div");
        toast.textContent = `${product.title} ha sido agregado al carrito!`;
        toast.className = "toast-message";
        document.body.appendChild(toast);

        // Agregar efecto de "fade-out" después de 2 segundos
        setTimeout(() => {
            toast.classList.add("fade-out");
        }, 2000);

        // Eliminar el mensaje después de que termine la animación
        setTimeout(() => {
            toast.remove();
        }, 3000); // Total: 2s de espera + 1s de transición
    }

    // Función para actualizar el contador del carrito
    function actualizarContadorCarrito() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const totalProductos = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartCount.textContent = totalProductos;
    }

    // Eventos de los botones de paginación
    prevBtn.addEventListener("click", () => {
        currentPage--;
        fetchProductos(currentPage);
    });

    nextBtn.addEventListener("click", () => {
        currentPage++;
        fetchProductos(currentPage);
    });

    // Carga inicial de productos
    fetchProductos(currentPage);

    // Actualizar el contador de productos al cargar la página
    actualizarContadorCarrito();
});
