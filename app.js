require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();

const authRouter = require("./routes/auth");
const jobRouter = require("./routes/jobs");
const connectDB = require("./db/connect");
const authenticateUser = require("./middleware/authentication");

const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const rateLimit = require("express-rate-limit");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

app.use(express.json());

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
app.use(helmet());
app.use(xss());
app.use(cors());

app.get("/", (req, res) => {
  res.send("jobs api");
});
// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authenticateUser, jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;
const url = process.env.MONGO_URI;

const start = async () => {
  try {
    await connectDB(url);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
