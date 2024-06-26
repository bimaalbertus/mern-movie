const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    isAdmin: { type: Boolean, default: false },
    username: String,
    password: String,
    email: String,
    favoriteMovies: [mongoose.Schema.Types.ObjectId],
    profilePict: { type: String, default: "" },
    reviews: [
      {
        movieId: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function (password) {
  this.password = bcrypt.hashSync(password, 10);
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
