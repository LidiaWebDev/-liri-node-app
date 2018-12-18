require("dotenv").config();
var fs = require("fs");
var request = require("request");
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
//New modules
var chalk = require("chalk");
var figlet = require("figlet");
//Arguments
var command = process.argv[2];
var parameter = process.argv[3];

//SwitchCase function
function switchCase() {
  switch (command) {
    case "concert-this":
      bandsInTown(parameter);
      break;

    case "spotify-this-song":
      spotifySong(parameter);
      break;

    case "movie-this":
      omdbInfo(parameter);
      break;

    case "do-what-it-says":
      getRandom();
      break;
  }
}

//Bands in Town Artist Events API

function bandsInTown(parameter) {
  if ("concert-this") {
    var artist = "";
    for (var i = 3; i < process.argv.length; i++) {
      artist += process.argv[i];
    }
    let artistFig = "Artist";
    figlet(artistFig, function(err, data) {
      if (err) {
        console.log("oops, find the problem");
        console.dir(err);
        return;
      }
      console.log(chalk.blueBright(data));
    });
    // console.log(artist);
  } else {
    artist = parameter;
  }

  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";

  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var data = JSON.parse(body);
      for (i = 0; i < data.length; i++) {
        var dateTime = data[i].datetime;
        var month = dateTime.substring(5, 7);
        var year = dateTime.substring(0, 4);
        var day = dateTime.substring(8, 10);
        var dateForm = month + "/" + day + "/" + year;

        display(chalk.green("Name: " + data[i].venue.name));
        display(chalk.green("City: " + data[i].venue.city));
        display(chalk.green("Date: " + dateForm));
        display(
          chalk.blue("\n---------------------------------------------------\n")
        );
      }
    }
  });
}

//Spotify Api

let songFig = "Song";

function spotifySong(parameter) {
  var defaultSong;
  if (parameter === undefined) {
    defaultSong = "Ace of Base The Sign";
  } else {
    defaultSong = parameter;
  }

  figlet(songFig, function(err, data) {
    if (err) {
      console.log("oops, find the problem");
      console.dir(err);
      return;
    }
    console.log(chalk.green(data));
  });

  spotify.search(
    {
      type: "track",
      query: defaultSong
    },
    function(error, data) {
      if (error) {
        display("Error recorded: " + error);
        return;
      } else {
        display(
          chalk.blue("\n---------------------------------------------------\n")
        );
        display(chalk.green("Artist: " + data.tracks.items[0].artists[0].name));
        display(chalk.green("Song: " + data.tracks.items[0].name));
        display(chalk.green("Preview: " + data.tracks.items[3].preview_url));
        display(chalk.green("Album: " + data.tracks.items[0].album.name));
        display(
          chalk.blue("\n---------------------------------------------------\n")
        );
      }
    }
  );
}

//Ombg API

function omdbInfo(parameter) {
  var findMovie;
  if (parameter === undefined) {
    findMovie = "Mr. Nobody";
    console.log("-----------------------");
    console.log(
      "If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/"
    );
    console.log("It's on Netflix!");
  } else {
    findMovie = parameter;
  }

  let omdbFig = "Movie";
  figlet(omdbFig, function(err, data) {
    if (err) {
      console.log("There is a problem!");
      console.dir(err);
      return;
    }
    console.log(chalk.blue(data));
  });

  var queryUrl =
    "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";

  request(queryUrl, function(err, res, body) {
    var movie = JSON.parse(body);
    if (!err && res.statusCode === 200) {
      display(chalk.blueBright("Title of the movie: " + movie.Title));
      display(chalk.green("Year the movie came out: " + movie.Year));
      display(chalk.green("IMDB Rating of the movie: " + movie.imdbRating));
      display(
        chalk.green(
          "Rotten Tomatoes Rating of the movie: " + movie.tomatoRating
        )
      );
      display(
        chalk.green("Country where the movie was produced: " + movie.Country)
      );
      display(chalk.green("Language of the movie: " + movie.Language));
      display(chalk.green("Plot of the movie: " + movie.Plot));
      display(chalk.green("Actors in the movie: " + movie.Actors));
      display(
        chalk.yellow("\n---------------------------------------------------\n")
      );
    } else {
      //else - throw error
      console.log("Error occurred.");
    }
  });
}

//Random.txt

function getRandom() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return display(error);
    }

    var dataArr = data.split(",");

    if (dataArr[0] === "spotify-this-song") {
      var songcheck = dataArr[1].trim().slice(1, -1);
      spotifySong(songcheck);
    }
  });
}

//log.txt

function display(dataToLog) {
  console.log(dataToLog);

  fs.appendFile("log.txt", dataToLog + "\n", function(err) {
    if (err) return display("Error logging data to file: " + err);
  });
}

switchCase();
