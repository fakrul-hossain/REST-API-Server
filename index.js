const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json()); // Parse JSON request bodies

const uri = "mongodb+srv://fakrulhossain912:yLMMfrei7Ha4iRXm@cluster0.1bidx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const database = client.db('userDB')
    const userCollection = database.collection('users')

    app.get("/users", async(req,res) =>{
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/users/:id', async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const user = await userCollection.findOne(query)
      res.send(user)
      console.log(user)
    })



    app.post('/users', async (req, res) => {
      const user = req.body;
      console.log("new user", user);
      const result = await userCollection.insertOne(user)
    res.send(result)
    });

   
app.put('/users/:id',async(req,res)=>{
  const id = req.params.id
  const user =  req.body
  // console.log(updateUser)
  const filter ={ _id: new ObjectId(id)}
  const options = {upset: true}
  const updateUser = {
          $set:{
            name: user.name,
            email: user.email,
          }
  }
   const result = await userCollection.updateOne(filter,updateUser,options)
   res.send(result)
})

    app.delete('/users/:id',async(req,res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
      console.log('please delete from database', id)
    })








    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB");
  } finally {
    // Do not close the client here; keep it running to handle requests
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send('Simple CRUD server is running');
});

app.listen(port, () => {
  console.log(`Simple CRUD server is running on port ${port}`);
});
