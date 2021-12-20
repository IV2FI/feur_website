const { createProxy } = require('http-proxy');
var mysql = require('mysql2');
const moment = require('moment')

module.exports = class Database {
    constructor() {
        this.connection = mysql.createConnection({
            host    :process.env.DB_HOST,
            user    :process.env.DB_USER,
            password:process.env.DB_PASSWORD,
            database:process.env.DB_NAME,
            supportBigNumbers: true
        });
        this.connection.connect()
        this.blockHistoryTable = process.env.DB_TABLE_BLOCK
        this.userTable = process.env.DB_TABLE_USERS
        this.wordMutesTable = process.env.DB_WORD_MUTES
    }

    getUserBlockHistory = (userId, callback) => {
        var sql = "SELECT * FROM " + this.blockHistoryTable + " WHERE id=" + userId
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    getTotalMasks = (callback) => {
        var sql = "SELECT SUM(masks) AS total FROM " + this.blockHistoryTable
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    getTotalBlocks = (callback) => {
        var sql = "SELECT SUM(blocks) AS total FROM " + this.blockHistoryTable
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    getTotalUnblocks = (callback) => {
        var sql = "SELECT SUM(unblocks) AS total FROM " + this.blockHistoryTable
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    getTotalUnmasks = (callback) => {
        var sql = "SELECT SUM(unmasks) AS total FROM " + this.blockHistoryTable
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    getTotalWordMutes = (callback) => {
        var sql = "SELECT SUM(wordMutes) AS total FROM " + this.wordMutesTable
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    getTotalWordUnMutes = (callback) => {
        var sql = "SELECT SUM(wordUnmutes) AS total FROM " + this.wordMutesTable
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }
    
    addNewWordMutesToTableHistory = (callback) => {
        var self = this
        this.getTotalWordMutes(function(err, results){
            var wordMutes = parseInt(results[0].total) + 1
            var sql = "UPDATE " + self.wordMutesTable + " SET wordMutes="+wordMutes+" WHERE ID=1"
            self.connection.query(sql, function(err, results){
                callback(err, results)
            })
        }) 
    }

    addNewWordUnMutesToTableHistory = (callback) => {
        var self = this
        this.getTotalWordUnMutes(function(err, results){
            var wordUnMutes = parseInt(results[0].total) + 1
            var sql = "UPDATE " + self.wordMutesTable + " SET wordUnmutes="+wordUnMutes+" WHERE ID=1"
            self.connection.query(sql, function(err, results){
                callback(err, results)
            })
        }) 
    }

    addNewUserToBlockHistory = (userId, name, blocks, masks, remaining, callback) => {
        var sql = "INSERT INTO " + this.blockHistoryTable + " (id, name, blocks, masks, ongoing, started_at, remaining) VALUES ("+userId+",'"+name+"',"+blocks+","+masks+", 1,'"+moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')+"',"+remaining+")"
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    addNewBlock = (userId, blocks, remaining, callback) => {
        var sql = "UPDATE " + this.blockHistoryTable + " SET blocks="+blocks+", ongoing=1, started_at='"+moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')+"', remaining="+remaining+" WHERE id="+userId
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    addNewUnblock = (userId, unblocks, remaining, callback) => {
        var sql = "UPDATE " + this.blockHistoryTable + " SET unblocks="+unblocks+", ongoing=1, started_at='"+moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')+"', remaining="+remaining+" WHERE id="+userId
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    addNewMask = (userId, masks, remaining, callback) => {
        var sql = "UPDATE " + this.blockHistoryTable + " SET masks="+masks+", ongoing=1, started_at='"+moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')+"', remaining="+remaining+" WHERE id="+userId
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    addNewUnmask = (userId, unmasks, remaining, callback) => {
        var sql = "UPDATE " + this.blockHistoryTable + " SET unmasks="+unmasks+", ongoing=1, started_at='"+moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')+"', remaining="+remaining+" WHERE id="+userId
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    updateRemaining = (userId, remaining, callback) => {
        var sql = "UPDATE " + this.blockHistoryTable + " SET remaining="+remaining+" WHERE id="+userId
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    finishBlockTask = (userId, callback) => {
        var sql = "UPDATE " + this.blockHistoryTable + " SET finished_at='"+moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')+"', ongoing=0, remaining="+0+" WHERE id="+userId
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    getEveryUsers = (callback) => {
        var sql = "SELECT * FROM " + this.userTable
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    getTopXPercent = (x, callback) => {
        var sql = "SELECT * FROM ( SELECT feur_users.*, @counter := @counter +1 AS counter FROM (select @counter:=0) AS initvar, feur_users ORDER BY feurs DESC ) AS X where counter <= ("+x+"/100 * @counter) ORDER BY feurs DESC"
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    getAboveAverageScore = (callback) => {
        var self = this
        this.getAverageFeurs(function(err, results){
            var avg = Math.ceil(parseInt(results[0].avg))
            var sql = "SELECT * FROM " + self.userTable + " WHERE feurs>"+avg
            self.connection.query(sql, function(err, results){
                callback(err, results)
            })
        })
    }

    getAverageFeurs = (callback) => {
        var sql = "SELECT AVG(feurs) AS avg FROM " + this.userTable
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    getCount = (callback) => {
        var sql = "SELECT COUNT(*) AS count FROM " + this.userTable
        this.connection.query(sql, function(err, results){
            callback(err, results[0])
        })
    }

    getUser = (username, callback) => {
        var sql = "SELECT * FROM " + this.userTable + " WHERE name="+this.connection.escape(username)
        this.connection.query(sql, function(err, results){
            callback(err, results)
        })
    }

    getMaxFeurs = (callback) => {
        var sql = "SELECT * FROM " + this.userTable + " ORDER BY feurs DESC LIMIT 1";
        this.connection.query(sql, function(err, results){
            callback(err, results[0])
        })
    }

    getTotalFeurs = (callback) => {
        var sql = "SELECT SUM(feurs) AS total FROM " + this.userTable
        this.connection.query(sql, function(err, results){
            callback(err, results[0])
        })
    }

    getLastUsers = (limit, callback) => {
        limit = parseInt(limit)
        if(limit < 20)  {
            var sql = "SELECT * FROM " + this.userTable + " ORDER BY updated_at DESC LIMIT " + limit;
            this.connection.query(sql, function(err, results){
                callback(err, results)
            })
        } else {
            throw new Error("Cannot select that many")
        }
    }
}