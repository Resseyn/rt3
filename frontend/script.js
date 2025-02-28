document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const categoryFilter = document.getElementById("category");

    // Загружаем товары с сервера
    async function fetchProducts() {
        try {
            const response = await fetch("/api/products");
            const products = await response.json();
            displayProducts(products);
            populateCategoryFilter(products);
        } catch (error) {
            console.error("Ошибка загрузки товаров:", error);
        }
    }

    // Отображение списка товаров
    function displayProducts(products) {
        productList.innerHTML = "";
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.className = "product-card";
            productCard.innerHTML = `
                <h3>${product.name}</h3>
                <p class="price">${product.price} ₽</p>
                <p>${product.description}</p>
                <p class="categories">Категории: ${product.categories.join(", ")}</p>
            `;
            productList.appendChild(productCard);
        });
    }

    // Заполнение фильтра по категориям
    function populateCategoryFilter(products) {
        const categories = new Set();
        products.forEach(product => {
            product.categories.forEach(category => categories.add(category));
        });

        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categoryFilter.appendChild(option);
        });
    }

    // Фильтрация товаров
    categoryFilter.addEventListener("change", async () => {
        const response = await fetch("/api/products");
        const products = await response.json();
        const selectedCategory = categoryFilter.value;

        if (selectedCategory === "all") {
            displayProducts(products);
        } else {
            const filteredProducts = products.filter(product =>
                product.categories.includes(selectedCategory)
            );
            displayProducts(filteredProducts);
        }
    });

    // Загрузка товаров при запуске
    fetchProducts();
});
