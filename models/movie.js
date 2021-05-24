const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
	fs_id: String,
	tmdb_id: String,
	tmdb_rating: String,
	tmdb_vote_count: String,
	adult: Boolean,
	backdrop_path: String,
	belongs_to_collection: String,
	budget: String,
	genres: [],
	homepage: String,
	imdb_id: String,
	imdb_rating: String,
	imdb_vote_count: String,
	rotten_tomatoes_rating: String,
	streaming_info: [],
	original_language: String,
	original_title: String,
	overview: String,
	poster_path: String,
	release_date: String,
	revenue: String,
	runtime: String,
	spoken_languages: [],
	status: String,
	tagline: String,
	title: String,
	trailer: String
});

module.exports = mongoose.model('Movie', movieSchema);
