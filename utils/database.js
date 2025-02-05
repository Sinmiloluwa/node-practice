import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;
const uri = 'mongodb+srv://mofeoluwae:eK6TL4wf1nvQq99M@cluster0.ac0yd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

let client = null; 
async function connectDB() {
  if (client) {
    console.log('Using existing MongoDB connection');
    return client.db("simons");
  }

  try {
    client = new MongoClient(uri); // Only create the client once
    await client.connect();
    console.log("✅ Connected to MongoDB successfully");
    return client.db("simons");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
}

export default connectDB;
