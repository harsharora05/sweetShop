import mongoose from "mongoose";
import { app } from ".";
import { DB_URL } from "./config";

app.listen(3000, async () => {
    await mongoose.connect(`${DB_URL}`)
    console.log("backend running on port 3000");
});