var MongoClient = require('mongodb').MongoClient;
const Discord = require('discord.js');
var url = "mongodb://127.0.0.1:27017/";

module.exports = {
    name : 'answering',
    description : '',
    async execute(message, args, ans){
        var a = args[0];
        const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});
        for(var p = 1; p < args.length; p = p + 1)
        {
            a = a + ' ';
            a = a + args[p];
        }
        const emoji = '✅';
        const emoji1 = '❌';
        if(a.trim() == ans.trim())
        {
            message.channel.send("Correct Answer");
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("Leaderboard");
                var myquery = { id : message.author.id , answered : 0};
                var myquery1 = { id : message.author.id};
                var newvalues = { $set: { answered : 1}, $inc : {"points" : 10} };
                var obj = {id : message.author.id, points : 10, answered : 1};
                dbo.collection("Points").find(myquery1).toArray(function(err, result) {
                    if(err) throw err;
                    if(result.length == 0)
                    {
                        dbo.collection("Points").insertOne(obj, function(err, res){
                            if (err) throw err;
                        });
                    }
                    else
                    {
                        dbo.collection("Points").find(myquery).toArray(function(err, res) {
                            if (err) throw err;
                            if(res.length == 0)
                                message.channel.send("You have already answered correctly");
                            else
                                dbo.collection("Points").updateOne(myquery, newvalues, function(err, res){
                                    if (err) throw err;
                                });
                        });
                    }
                });
              });
        }
        else
        {
            message.channel.send("Please wait while the quizmasters verify your answer");
            let msg = new Discord.Message();
            msg.content = a;
            var channellog = message.client.channels.cache.get('789382147810918430');
            let messageEmbed = await channellog.send(msg);
            messageEmbed.react(emoji);
            messageEmbed.react(emoji1);
            messageEmbed.awaitReactions(() => {return true; }, { max: 5, time: 120000, errors: ['time'] })
            .then(collected => {
                if (collected.first().count > collected.last().count) {
                    message.channel.send(a + " is correct");
                    MongoClient.connect(url, function(err, db) {
                        if (err) throw err;
                        var dbo = db.db("Leaderboard");
                        var myquery = { id : message.author.id , answered : 0};
                        var myquery1 = { id : message.author.id};
                        var newvalues = { $set: { answered : 1}, $inc : {"points" : 10} };
                        var obj = {id : message.author.id, points : 10, answered : 1};
                        dbo.collection("Points").find(myquery1).toArray(function(err, result) {
                            if(err) throw err;
                            if(result.length == 0)
                            {
                                dbo.collection("Points").insertOne(obj, function(err, res){
                                    if (err) throw err;
                                });
                            }
                            else
                            {
                                dbo.collection("Points").updateOne(myquery, newvalues, function(err, res) {
                                    if (err) throw err;
                                    db.close();
                                });
                            }
                        });
                      });
                    messageEmbed.delete();
                } else {
                    message.channel.send(a + " is wrong");
                    messageEmbed.delete();
                }
            })
            .catch(() => {
                messageEmbed.delete();
                message.channel.send('Seems like the quizmasters are busy atm. Try sending your message again');
            });
        }
    }
}