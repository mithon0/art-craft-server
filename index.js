const express = require('express');
const cors = require('cors');
const app =express();
require('dotenv').config();
const port =process.env.PORT || 5000;


// middleWere

app.use(express.json());
app.unsubscribe(cors());










app.get('/', (req, res) => {
  res.send('Art-Craft-school is running')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})