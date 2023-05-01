import mysql.connector
from model import Item

db = None
cursor = None

async def connect_db():
    global db, cursor

    db = mysql.connector.connect(
        user='root',
        password='',
        host='localhost',
        database='webtech'
    )

    cursor = db.cursor()


async def Insert(item: Item):
    # print(item)
    sql = "INSERT into item (item_id, item_name, item_price) values (%s, %s, %s)"
    values = (item.id, item.name, item.price)
    cursor.execute(sql, values)
    db.commit()
    return item

async def Update(item: Item):
    sql = "Update item set item_name= %s, item_price=%s where item_id=%s"
    values = (item.name, item.price, item.id)
    cursor.execute(sql, values)
    db.commit()
    return item

async def Delete(item: Item):
    sql= "DELETE from item where item_id=%s"
    values= (item.id,)
    cursor.execute(sql, values)
    db.commit()
    return item


