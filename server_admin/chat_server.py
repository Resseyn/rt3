import asyncio
import websockets
import json

connected_clients = set()

async def chat_handler(websocket, path):
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            for client in connected_clients:
                if client != websocket:
                    await client.send(message)
    finally:
        connected_clients.remove(websocket)

async def main():
    async with websockets.serve(chat_handler, "localhost", 4000):
        print("WebSocket server running at ws://localhost:4000")
        await asyncio.Future()

asyncio.run(main())
