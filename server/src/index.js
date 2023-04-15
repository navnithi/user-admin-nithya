const express = require("express")
const morgan = require("morgan");

const dev = require("./config");
const connectDB = require("./config/DB.JS");
const userRouter = require("./routes");
const bodyParser = require("body-parser");

const app = express();

const PORT = dev.app.serverPort

app.use(morgan("dev"))
app.use("/api/users", userRouter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


app.get("/", (req, res) => {
    res.status(200).send("api is running")
})

app.listen (PORT, async () => {
    console.log(`server is running http://localhost:${PORT}`);
    await connectDB();
});