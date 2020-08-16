/**
 * Require functions as an import statement. Returns a function and when called, creates an express app.
 */
let express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require("mongoose"), //created model loading here
  bodyParser = require("body-parser"), //To work with the JSON documents (formatting)
  session = require("express-session");
const pino = require("pino");
const expressPino = require("express-pino-logger");
var cors = require("cors");

app.use(cors());

const logger = pino({ level: process.env.LOG_LEVEL || "info" });
const expressLogger = expressPino({ logger });

/**
 * Mongoose instance creation by connecting to the collection
 */
mongoose.set("useCreateIndex", true);
mongoose.connect("mongodb://localhost:27017/myUserDb", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});
mongoose.Promise = global.Promise; //Global is an implicit object in JS

//Adding body parser for handling request and response objects.
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(expressLogger);

//Enabling CORS - TO handle requests from a different domain
app.use(function (err, req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "1800");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "PUT, POST, GET, DELETE, PATCH, OPTIONS"
  );
  next();
});

const initApp = require("./app");
initApp(app);

//binds the app to the port
app.listen(port);
logger.info("Order RESTful API server started on: %d", port);
