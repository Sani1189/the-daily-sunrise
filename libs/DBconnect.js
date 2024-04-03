import mongoose from "mongoose";

const connectMongoDB =()=>{
  try{
    mongoose.connect(process.env.mongoURI);
      console.log("MongoDB connected");
    }catch(err){
      console.error(err.message);
      process.exit(1);
    }
    
}
export default connectMongoDB;