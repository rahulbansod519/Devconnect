import { MongoClient, ServerApiVersion } from 'mongodb';

let dbConnection;

async function connectToDb() {
    const uri = 'mongodb://127.0.0.1:27017';
    if (dbConnection) {
        return dbConnection;
    }

    try {
        const client = new MongoClient(uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        await client.connect();
        dbConnection = client.db('devconnect');
        
        console.log('Connected to MongoDB');
        return dbConnection;

    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

export { connectToDb };
