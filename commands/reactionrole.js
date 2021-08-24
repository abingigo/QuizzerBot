const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

module.exports = {
    name : 'reactionrole',
    description : '',
    async execute(message, Discord, client){
        const emoji = '🔥';

        let embed = new Discord.MessageEmbed()
            .setColor('#e42643')
            .setTitle('Quiz starting soon!')
            .setDescription('Press the ' + `${emoji}` + ' to be able to participate!');
        
        var channellog = message.client.channels.cache.get('839728047165800498');
        let messageEmbed = await channellog.send(embed);
        messageEmbed.react(emoji);

        client.on('messageReactionAdd', async (reaction, user) => {
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            if(user.bot) return;
            if(reaction.emoji.name == emoji)
            {
                reaction.message.guild.members.cache.get(user.id).send("You have registered for the quiz!");
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("Leaderboard");
                    var myquery = { id : message.author.id};
                    var obj = {id : message.author.id, points : 0, answered : 0};
                    dbo.collection("Points").find(myquery).toArray(function(err, result) {
                        if(err) throw err;
                        if(result.length == 0)
                        {
                            dbo.collection("Points").insertOne(obj, function(err, res){
                                if (err) throw err;
                            });
                        }
                    });
                  });
            }
        });

        client.on('messageReactionRemove', async (reaction, user) => {
            if(reaction.message.partial) await reaction.message.fetch();
            if(reaction.partial) await reaction.fetch();
            if(user.bot) return;
            if(reaction.emoji.name == emoji)
            {
                reaction.message.guild.members.cache.get(user.id).send("You have unregistered for the quiz!");
                MongoClient.connect(url, function(err, db) {
                    if (err) throw err;
                    var dbo = db.db("Leaderboard");
                    var obj = { id: user.id };
                    dbo.collection("Points").deleteOne(obj, function(err, res) {
                      if (err) throw err;
                      console.log(user.id + " deleted");
                      db.close();
                    });
                  })
            }
        });
    } 
}