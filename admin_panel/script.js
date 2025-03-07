document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const chatWindow = document.getElementById("chat-window");
    const messageForm = document.getElementById("messageForm");

    const socket = new WebSocket("ws://localhost:4000");
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const messageElement = document.createElement("div");
        messageElement.textContent = `${message.sender}: ${message.text}`;
        messageElement.className = message.sender === "Admin" ? "message sent" : "message received";
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; 
    };

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const messageInput = document.getElementById("message").value;
        if (messageInput.trim() !== "") {
            const message = { sender: "Admin", text: messageInput };
            socket.send(JSON.stringify(message));

            // Отображаем отправленное сообщение сразу у админа
            const messageElement = document.createElement("div");
            messageElement.textContent = `Admin: ${message.text}`;
            messageElement.className = "message sent";
            chatWindow.appendChild(messageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight;

            document.getElementById("message").value = "";
        }
    });

    async function fetchProducts() {
        try {
            const response = await fetch("http://localhost:8080/api/products");
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error("Ошибка загрузки товаров:", error);
        }
    }


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
                <button class="edit" onclick="editProduct(${product.id})">Редактировать</button>
                <button class="delete" onclick="deleteProduct(${product.id})">Удалить</button>
            `;
            productList.appendChild(productCard);
        });
    }

    // Добавление товара
    addProductForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const price = document.getElementById("price").value;
        const description = document.getElementById("description").value;
        const categories = document.getElementById("categories").value.split(",");

        const newProduct = { name, price: Number(price), description, categories };

        try {
            await fetch("http://localhost:8080/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newProduct)
            });
            fetchProducts();
        } catch (error) {
            console.error("Ошибка добавления товара:", error);
        }
    });

    // Удаление товара
    window.deleteProduct = async (id) => {
        try {
            await fetch(`http://localhost:8080/api/products/${id}`, { method: "DELETE" });
            fetchProducts();
        } catch (error) {
            console.error("Ошибка удаления товара:", error);
        }
    };

    // Редактирование товара
    window.editProduct = async (id) => {
        const newName = prompt("Введите новое название:");
        const newPrice = prompt("Введите новую цену:");
        const newDescription = prompt("Введите новое описание:");
        const newCategories = prompt("Введите новые категории (через запятую):").split(",");

        if (newName && newPrice && newDescription) {
            try {
                await fetch(`http://localhost:8080/api/products/${id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: newName,
                        price: Number(newPrice),
                        description: newDescription,
                        categories: newCategories
                    })
                });
                fetchProducts();
            } catch (error) {
                console.error("Ошибка редактирования товара:", error);
            }
        }
    };


    // Остальной код без изменений (загрузка товаров, добавление, редактирование и удаление)
    fetchProducts();
});
