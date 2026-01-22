const { MongoClient } = require('mongodb');

// MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB
async function connectToDatabase() {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db("myApp");
    const collection = db.collection("calculations");
    return { client, collection };
}

module.exports = async (req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle OPTIONS request for CORS
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    let client;
    
    try {
        // Connect to database
        const { client: mongoClient, collection } = await connectToDatabase();
        client = mongoClient;

        if (req.method === 'POST') {
            // SAVING DATA
            const data = req.body;
            
            // Add timestamp
            data.timestamp = new Date().toISOString();
            data.createdAt = new Date();
            
            const result = await collection.insertOne(data);
            
            return res.status(200).json({
                success: true,
                message: "Saved successfully",
                id: result.insertedId,
                timestamp: data.timestamp
            });
            
        } else if (req.method === 'GET') {
            // GETTING DATA - get all calculations
            const items = await collection.find({})
                .sort({ createdAt: -1 }) // Newest first
                .toArray();
            
            return res.status(200).json(items);
            
        } else {
            // Method not allowed
            return res.status(405).json({ 
                success: false, 
                message: "Method not allowed" 
            });
        }
        
    } catch (error) {
        console.error("Database error:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Database error",
            error: error.message 
        });
    } finally {
        // Close connection
        if (client) {
            await client.close();
        }
    }
};