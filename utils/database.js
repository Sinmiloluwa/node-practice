import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;
const uri = 'mongodb+srv://mofeoluwae:eK6TL4wf1nvQq99M@cluster0.ac0yd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const client = new MongoClient(uri);

async function connectDB() {
    try {
      await client.connect();
      console.log("✅ Connected to MongoDB successfully");
      return client.db("simons");
    } catch (err) {
      console.error("❌ MongoDB connection error:", err);
      process.exit(1);
    }
  }
  
export default connectDB;