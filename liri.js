require("dotenv").config();
var request = require("request");
var Spotify = require("node-spotify-api");
var twitter = require("twitter");
var keys = require("./keys.js");
var fs = require("fs");

var spotify = new Spotify(keys.spotify);
var client = new twitter(keys.twitter);

var command = process.argv[2];
var search = "";

for (var i = 3; i < process.argv.length; i++) {
    var searchAdd = process.argv[i];
    if (i === 3) {
        search += searchAdd;
    }
    else {
        search += " " + searchAdd
    }
}

switch (command) {
    case "my-tweets":
        myTweets();
        break;

    case "spotify-this-song":
        spotifyThis();
        break;

    case "movie-this":
        movieThis();
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    default:
        console.log("Please select a valid command. Those commands are my-tweets, spotify-this-song, movie-this, and do-what-it-says.")
}


function myTweets() {
    var params = { screen_name: 'maxmaxermax', count: 20 };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            throw error
        }
        console.log(tweets[0].text);
        for (var i = 0; i < tweets.length; i++) {
            console.log(tweets[i].text + " created at: " + tweets[i].created_at);
        }
    });
}

function spotifyThis() {
    
    spotify.search({ type: "track", query: search }, function (err, data) {
        if (err) {
            throw err;
        }
        var songResults = data.tracks.items

        for (var i = 0; i < songResults.length; i++) {
            console.log("-----------------------------------");
            console.log("Artist: " + songResults[i].artists[0].name);
            console.log("Song Title: " + songResults[i].name);
            console.log("Preview link: " + songResults[i].preview_url);
            console.log("Album Title: " + songResults[i].album.name);
        }
    });
}

function movieThis() {

    var queryUrl = "http://www.omdbapi.com/?t=" + search + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            
            console.log("--------------------------------------");
            console.log("Title: " + JSON.parse(body).Title);
            console.log("Relase Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Tomatometer: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country of Production: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot Summary:");
            console.log(JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}
function doWhatItSays() {
 fs.readFile("random.txt", "utf8", function(err, data){
     if (err) {
         throw err;
     }
     
     var choiceArr = data.split(",");
     command = choiceArr[0];
     search = choiceArr[1];
    

     switch (command) {
        case "my-tweets":
            myTweets();
            break;
    
        case "spotify-this-song":
            spotifyThis();
            break;
    
        case "movie-this":
            movieThis();
            break;
    
        case "do-what-it-says":
            console.log("I'm not doing an infinite loop over here. Grow up.")
            break;
    
        default:
            console.log("Please select a valid command. Those commands are my-tweets, spotify-this-song, movie-this, and do-what-it-says.")
    }
    
 });
}