const express = require('express');
const bodyParser = require('body-parser');
var busboy = require('connect-busboy');
const mongoose = require('mongoose');
const path = require('path'); //used for file path
var uuid = require('uuid');
const { nanoid } = require('nanoid');
const axios = require('axios');
const Constants = require('./constants');

// https://in.pinterest.com/pin/677299231444826508/

const TrendingToday = require('./models/trendingToday');
const TrendingThisWeek = require('./models/trendingThisWeek');
const TMDBMovie = require('./models/tmdbMovie');

const app = express();
app.use(busboy());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	// res.header(
	//   "Access-Control-Allow-Methods",
	//   "GET,PUT,POST,DELETE,PATCH,OPTIONS"
	// );
	// res.header(
	//   //"Access-Control-Allow-Headers",
	//   "Origin, X-Requested-With, Content-Type, Accept"
	// );
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested With, Content-Type, Accept');

	next();
});

// start: Connect to DB
mongoose
	.connect(
		'mongodb+srv://vichi:vichi123@cluster0.3gcit.mongodb.net/flixsee?retryWrites=true&w=majority'
		// "mongodb+srv://vichi:vichi123@cluster0.3gcit.mongodb.net/flixsee?retryWrites=true&w=majority"
	)
	.then(() => {
		// app.listen(6000 ,'0.0.0.0');
		app.listen(3000, '0.0.0.0', () => {
			console.log('server is listening on 3000 port');
		});

		console.log('MongoDB connected...server listening at 3000');
	})
	.catch((err) => console.log(err));

// end: Connect to DB

app.post('/getHomeScreenData', function(req, res) {
	console.log('getHomeScreenData');
	getHomeScreenData(req, res);
});

app.post('/getMovieDetailData', function(req, res) {
	console.log('getMovieDetailData');
	getMovieDetailData(req, res);
});

const getHomeScreenData = (req, res) => {
	const restaurantObj = JSON.parse(JSON.stringify(req.body));
	console.log(JSON.stringify(req.body));
	const trendingToday = getTrendingToday();
	const trendingCurrentWeek = getTrendingCurrentWeek();
	const topRatedMovie = getTopRatedMovie();
	Promise.all([ trendingToday, trendingCurrentWeek, topRatedMovie ])
		.then(([ res1, res2 ]) => {
			// console.log("Results trendingToday: ", res1);
			// console.log("Results trendingCurrentWeek: ", res2);
			const homeScreenData = {
				trending_today: res1,
				trending_current_week: res2
			};
			res.send(JSON.stringify(homeScreenData));
			res.end();
			return;
		})
		.catch((err) => {
			console.error(`getHomeScreenData# Failed to insert documents : ${err}`);
			res.send(JSON.stringify([]));
			return;
		});
};

const getTrendingToday = () => {
	return new Promise((resolve, reject) => {
		const todayDate = new Date(Date.now());
		console.log('todayDate: ', todayDate.getDate());
		TrendingToday.find()
			.then((result) => {
				console.log(result[0]);
				if (result[0].create_date_time.getDate() === todayDate.getDate()) {
					resolve(result);
				} else {
					axios
						.get('https://api.themoviedb.org/3/trending/all/day?api_key=' + Constants.TBD_API_KEY)
						.then((response) => {
							// console.log(response.data.results);
							response.data.results.map((item) => {
								item['create_date_time'] = new Date(Date.now());
							});

							TrendingToday.collection
								.deleteMany({})
								.then((result) => {
									TrendingToday.collection
										.insertMany(response.data.results)
										.then((result) => {
											console.log(`Successfully inserted ${JSON.stringify(result)} items!`);
											console.log(`Successfully inserted items!`);
											resolve(response.data.results);
										})
										.catch((err) => {
											console.error(`TrendingToday# Failed to insert documents: ${err}`);
											reject(null);
											return;
										});
								})
								.catch((err) => {
									console.error(`Failed to delete documents: ${err}`);
									reject(null);
									return;
								});
						})
						.catch((error) => {
							console.log(error);
							reject(null);
							return;
						});
				}
			})
			.catch((err) => console.error(`Failed to get documents: ${err}`));
	});
};

