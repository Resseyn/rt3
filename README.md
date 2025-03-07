# Инструкция по запуску проекта

## 1. Установка Python и зависимостей
- Скачайте Python с [Python.org](https://www.python.org/downloads/).
- Включите опцию **"Add Python to PATH"** при установке.
- В терминале выполните:
   ```bash
   python -m venv venv
   source venv/bin/activate  # или venv\Scripts\activate для Windows
   pip install -r requirements.txt
   ```

---

## 2. Скачивание и настройка
```bash
git clone <URL_репозитория>
cd <название_папки>
```

Создайте `server_admin/products.json`:
```json
[
    {
        "id": 1,
        "name": "Пример товара",
        "price": 199.99,
        "description": "Описание товара",
        "categories": ["Категория 1", "Категория 2"]
    }
]
```

---

## 3. Запуск серверов
```bash
python server_shop/app.py          # Клиент: http://localhost:3000
python server_admin/app.py         # Админ: http://localhost:8080
python server_admin/chat_server.py # WebSocket чат
```

---

## 4. Примеры запросов

### REST API
- `GET http://localhost:8080/api/products` — Все товары
- `POST http://localhost:8080/api/products` — Добавить товар

### GraphQL API
```graphql
query {
    products {
        id
        name
        price
    }
}
```

### Swagger UI
- [http://localhost:8080/api/docs](http://localhost:8080/api/docs)
