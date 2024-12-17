document.addEventListener("DOMContentLoaded", () => {
    const productosContainer = document.querySelector("#productos-container");

    // Capturo los elementos HTML (botones y página actual)
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const pageInfo = document.getElementById("page-info");

    // Variables de control
    let currentPage = 1;
    const limit = 20;
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

            cardDiv.innerHTML = `
            <div class="card">
                <img src="${product.thumbnail}" class="card-img-top" alt="${product.title}">
                <div class="card-body">
                    <h5 class="card-title">${product.title}</h5>
                    <p class="card-brand">${product.brand}</p>
                    <p class="card-text">${product.description}</p>
                    <p class="card-price">$ ${product.price}</p>
                    <button type="button" class="btn btn-primary">Agregar</button>
                </div>
            </div>
            `;

            // Evento para el botón "Agregar"
            const botonAgregar = cardDiv.querySelector("button");
            botonAgregar.addEventListener("click", () => {
            agregarAlCarrito(product);
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
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));

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
});
