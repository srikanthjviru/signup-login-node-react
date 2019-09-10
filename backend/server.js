var express = require("express");
var Mongoose = require("mongoose");
var bodyParser = require("body-parser");
var cors = require("cors");
var app = express();
const path = require("path");
app.use(cors());
app.use(bodyParser.json());

// initialize the Public Directory

// app.get("*", (req, res) => {
//   console.log(res.sendFile(path.join(__dirname, "public", "index.html")));
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

Mongoose.connect(
  "mongodb+srv://srikanth:srikanth7@cluster0-9nk8y.mongodb.net/test?retryWrites=true",
  { useNewUrlParser: true }
)
  .then(() => {
    console.log("Atlas DB connected");
  })
  .catch(error => {
    console.log("DB connect failed", error.message);
  });

app.listen(4000);

app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
  // res.end("<h1>Hello World</h1>");
});

// const postRoutes = require("./routes/api/products");
// const todoRoutes = require("./routes/api/todos");
const signinRoute = require("./routes/signin");
// app.use("/api/posts", postRoutes);
// app.use("/api", todoRoutes);
app.use("/user", signinRoute);
console.log("Running a Express API server at http://localhost:4000/");
