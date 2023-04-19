const express = require("express")
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

const dev = require("./config");
const connectDB = require("./config/DB.JS");
const userRouter = require("./routes/users");
const adminRouter = require("./routes/users");


const app = express();

const PORT = dev.app.serverPort

app.use(cookieParser());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/users", userRouter);
app.use("/api/admin", adminRouter);



app.get("/", (req, res) => {
    res.status(200).send("api is running")
})

app.listen (PORT, async () => {
    console.log(`server is running http://localhost:${PORT}`);
    await connectDB();
});