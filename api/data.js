const { MongoClient } = require('mongodb');
const client = new MongoClient(process.env.MONGODB_URI);

module.exports = async (req, res) => {
    await client.connect();
    const col = client.db("myApp").collection("data");

    if (req.method === 'POST') {
        // SAVING DATA
        await col.insertOne(req.body);
        return res.status(200).send("Saved");
    } else if (req.method === 'GET') {
        // GETTING DATA
        const items = await col.find({}).toArray();
        return res.status(200).json(items);
    }
};