const getTrendingCurrentWeek = () => {
	return new Promise((resolve, reject) => {
		const todayDate = new Date(Date.now());
		console.log('todayDate: ', todayDate.getDate());
		TrendingThisWeek.find()
			.then((result) => {
				console.log('getTrendingCurrentWeek result[0]:  ', result[0]);
				if (result[0].create_date_time.getDate() === todayDate.getDate()) {
					resolve(result);
				} else {
					axios
						.get('https://api.themoviedb.org/3/trending/all/week?api_key=' + Constants.TBD_API_KEY)
						.then((response) => {
							// console.log(response.data.results);
							response.data.results.map((item) => {
								item['create_date_time'] = new Date(Date.now());
							});

							TrendingThisWeek.collection.deleteMany({}).then((result) => {
								TrendingThisWeek.collection
									.insertMany(response.data.results)
									.then((result) => {
										// console.log(`Successfully inserted ${JSON.stringify(result)} items!`);
										console.log(`Successfully inserted items!`);
										resolve(response.data.results);
									})
									.catch((err) => {
										console.error(`TrendingThisWeek# Failed to insert documents: ${err}`);
										reject(null);
										return;
									});
							});
						})
						.catch((error) => {
							console.log(error);
							reject(null);
							return;
						});
				}
			})
			.catch((err) => console.error(`Failed to get documents: ${err}`));
	});
};

