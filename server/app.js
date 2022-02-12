const express = require('express');
const bodyParser = require('body-parser')
const path = require('path');
const cors = require("cors");
const Database = require('./database')
const Twitter = require('./twitter')
const app = express();
require('dotenv').config()
var mysql2 = require('mysql2/promise');
const port = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const database = new Database()
const twitter = new Twitter(process.env.FB_CONSUMER_KEY, process.env.FB_CONSUMER_SECRET, process.env.TWITTER_DM_TOKEN, process.env.TWITTER_DM_SECRET)
var userTwitter = null
if(process.env.ENV == "DEV"){
  var mainUrl="http://localhost:3000"
  var callbackUrlForTwitter = "http://localhost:3000"
}else{
  var callbackUrlForTwitter = "https://feurmons-leurs-gueules.net"
  var mainUrl="https://feurmons-leurs-gueules.net"
}

var session = require('express-session');

var MySQLStore = require('express-mysql-session')(session);

var options = {
	host    :process.env.DB_HOST,
  user    :process.env.DB_USER,
  password:process.env.DB_PASSWORD,
	database: 'session'
};

var connection = mysql2.createPool(options);
var sessionStore = new MySQLStore({}, connection);

app.use(session({
	key: 'session_feurme',
	secret: process.env.SESSION_SECRET,
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}));

const req = require('express/lib/request');

app.get('/api/user', function (req, res) {
  if(req.query.username){
    database.getUser(req.query.username, function(err, results){
      if(results) {
        database.getHowManyAbove(function(err, how_many){
          results.rank = how_many.count + 1
          database.getCountTrolls(function(err, trolls){
            results.total_trolls = trolls.count + 1
            database.getCountVictims(function(err, victims){
              results.total_victims = victims.count + 1
              database.getHowManyAboveVictim(function(err, how_many_victims){
                results.rank_victim = how_many_victims.count + 1
                database.getLatestTweetsFrom(function(err, tweets){
                  results.tweets = tweets
                  res.json(results)
                }, 10, results.username)
              }, results.nb_received)  
            })
          })
        }, results.nb_sent)
      } else {
        res.json(results)
      }
    })
  }
});

app.get('/api/tweet/latest', function (req, res) {
  if(req.query.limit){
    database.getLastTweets(req.query.limit, function(err, results){
      res.json({'result': results, 'errors': err})
    })
  }
});

app.get('/api/stats', function (req, res) {
  database.getDailyStats(function(err, results){
    res.json(results)
  })
});

app.get('/api/latestUpdate', function (req, res) {
  database.getLatestUpdate(function(err, results){
    res.json(results)
  })
});

app.get('/api/troll/total', function (req, res) {
  database.getTotalTrolls(function(err, results){
    res.json(results)
  })
});

app.get('/api/victim/total', function (req, res) {
  database.getTotalVictims(function(err, results){
    res.json(results)
  })
});

app.get('/api/troll/max', function (req, res) {
  database.getMaxTroll(function(err, results){
    res.json(results)
  })
});

app.get('/api/victim/max', function (req, res) {
  database.getMaxVictim(function(err, results){
    res.json(results)
  })
});

app.get('/api/tweet/total', function (req, res) {
  database.getTotalTweets(function(err, results){
    res.json(results)
  })
});

app.use('/', express.static('./dist', {
  index: "index.html"
}))

app.listen(port, () => console.log(`App listening on port ${port}!`))
