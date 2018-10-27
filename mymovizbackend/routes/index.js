var express = require('express');
var router = express.Router();
var request = require('request');
var mongoose= require('mongoose');

var options = { server: { socketOptions: {connectTimeoutMS: 5000 } }};

mongoose.connect('mongodb://Sujay:abc123@ds123852.mlab.com:23852/mymovizapp',
    options,
    function(err) {
     console.log(err);
    }
);

var movieSchema = mongoose.Schema({
    poster_path: String,
    overview: String,
    title: String,
    idMovieDB: Number,

});

var movieModel = mongoose.model('movies', movieSchema);

//une route en méthode GET nommée ​/movie  La liste des films récents
router.get('/movies', function(req, res, next) {
  request("https://api.themoviedb.org/3/discover/movie?api_key=c1f47d39fdb6e1b7b18289bd483287ce&language=en-IN&region=IN&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&primary_release_date.gte=2018-10-01", function(error, response, body) {
  body = JSON.parse(body);
  res.json(body.results);
  });
});


//une route en méthode GET nommée ​/mymovies
router.get('/mymovies', function(req, res, next) {
  movieModel.find(
    function (err, data) {
        res.json(data);
    }
)

});

router.post('/mymovies', function(req, res, next) {
  var newLikeMovie = new movieModel ({
    poster_path: req.body.poster_path,
    overview: req.body.overview,
    title: req.body.title,
    idMovieDB: req.body.idMovieDB,
    });

    newLikeMovie.save(
      function (error, movie) {
         res.json({result: true});
      }
  );
  });

router.delete('/mymovies/:movieId', function(req, res, next) {
  movieModel.remove({ idMovieDB: req.params.movieId},
    function(error) {
      res.json({result: true});
    });
});

module.exports = router;
