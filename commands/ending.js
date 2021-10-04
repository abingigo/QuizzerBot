const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://localhost:27017/";

module.exports = {
    name : 'ending',
    description : '',
    async execute(message, Discord, client){
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db("Leaderboard");
          var mysort = { points: 1 };
          dbo.collection("Points").find().sort(mysort).toArray(function(err, result) {
            if (err) throw err;
            var j = 0;
            var a = '';
            for(var i = 1; i <= 3 && j < result.length && i <= result.length;)
            {
              a += `${i}` + '. <@' + `${result[j].id}` +'>';
              while(j < result.length && result[j].points == result[j+1].points)
              {
                a += '\n   <@' + `${result[j+1].id}` +'>';
                j = j + 1;
              }
              i = i + 1;
              j = j + 1;
              if(i >= result.length)
                break;
              a += '\n';
            }
            let embed = new Discord.MessageEmbed()
              .setColor('#e42643')
              .setTitle('Quiz Results')
              .setDescription(a);
            var channellog = message.client.channels.cache.get('818495801658441749');
            channellog.send(embed);
            db.close();
          });
        });
    } 
}