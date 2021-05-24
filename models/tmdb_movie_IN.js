const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tmdbMovieIndiaSchema = new Schema({
	poster_path: String,
	title: String,
	overview: String,
	release_date: '2021-04-23',
	popularity: 5911.934,
	original_title: 'Mortal Kombat',
	backdrop_path: '/9yBVqNruk6Ykrwc32qrK2TIE5xw.jpg',
	vote_count: 2295,
	video: false,
	adult: false,
	vote_average: 7.7,
	genre_ids: [ 28, 14, 12 ],
	id: 460465,
	original_language: 'en'
});

module.exports = mongoose.model('TMDBMovie', tmdbSchema);
