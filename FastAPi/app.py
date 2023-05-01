from fastapi import FastAPI
from model import Item
import db

app = FastAPI()

@app.get('/')
def root():
    return {"print": "Hello World"}

@app.get('/item/{item_id}/{item_price}')
def create_item(item_id: int, item_price: int):
    return {"item_id": item_id, "item_price": item_price}

@app.post('/items/', response_model= Item)
def get_item(item: Item):
    return  item

@app.on_event('startup')
async def connect_with_db():
    await db.connect_db()

@app.post('/insert')
async def insert_item(item: Item):
    await db.Insert(item=item)
    return item

@app.put('/update')
async def update_item(item: Item):
    await db.Update(item)
    return {"message": "item updated."}

@app.delete('/delete')
async def delete_item(item: Item):
    await db.Delete(item)
    return {"message": "item deleted"}




