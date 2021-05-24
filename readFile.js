const path = require('path');
const fs = require('fs');

var count = 0;
// const mongoose = require('mongoose');

// const TrendingToday = require('./models/trendingToday');
// const TrendingThisWeek = require('./models/trendingThisWeek');
// const TMDBMovie = require('./models/tmdbMovie');
// const OMDBDocument = require('./models/omdb');

//joining path of directory
const directoryPath = path.join('/Users/vichi/Documents/tmdb/movie/', 'movie_info_US');
//passsing directoryPath and callback function
//    "runtime"\:\s+(?:(?!\})(?:.|\n))*\}
fs.readdir(directoryPath, function(err, files) {
	//handling error
	if (err) {
		return console.log('Unable to scan directory: ' + err);
	}
	//listing all files using forEach
	files.forEach(function(file) {
		if (file.endsWith('.txt')) {
			console.log(file);
			count = count + 1;
			console.log(count);
			fs.readFile('/Users/vichi/Documents/tmdb/movie/movie_info_US/' + file, (err, data) => {
				if (err) {
					// console.error(err);
					return;
				}

				var newData = data.toString();
				var d = newData.replace(/}{"poster_path":/g, '},{"poster_path":');
				const objJ = JSON.parse('[' + d + ']');
				console.log('data count in file: ', objJ.length);
				objJ.map((item) => {
					fs.appendFile(
						'/Users/vichi/Documents/tmdb/movie/movie_imdb_id_US.txt',
						item['imdb_id'] + ', ',
						function(err) {
							if (err) throw err;
							// console.log('Saved!');
						}
					);
				});
			});
		}
	});
});

// http://www.regexlab.com/wild2regex

// sudo launchctl limit maxfiles 200000 200000 && ulimit -n 200000
