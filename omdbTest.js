// https://github.com/vankasteelj/omdbapi
const path = require('path');
const fs = require('fs');
// const mongoose = require('mongoose');
const omdb = new (require('omdbapi'))('b6aff899');
var count = 0;
const { MongoClient } = require('mongodb');
const uri = 'mongodb+srv://vichi:vichi123@cluster0.3gcit.mongodb.net/flixsee?retryWrites=true&w=majority';
const client = new MongoClient(uri);
// start: Connect to DB
async function run() {
	try {
		await client.connect();
		const database = client.db('flixsee');
		const movies = database.collection('movies_omdb_US');

		var readMe = fs.readFileSync('/Users/vichi/Documents/tmdb/movie/movie_imdb_id_US.txt', 'utf8').split(',');
		// readMe = [ 'tt0147800', 'tt3504064', 'tt10731748' ];
		readMe.map((imdbId) => {
			console.log(imdbId);
			omdb
				.get({
					id: imdbId, // optionnal (requires imdbid or title)
					// optionnal ['series', 'episode', 'movie']
					plot: 'full', // optionnal (defaults to 'short')
					tomatoes: true // optionnal
				})
				.then((res) => {
					console.log('got response:', res.ratings);
					insert(imdbId, res.ratings, movies);
				})
				.catch(console.error);
		});
		// create a document to be inserted
	} finally {
		// await client.close();
	}
}

const insert = async (imdbId, ratings, movies) => {
	const doc = { id: imdbId, ratings: ratings };
	const result = await movies.insertOne(doc);
	count = count + 1;
	console.log(count);
	console.log(`${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`);
};

run().catch(console.dir);

// var readMe = fs.readFileSync('/Users/vichi/Documents/tmdb/movie/movie_imdb_id_US.txt', 'utf8').split(',');
// readMe = [ 'tt0147800', 'tt3504064', 'tt10731748' ];
// readMe.map((imdbId) => {
// 	console.log(imdbId);
// 	omdb
// 		.get({
// 			id: imdbId, // optionnal (requires imdbid or title)
// 			// optionnal ['series', 'episode', 'movie']
// 			plot: 'full', // optionnal (defaults to 'short')
// 			tomatoes: true // optionnal
// 		})
// 		.then((res) => {
// 			console.log('got response:', res.ratings);
// 		})
// 		.catch(console.error);
// });

// console.log(readMe.length);

// fs.readFile('/Users/vichi/Documents/tmdb/movie/movie_imdb_id_US.txt', (err, data) => {
// 	if (err) {
// 		// console.error(err);
// 		return;
// 	}

// 	var newData = data;
// 	// const objJ = JSON.parse({ 1}, { 2 }, { 3 } );
// 	console.log(newData[0]);
// 	// console.log('data count in file: ', objJ.length);
// 	// objJ.map((item) => {
// 	// 	console.log(item);
// 	// });
// });
