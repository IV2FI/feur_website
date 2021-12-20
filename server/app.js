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

var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
const req = require('express/lib/request');

passport.use(new Strategy({
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  callbackURL: callbackUrlForTwitter+"/api/login/callback",
  passReqToCallback: true
}, function(req, token, tokenSecret, profile, callback) {
  profile.token = token
  profile.tokenSecret = tokenSecret
  callbackFromTwitter = mainUrl+"?option="+req.query.option+"&on="+req.query.on
  userTwitter = new Twitter(process.env.CONSUMER_KEY, process.env.CONSUMER_SECRET, token, tokenSecret, profile.id, profile.username)
  return callback(null, profile);
}));

passport.serializeUser(function(user, callback) {
  callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
  callback(null, obj);
})

app.use(passport.initialize())
app.use(passport.session())

app.get('/api/login/callback', passport.authenticate('twitter', {
  failureRedirect: mainUrl
}), async function(req, res) {
  if(req.session && req.session.callbackFromTwitter){
    res.redirect(req.session.callbackFromTwitter)
  }
  else{ 
    res.redirect(mainUrl)
  }
})

app.get('/api/login/twitter', function(req, res){
  req.session.callbackFromTwitter = mainUrl+"?option="+req.query.option+"&on="+req.query.on
  res.redirect('/api/twitter/login')
})

app.get('/api/twitter/login', passport.authenticate('twitter'))

app.get('/api/numberOfMasks', function(req, res){
  database.getTotalMasks(function(err, results){
    res.json(results[0])
  })
})

app.get('/api/numberOfUnMasks', function(req, res){
  database.getTotalUnmasks(function(err, results){
    res.json(results[0])
  })
})

app.get('/api/numberOfBlocks', function(req, res){
  database.getTotalBlocks(function(err, results){
    res.json(results[0])
  })
})

app.get('/api/numberOfUnBlocks', function(req, res){
  database.getTotalUnblocks(function(err, results){
    res.json(results[0])
  })
})

app.get('/api/getTotalWordMutes', function(req, res){
  database.getTotalWordMutes(function(err, results){
    res.json(results[0])
  })
})

app.get('/api/getTotalWordUnMutes', function(req, res){
  database.getTotalWordUnMutes(function(err, results){
    res.json(results[0])
  })
})

app.get('/api/addWordMute', function(req, res){
  database.addNewWordMutesToTableHistory(function(err, results){
    res.json(results)
  })
})

app.get('/api/addWordUnMute', function(req, res){
  database.addNewWordUnMutesToTableHistory(function(err, results){
    res.json(results)
  })
})

app.get('/api/twitter/isSession', function(req, res){
  if(req.session.passport && req.session.passport.user){
    res.json({result: true})
  }else{
    res.json({result:false})
  }
})

app.get("/api/userBlockHistory", function(req, res){
  if(req.session.passport && req.session.passport.user){
    database.getUserBlockHistory(req.session.passport.user.id, function(err, results){
      res.json(results)
    })
  }else{
    res.json(null)    
  }
})

app.get("/api/feurme-la", function(req, res){
  if(req.query.on && req.query.action && req.session.passport && req.session.passport.user){
    database.getUserBlockHistory(req.session.passport.user.id, function(err, userHistory){
      if(req.query.on == "avg"){
        database.getAboveAverageScore(function(err, results){
          res.json(userTwitter.launchAction(results, req.query.action, userHistory, database, twitter))
        })
      } else if(req.query.on == "most"){
        database.getTopXPercent(1, function(err, results){
          res.json(userTwitter.launchAction(results, req.query.action, userHistory, database, twitter))
        })
      } else if(req.query.on == "all"){
        database.getEveryUsers(function(err, results){
          res.json(userTwitter.launchAction(results, req.query.action, userHistory, database, twitter))
        })
      }
    })
  }
})

app.get('/api/getCount', function (req, res) {
  database.getCount(function(err, results){
    res.json(results)
  })
});

app.get('/api/getTopXPercent', function (req, res) {
  database.getAboveAverageScore(function(err, results){
    res.json(results)
  })
});

app.get('/api/getCount', function (req, res) {
  database.getCount(function(err, results){
    res.json(results)
  })
});

app.get('/api/getMaxFeurs', function (req, res) {
  database.getMaxFeurs(function(err, results){
    res.json(results)
  })
});

app.get('/api/getUser', function (req, res) {
  if(req.query.username){
    database.getUser(req.query.username, function(err, results){
      res.json(results)
    })
  }
});

app.get('/api/getTotalFeurs', function (req, res) {
  database.getTotalFeurs(function(err, results){
    res.json(results)
  })
});

app.get('/api/getLastUsers', function (req, res) {
  if(req.query.limit){
    database.getLastUsers(req.query.limit, function(err, results){
      res.json({'result': results, 'errors': err})
    })
  }
});

app.use('/', express.static('./dist', {
  index: "index.html"
}))

app.listen(port, () => console.log(`App listening on port ${port}!`))
