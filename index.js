const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const nocache = require("nocache");
const { errorHandler } = require("./middleware/error.middleware");
const { authRouter } = require("./controllers/auth.router");
const { radRouter } = require("./controllers/rad.router");

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.set("json spaces", 2);
app.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});
app.use(nocache());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

app.use(authRouter);
app.get("/", (req, res) => {
  res.json({ message: `Hello, ${req.headers.authorization}!` });
});
app.use(radRouter);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
