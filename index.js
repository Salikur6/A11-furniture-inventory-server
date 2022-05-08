const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 8000;


// midllewere

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cdztj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

console.log(uri);

async function run() {
    try {
        await client.connect();
        const productCollection = client.db('inventoryItems').collection('items');




        console.log('all routes should be working')



        app.post('/addproduct', async (req, res) => {
            const keys = req.body;
            console.log(keys)
            const result = await productCollection.insertOne(keys);
            console.log(result)
            res.send(result);
        })

        // app.delete('/itemdelete/:itemId', async (req, res) => {
        //     const id = req.params.itemId;
        //     const query = { _id: ObjectId(id) }
        //     console.log(query)
        //     const result = await productCollection.deleteOne(query);
        //     console.log(result)
        //     res.send(result);
        // })


        app.get('/inventory', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const result = await cursor.toArray();
            console.log(result)
            res.send(result);

        })

        app.get('/inventory/:itemId', async (req, res) => {
            const id = req.params.itemId;
            const query = { _id: ObjectId(id) };
            const result = await productCollection.findOne(query);
            console.log(result)
            res.send(result)
        })


        app.put('/inventory/:itemId', async (req, res) => {
            const id = req.params.itemId;
            const update = req.body;
            console.log(update);
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            console.log(options)
            const updateDoc = {
                $set: {
                    quantity: update.quantity,
                }
            };
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        app.put('/stockinventory/:itemId', async (req, res) => {
            const id = req.params.itemId;
            const update = req.body;
            console.log(update)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    ...update,
                },
            };
            const result = await productCollection.updateOne(filter, updateDoc, options);
            res.send(result);
        })

        console.log('connected to db')
    }
    finally {

    };
};

run().catch(console.dir);








app.get('/', (req, res) => {
    res.send('hello world')
});

app.listen(port, () => {
    console.log('listening to port', port)
})