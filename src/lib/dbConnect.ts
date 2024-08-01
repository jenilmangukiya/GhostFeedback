import mongoose, { Connection } from "mongoose";

export interface IConnection {
  isConnected?: number;
}

const connection: IConnection = {};

const dbConnect = async () => {
  if (connection.isConnected) {
    console.log("Database is already collected!");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;

    return db;
  } catch (error) {
    console.log("Database connection failed", error);

    process.exit(1);
  }
};

export default dbConnect;
