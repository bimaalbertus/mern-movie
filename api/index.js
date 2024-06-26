const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 3000;
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const movieRoute = require("./routes/movies");
const dotenv = require("dotenv");

dotenv.config();

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://localhost:27017/movie-mern");
}
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/movies", movieRoute);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
