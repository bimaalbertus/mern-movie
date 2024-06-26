const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Counter = require("./counter");

const reviewSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
});

const castSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
});

const episodeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  episodeNumber: { type: Number, required: true },
  description: { type: String, required: true },
  releaseDate: { type: Date },
  duration: { type: String },
  director: { type: String },
  writers: [{ type: String }],
  guestStars: [{ type: String }],
  language: { type: String },
  country: { type: String },
  imgPoster: { type: String },
  video: { type: String },
  runtime: { type: Number },
});

const seasonSchema = new mongoose.Schema({
  seasonNumber: { type: Number, required: true },
  imgposter: { type: String },
  episodes: [episodeSchema],
  releaseDate: { type: Date },
  synopsis: { type: String },
  poster: { type: String },
  trailer: { type: String },
  averageRating: { type: Number },
});

const movieSchema = new mongoose.Schema(
  {
    _id: { type: String, unique: true },
    title: { type: String, required: true, unique: true },
    category: { type: String, required: true, default: "movie" },
    description: { type: String, required: true },
    year: { type: String, required: true },
    duration: { type: String, required: true },
    genre: [{ type: String, required: true }],
    director: { type: String, required: true },
    writers: [{ type: String, required: true }],
    cast: [castSchema],
    rating: { type: Number, default: 0 },
    language: { type: String, required: true },
    country: { type: String, required: true },
    imgtitle: { type: String },
    imgposter: { type: String },
    imgbackdrop: { type: String },
    trailer: { type: String },
    video: { type: String },
    releaseDate: { type: Date },
    ageRating: { type: String },
    boxOffice: { type: Number },
    awards: [{ type: String }],
    reviews: [reviewSchema],
    productionCompanies: [{ type: String }],
    budget: { type: Number },
    isSeries: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
    seasons: [seasonSchema],
  },
  { timestamps: true }
);

movieSchema.plugin(uniqueValidator);

movieSchema.pre("save", async function (next) {
  const doc = this;
  if (!doc.isNew) {
    return next();
  }

  const type = doc.isSeries ? "tv" : "mv";
  const counter = await Counter.findOneAndUpdate(
    { type },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  doc._id = `${type}${counter.seq.toString().padStart(3, "0")}`;
  next();
});

module.exports = mongoose.model("Movie", movieSchema);
