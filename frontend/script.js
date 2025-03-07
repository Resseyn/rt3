document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const chatWindow = document.getElementById("chat-window");
    const messageForm = document.getElementById("messageForm");

    // WebSocket для чата
    const socket = new WebSocket("ws://localhost:4000");
    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        const messageElement = document.createElement("div");
        messageElement.textContent = `${message.sender}: ${message.text}`;
        messageElement.className = message.sender === "User" ? "message sent" : "message received";
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; 
    };

    messageForm.addEventListener("submit", (e) => {
        e.preventDefault(); 
        const messageInput = document.getElementById("message").value;
        if (messageInput.trim() !== "") {
            const message = { sender: "User", text: messageInput };
            socket.send(JSON.stringify(message));

            const messageElement = document.createElement("div");
            messageElement.textContent = `User: ${message.text}`;
            messageElement.className = "message sent";
            chatWindow.appendChild(messageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight;

            document.getElementById("message").value = "";
        }
    });

    async function fetchProducts() {
        const response = await fetch("http://localhost:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                query: `
                    {
                        products {
                            id
                            name
                            price
                            description
                            categories
                        }
                    }
                `
            })
        });
        const result = await response.json();
        displayProducts(result.data.products);
    }

    function displayProducts(products) {
        productList.innerHTML = "";
        products.forEach(product => {
            const productCard = document.createElement("div");
            productCard.innerHTML = `
                <h3>${product.name}</h3>
                <p>${product.price} ₽</p>
                <p>${product.description}</p>
                <p>Категории: ${product.categories.join(", ")}</p>
            `;
            productList.appendChild(productCard);
        });
    }

    fetchProducts();
});
