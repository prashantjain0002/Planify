import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("dev"));

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("🗄️  Connected to MongoDB"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5000;

app.use("/api/v1", routes);

app.get("/", async (req, res) => {
  res.send("Hello World!");
});


app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
