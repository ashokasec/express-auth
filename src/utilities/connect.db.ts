import mongoose from "mongoose";

const CONNECTION_STRING = Bun.env.CONNECTION_STRING

export const connect_to_db = async () => {
    try {
        const dbConnection = await mongoose.connect(CONNECTION_STRING ?? "");
        console.log(`Connected to Database\nDatabase Name: ${dbConnection.connection.db.databaseName}`);
    } catch (error) {
        console.log(error)
        return null
    }
}