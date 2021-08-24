const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

module.exports = {
    name: 'question',
    description : '',
    execute(message, args, qn, img, Discord){
        const newEmbed = new Discord.MessageEmbed()
        .setColor('#66bbff')
        .setTitle('Question ' + args[0])
        .setDescription(qn)
        .setImage(img)
        .setFooter("DM your answer to this bot. Prefix your answers with $a. For example if the answer is Delhi type $a Delhi.")
        var channellog = message.client.channels.cache.get('');
        channellog.send(newEmbed);
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("Leaderboard");
            var newvalues = { $set: { answered : 0} };
            dbo.collection("Points").updateMany({}, newvalues, function(err, res) {
              if (err) throw err;
              db.close();
            });
          });
    }
}