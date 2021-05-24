const path = require('path');
const fs = require('fs');

fs.readFile('/Users/vichi/Documents/tmdb/movie/movie_id.txt', (err, data) => {
	if (err) {
		// console.error(err);
		return;
	}
	var newData = data.toString();

	const objJ = JSON.parse('[' + newData + ']');
	console.log(objJ.length);
	// objJ.map((item) => {
	// 	console.log(item);
	// });
});
