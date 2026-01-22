const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).send('Use POST');
  
  try {
    await client.connect();
    const db = client.db("CalculatorDB"); // Name your DB anything
    const collection = db.collection("records");
    
    await collection.insertOne(req.body);
    res.status(200).json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};