const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleWere

app.use(express.json());
app.use(cors());

const verifyJWT = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: true, message: 'unauthorized access' });
  }
  const token = authorization.split(' ')[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRATE, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, message: 'unauthorized access' })
    }
    req.decoded = decoded;
    next();
  })
}


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3kcnoe6.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const clsassCollections = client.db("artCraftDB").collection("classes");
const selectClassCollections = client.db("artCraftDB").collection("selectClass");
const instructorCollections = client.db("artCraftDB").collection("instructor");
const usersCollections = client.db("artCraftDB").collection("users");
async function run() {
  try {



    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.post('/jwt',(req,res)=>{
      const user =req.body
      const token =jwt.sign(user,process.env.ACCESS_TOKEN_SECRATE,{ expiresIn: '1h' })
      res.send({token})
    })

    app.get("/class", async (req, res) => {
      const results = await clsassCollections.find().toArray();
      res.send(results);
    })
    app.get("/myclass/:email", async (req, res) => {
      const email =req.params.email;
      const query ={email:email}
      const results = await clsassCollections.find(query).toArray();
      res.send(results);
    })
    app.post("/class", async (req, res) => {
      const course =req.body;
      const results = await clsassCollections.insertOne(course);
      res.send(results);
    })
    app.get("/instructor", async (req, res) => {
      const results = await instructorCollections.find().toArray();
      res.send(results);
    })

    app.get('/selectclass/:email',async(req,res)=>{
      const email = req.params.email;
      console.log(email);
      const query = {email: email}
      const results = await selectClassCollections.find(query).toArray()
      
      res.send(results)

    })
    app.post('/users',  async(req, res) => {
      const user = req.body;
      console.log(user);
      const filter = { name: user.name, email: user.email, image: user.photoUrl };
      const existUser = await usersCollections.findOne(filter);

      if (existUser) {
        return res.send({ message: 'user already exists' })
      }
      const result = await usersCollections.insertOne(user);
      res.send(result);
    })
    app.post('/selectclass',  async(req, res) => {
      const classs = req.body;
      
      const result = await selectClassCollections.insertOne(classs);
      res.send(result);
    })
    

    app.get('/users', async (req, res) => {
      const result = await usersCollections.find().toArray();
      res.send(result)
    })
    app.delete('/user/:id', async (req, res) => {

      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await usersCollections.deleteOne(query);
      res.send(result);
    })
    app.get('/users/admin/:email', async (req, res) => {
      const email = req.params.email;

      

      const query = { email: email }
      const user = await usersCollections.findOne(query);
      const result = { admin: user?.role === 'admin' }
      res.send(result);
    })
    app.get('/users/instructor/:email', async (req, res) => {
      const email = req.params.email;
      const query = { email: email }
      const user = await usersCollections.findOne(query);
      const result = { instructor: user?.role === 'instructor' }
      res.send(result);
    })
    app.get('/users/instructor', async (req, res) => {
      
      const query={role:'instructor'}
      const user = await usersCollections.find(query).toArray();
      
      res.send(user)
    })
    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'admin'
        },
      };
      const result = await usersCollections.updateOne(filter, updateDoc);
      res.send(result);

    })
    app.patch('/users/instructor/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: 'instructor'
        },
      };
      const result = await usersCollections.updateOne(filter, updateDoc);
      res.send(result);

    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);








app.get('/', (req, res) => {
  res.send('Art-Craft-school is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})