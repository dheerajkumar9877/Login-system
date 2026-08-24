require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sql = require('./config/db')
const app = express();

const authRouter = require("./routes/authRouter");

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

app.use("/", authRouter);

const PORT = process.env.PORT ;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});