const getMovieDetailDataX = (req, res) => {
	// axios
	// 	.get('https://api.themoviedb.org/3/movie/550?api_key=8c643e62fa2e9201b30ef1f251603347')
	// 	.then((response) => {
	// 		console.log(response.data);
	// 		TMDBMovie.collection
	// 			.updateOne({ id: response.data.id }, { $setOnInsert: { ...response.data } }, { upsert: true })
	// 			.then((result) => {
	// 				return response.data;
	// 			})
	// 			.catch((error) => {
	// 				console.log(error);
	// 				return null;
	// 			});
	// 	})
	// 	.catch((error) => {
	// 		console.log(error);
	// 		return null;
	// 	});

	const subObj = JSON.parse(JSON.stringify(req.body));
	console.log('subObj: ', subObj);
	const tmdbId = subObj.id;
	console.log('tmdbId: ', tmdbId);
	TMDBMovie.findOne({ id: Number(tmdbId) }, (err, data) => {
		if (err) {
			console.log(err);
			res.send(null);
			res.end();
			return;
		}
		console.log(JSON.stringify(data));
		if (data) {
			res.send(data);
			res.end();
		} else {
			axios
				.get(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=8c643e62fa2e9201b30ef1f251603347`)
				.then((response) => {
					console.log(response.data);
					TMDBMovie.collection
						.updateOne({ id: response.data.id }, { $setOnInsert: { ...response.data } }, { upsert: true })
						.then((result) => {
							// return response.data;
							res.send(JSON.stringify(response.data));
							res.end();
							return;
						})
						.catch((error) => {
							console.log(error);
							res.send(JSON.stringify(null));
							res.end();
							return;
						});
				})
				.catch((error) => {
					console.log(error);
					res.send(JSON.stringify(null));
					res.end();
					return;
				});
		}
	});
};

const getMovieDetailData = (req, res) => {
	// axios
	// 	.get('https://api.themoviedb.org/3/movie/550?api_key=8c643e62fa2e9201b30ef1f251603347')
	// 	.then((response) => {
	// 		console.log(response.data);
	// 		TMDBMovie.collection
	// 			.updateOne({ id: response.data.id }, { $setOnInsert: { ...response.data } }, { upsert: true })
	// 			.then((result) => {
	// 				return response.data;
	// 			})
	// 			.catch((error) => {
	// 				console.log(error);
	// 				return null;
	// 			});
	// 	})
	// 	.catch((error) => {
	// 		console.log(error);
	// 		return null;
	// 	});

	const subObj = JSON.parse(JSON.stringify(req.body));
	console.log('subObj: ', subObj);
	const tmdbId = subObj.id;
	console.log('tmdbId: ', tmdbId);
	TMDBMovie.findOne({ id: Number(tmdbId) }, (err, data) => {
		if (err) {
			console.log(err);
			res.send(null);
			res.end();
			return;
		}
		console.log(JSON.stringify(data));
		if (data) {
			res.send(data);
			res.end();
		} else {
			const movieDetailsPromise = axios.get(
				'https://api.themoviedb.org/3/movie/' + tmdbId + '?api_key=' + Constants.TBD_API_KEY
			);
			const videosPromise = axios.get(
				'https://api.themoviedb.org/3/movie/' + tmdbId + '/videos?api_key=' + Constants.TBD_API_KEY
			);
			const watchProvidersPromise = axios.get(
				'https://api.themoviedb.org/3/movie/' + tmdbId + '/watch/providers?api_key=' + Constants.TBD_API_KEY
			);
			Promise.allSettled([ movieDetailsPromise, videosPromise, watchProvidersPromise ])
				.then((resultArray) => {
					console.log('resultArray: ', resultArray);
					const movieDetailsData = resultArray[0];
					const videosData = resultArray[1];
					const watchProvidersData = resultArray[2];
					console.log('movieDetailsData: ', movieDetailsData);
					if (movieDetailsData.status === 'fulfilled') {
						console.log('movieDetailsData.data: ', movieDetailsData.value.data);
						const movieDetailsDataResult = movieDetailsData.value.data;
						(movieDetailsDataResult['movie_providers'] = []), (movieDetailsDataResult['trailer'] = []);
						if (videosData.status === 'fulfilled') {
							const videosDataResult = videosData.value.data;
							movieDetailsDataResult['trailer'] = videosDataResult;
						}
						if (watchProvidersData.status === 'fulfilled') {
							const watchProvidersDataResult = watchProvidersData.value.data;
							movieDetailsDataResult['movie_providers'] = watchProvidersDataResult;
						}
						TMDBMovie.collection
							.updateOne(
								{ id: movieDetailsDataResult.id },
								{ $setOnInsert: { ...movieDetailsDataResult } },
								{ upsert: true }
							)
							.then((result) => {
								res.send(JSON.stringify(movieDetailsDataResult));
								res.end();
								return;
							})
							.catch((error) => {
								console.log(error);
								res.send(JSON.stringify(null));
								res.end();
								return;
							});
					}
				})
				.catch((error) => {
					console.log(error);
					res.send(JSON.stringify(null));
					res.end();
					return;
				});
		}
	});
};

const getTopRatedMovie = () => {
	axios
		.get(
			'https://api.themoviedb.org/3/movie/top_rated?api_key=8c643e62fa2e9201b30ef1f251603347&language=en-US&page=1&region=IN'
		)
		.then((response) => {
			console.log('TopRatedMovie: ', response.data);
			// TMDBMovie.collection
			// 	.updateOne({ id: response.data.id }, { $setOnInsert: { ...response.data } }, { upsert: true })
			// 	.then((result) => {
			// 		return response.data;
			// 	})
			// 	.catch((error) => {
			// 		console.log(error);
			// 		return null;
			// 	});
			return response.data;
		})
		.catch((error) => {
			console.log(error);
			return null;
		});
};

// https://api.themoviedb.org/3/movie/513310?api_key=26ba5e77849587dbd7df199727859189&language=en-US
//api.themoviedb.org/3/movie/550?api_key=8c643e62fa2e9201b30ef1f251603347

//  https://api.themoviedb.org/3/movie/550?api_key=8c643e62fa2e9201b30ef1f251603347

// https://api.themoviedb.org/3/movie/550/images?api_key=8c643e62fa2e9201b30ef1f251603347

// https://api.themoviedb.org/3/movie/550/images?api_key=8c643e62fa2e9201b30ef1f251603347

// https://api.themoviedb.org/3/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg

// https://image.tmdb.org/t/p/w300/rr7E0NoGKxvbkb89eR1GwfoYjpA.jpg

// https://api.themoviedb.org/3/movie/550/videos?api_key=8c643e62fa2e9201b30ef1f251603347

// https://api.themoviedb.org/3/movie/550/watch/providers?api_key=8c643e62fa2e9201b30ef1f251603347

// https://click.justwatch.com/a?cx=eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uanVzdHdhdGNoL2NsaWNrb3V0X2NvbnRleHQvanNvbnNjaGVtYS8xLTItMCIsImRhdGEiOnsicHJvdmlkZXIiOiJBbWF6b24gUHJpbWUgVmlkZW8iLCJtb25ldGl6YXRpb25UeXBlIjoiZmxhdHJhdGUiLCJwcmVzZW50YXRpb25UeXBlIjoiaGQiLCJjdXJyZW5jeSI6IklOUiIsInByaWNlIjowLCJvcmlnaW5hbFByaWNlIjowLCJhdWRpb0xhbmd1YWdlIjoiIiwic3VidGl0bGVMYW5ndWFnZSI6IiIsImNpbmVtYUlkIjowLCJzaG93dGltZSI6IiIsImlzRmF2b3JpdGVDaW5lbWEiOmZhbHNlLCJwYXJ0bmVySWQiOjYsInByb3ZpZGVySWQiOjExOSwiY2xpY2tvdXRUeXBlIjoianctY29udGVudC1wYXJ0bmVyLWV4cG9ydC1hcGkifX0seyJzY2hlbWEiOiJpZ2x1OmNvbS5qdXN0d2F0Y2gvdGl0bGVfY29udGV4dC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJ0aXRsZUlkIjo0MjQwOSwib2JqZWN0VHlwZSI6Im1vdmllIiwiandFbnRpdHlJZCI6InRtNDI0MDkiLCJzZWFzb25OdW1iZXIiOjAsImVwaXNvZGVOdW1iZXIiOjB9fV19&r=https%3A%2F%2Fapp.primevideo.com%2Fdetail%3Fgti%3Damzn1.dv.gti.48b0548f-fcfb-a628-6a3c-f0817a3f6c3a%26ie%3DUTF8%26linkCode%3Dxm2&uct_country=in" title="Watch Fight Club on Amazon Prime Video" target="_blank" rel="noopener"><img src="/t/p/original/68MNrwlkpF7WnmNPXLah69CR5cb.jpg" width="50" height="50">

// <a href="https://click.justwatch.com/a?cx=eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uanVzdHdhdGNoL2NsaWNrb3V0X2NvbnRleHQvanNvbnNjaGVtYS8xLTItMCIsImRhdGEiOnsicHJvdmlkZXIiOiJWb290IiwibW9uZXRpemF0aW9uVHlwZSI6ImZsYXRyYXRlIiwicHJlc2VudGF0aW9uVHlwZSI6ImhkIiwiY3VycmVuY3kiOiJJTlIiLCJwcmljZSI6MCwib3JpZ2luYWxQcmljZSI6MCwiYXVkaW9MYW5ndWFnZSI6IiIsInN1YnRpdGxlTGFuZ3VhZ2UiOiIiLCJjaW5lbWFJZCI6MCwic2hvd3RpbWUiOiIiLCJpc0Zhdm9yaXRlQ2luZW1hIjpmYWxzZSwicGFydG5lcklkIjo2LCJwcm92aWRlcklkIjoxMjEsImNsaWNrb3V0VHlwZSI6Imp3LWNvbnRlbnQtcGFydG5lci1leHBvcnQtYXBpIn19LHsic2NoZW1hIjoiaWdsdTpjb20uanVzdHdhdGNoL3RpdGxlX2NvbnRleHQvanNvbnNjaGVtYS8xLTAtMCIsImRhdGEiOnsidGl0bGVJZCI6NDI0MDksIm9iamVjdFR5cGUiOiJtb3ZpZSIsImp3RW50aXR5SWQiOiJ0bTQyNDA5Iiwic2Vhc29uTnVtYmVyIjowLCJlcGlzb2RlTnVtYmVyIjowfX1dfQ&r=https%3A%2F%2Fwww.voot.com%2Fmovie%2Ffight-club%2F621842&uct_country=in" title="Watch Fight Club on Voot" target="_blank" rel="noopener"><img src="/t/p/original/ycJT3Xh9E4OH3eW1QZ1OOR9pCCj.jpg" width="50" height="50"></a>

//  https://click.justwatch.com/a?cx=eyJzY2hlbWEiOiJpZ2x1OmNvbS5zbm93cGxvd2FuYWx5dGljcy5zbm93cGxvdy9jb250ZXh0cy9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6W3sic2NoZW1hIjoiaWdsdTpjb20uanVzdHdhdGNoL2NsaWNrb3V0X2NvbnRleHQvanNvbnNjaGVtYS8xLTItMCIsImRhdGEiOnsicHJvdmlkZXIiOiJBbWF6b24gUHJpbWUgVmlkZW8iLCJtb25ldGl6YXRpb25UeXBlIjoiZmxhdHJhdGUiLCJwcmVzZW50YXRpb25UeXBlIjoic2QiLCJjdXJyZW5jeSI6IklOUiIsInByaWNlIjowLCJvcmlnaW5hbFByaWNlIjowLCJhdWRpb0xhbmd1YWdlIjoiIiwic3VidGl0bGVMYW5ndWFnZSI6IiIsImNpbmVtYUlkIjowLCJzaG93dGltZSI6IiIsImlzRmF2b3JpdGVDaW5lbWEiOmZhbHNlLCJwYXJ0bmVySWQiOjYsInByb3ZpZGVySWQiOjExOSwiY2xpY2tvdXRUeXBlIjoianctY29udGVudC1wYXJ0bmVyLWV4cG9ydC1hcGkifX0seyJzY2hlbWEiOiJpZ2x1OmNvbS5qdXN0d2F0Y2gvdGl0bGVfY29udGV4dC9qc29uc2NoZW1hLzEtMC0wIiwiZGF0YSI6eyJ0aXRsZUlkIjo0MjQwOSwib2JqZWN0VHlwZSI6Im1vdmllIiwiandFbnRpdHlJZCI6InRtNDI0MDkiLCJzZWFzb25OdW1iZXIiOjAsImVwaXNvZGVOdW1iZXIiOjB9fV19&r=https%3A%2F%2Fapp.primevideo.com%2Fdetail%3Fgti%3Damzn1.dv.gti.48b0548f-fcfb-a628-6a3c-f0817a3f6c3a%26ie%3DUTF8%26linkCode%3Dxm2&uct_country=in" title="Watch Fight Club on Amazon Prime Video" target="_blank" rel="noopener"><img src="/t/p/original/68MNrwlkpF7WnmNPXLah69CR5cb.jpg" width="50" height="50"></a>

// https://rapidapi.com/search/movie
// https://rapidapi.com/movie-of-the-night-movie-of-the-night-default/api/streaming-availability

//  Flick | Sick
// movie freak

// https://www.google.com/search?q=watching%20movie%20logo&tbm=isch&tbs=rimg:CcRUhbmpaj7fYZMnNPc_1FWsW&hl=en&sa=X&ved=0CB4QuIIBahcKEwi4_JD7zsXwAhUAAAAAHQAAAAAQAg&biw=1440&bih=632
