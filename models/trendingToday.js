const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trendingTodaySchema = new Schema({
  adult: {
    type: Boolean,
    default: false,
  },
  video: {
    type: Boolean,
    default: false,
  },
  backdrop_path: String,
  first_air_date: String,
  genre_ids: [],
  id: String,
  name: String,
  origin_country: [],
  original_language: String,
  original_name: String,
  overview: String,
  poster_path: String,
  vote_average: String,
  vote_count: String,
  popularity: String,
  media_type: String,
  create_date_time: {
    type: Date,
    default: new Date(Date.now()),
  },
});

module.exports = mongoose.model("TrendingToday", trendingTodaySchema);
