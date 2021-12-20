const { TwitterApi } = require('twitter-api-v2');
const { ApiResponseError } = require('twitter-api-v2');
var request = require('request');
const Database = require('./database');

module.exports = class Twitter {

    constructor(appKey, appSecret, accessToken, accessSecret, userId=null, username=null) {
        this.client = new TwitterApi({
            appKey: appKey,
            appSecret: appSecret,
            accessToken: accessToken,
            accessSecret: accessSecret
        });
        this.v1Client = this.client.v1;
        this.v2Client = this.client.v2;
        this.userId = userId
        this.username = username
    }

    launchAction = (users, action, userHistory, database, twitter) => {
        var self = this
        if(action == "mute"){
            if(userHistory.length == 0){
                database.addNewUserToBlockHistory(this.userId, this.username, 0, 1, users.length, function(err, results){
                    if(!err){
                        self.performActionOn(users, self.muteUser, database, twitter, "masqué")
                    }else{
                        console.log(err)
                    }
                })
            } else {
                database.addNewMask(this.userId, userHistory[0].masks+1, users.length, function(err, results){
                if(!err){
                    self.performActionOn(users, self.muteUser, database, twitter, "masqué")
                }else{
                    console.log(err)
                }})
            }
        } else if(action == "unmute") {
            if(userHistory.length == 0 || userHistory[0].masks == 0){
                return {error: "Tu n'as jamais masqué d'utilisateurs via ce site, il faut en masquer avant d'utiliser l'option 'démasquer'"}
            } else {
                database.addNewUnmask(this.userId, userHistory[0].unmasks+1, users.length, function(err, results){
                if(!err){
                    self.performActionOn(users, self.unmuteUser, database, twitter, "démasqué")
                }else{
                    console.log(err)
                }})
            }
        } else if(action == "block") {
            if(userHistory.length == 0){
                database.addNewUserToBlockHistory(this.userId, this.username, 1, 0, users.length, function(err, results){
                    if(!err){
                        self.performActionOn(users, self.blockUser, database, twitter, "bloqué")
                    }else{
                        console.log(err)
                    }
                })
            } else {
                database.addNewBlock(this.userId, userHistory[0].blocks+1, users.length, function(err, results){
                if(!err){
                    self.performActionOn(users, self.blockUser, database, twitter, "bloqué")
                }else{
                    console.log(err)
                }})
            }
        } else if(action == "unblock"){
            if(userHistory.length == 0 || userHistory[0].blocks == 0){
                return {error: "Tu n'as jamais bloqué d'utilisateurs via ce site, il faut en bloquer avant d'utiliser l'option 'débloquer'"}
            } else {
                database.addNewUnblock(this.userId, userHistory[0].unblocks+1, users.length, function(err, results){
                if(!err){
                    self.performActionOn(users, self.unblockUser, database, twitter, "débloqué")
                }else{
                    console.log(err)
                }})
            }
        }
        return {usersLeft: users.length}
    } 

    performActionOn = async (users, action, database, twitter, verb) => {
        for(var i in users){
            try {       
                await action(users[i].ID)
            } catch(error) {
                if (error instanceof ApiResponseError && error.rateLimitError && error.rateLimit) {
                    const resetTimeout = error.rateLimit.reset * 1000; // convert to ms time instead of seconds time
                    const timeToWait = resetTimeout - Date.now();
            
                    database.updateRemaining(this.userId, (users.length-i), function(err, results){if(err)console.log(err)})
                    await new Promise(resolve => setTimeout(resolve, timeToWait));
                    try {
                        await action(users[i].ID)
                    } catch(error){
                        console.log(error)
                        continue;
                    }
                    continue;
                } else {
                    console.log(error)
                    continue;
                }
                throw error;
            }
        }
        database.finishBlockTask(this.userId, function(err, results){if(err)console.log(err)})
        //twitter.sendDM("Hello, normalement j'ai bien " + verb + " tous les utilisateurs comme tu l'as demandé sur le site https://feurmons-leur-gueules.net ! Vérifie quand même dans tes options Twitter pour être sûr(e) !", this.userId)
    }
    
    muteUser = async (mutedUserId) => {
        await this.v2Client.mute(this.userId, mutedUserId)
    }

    unmuteUser = async (mutedUserId) => {
        await this.v2Client.unmute(this.userId, mutedUserId)
    }

    blockUser = async (blockedUserId) => {
        await this.v2Client.block(this.userId, blockedUserId)
    }

    unblockUser = async (blockedUserId) => {
        await this.v2Client.unblock(this.userId, blockedUserId)
    }

    muteUserv1 = (mutedUserId) => {
        this.dmClient.v2.mute("1472594318728830977", "1470060552911216645")
        request.post("https://api.twitter.com/1.1/mutes/users/create.json", {
            oauth:{
                consumer_key:process.env.FB_CONSUMER_KEY,
                consumer_secret:process.env.FB_CONSUMER_SECRET,
                token:process.env.TWITTER_DM_TOKEN,
                token_secret:process.env.TWITTER_DM_SECRET
            }, qs:{user_id:mutedUserId, skip_status:1}
        }, function(error, response){
            console.log(response.headers)
            console.log(error)
        })
    }

    unmuteUserv1 = (mutedUserId) => {
        request.post("https://api.twitter.com/1.1/mutes/users/destroy.json", {
            oauth:{
                consumer_key:process.env.FB_CONSUMER_KEY,
                consumer_secret:process.env.FB_CONSUMER_SECRET,
                token:process.env.TWITTER_DM_TOKEN,
                token_secret:process.env.TWITTER_DM_SECRET
            }, qs:{user_id:mutedUserId, skip_status:1}
        }, function(error, response){
            console.log(response.headers)
            console.log(error)
        })
    }

    blockUserv1 = (blockedUserId) => {
        request.post("https://api.twitter.com/1.1/blocks/create.json", {
            oauth:{
                consumer_key:process.env.FB_CONSUMER_KEY,
                consumer_secret:process.env.FB_CONSUMER_SECRET,
                token:process.env.TWITTER_DM_TOKEN,
                token_secret:process.env.TWITTER_DM_SECRET
            }, qs:{user_id:blockedUserId, skip_status:1}
        }, function(error, response){
            console.log(response)
            console.log(error)
        })
        //this.dmClient.v2.block(userId, blockedUserId);
        //client.v2.block('1472594318728830977', '1470060552911216645');
    }

    unblockUserv1 = (blockedUserId) => {
        request.post("https://api.twitter.com/1.1/blocks/destroy.json", {
            oauth:{
                consumer_key:process.env.FB_CONSUMER_KEY,
                consumer_secret:process.env.FB_CONSUMER_SECRET,
                token:process.env.TWITTER_DM_TOKEN,
                token_secret:process.env.TWITTER_DM_SECRET
            }, qs:{user_id:blockedUserId, skip_status:1}
        }, function(error, response){
            console.log(response)
            console.log(error)
        })
    }

    sendDM = (text, recipientId) => {
        this.v1Client.sendDm({
            recipient_id: recipientId,
            text: text
        });
    }

}