const Discord = require('discord.js');
const MongoClient = require('mongodb').MongoClient;
const mongo_url = "mongodb://localhost:27017/Leaderboard";
const url = "mongodb://localhost:27017/";

// quizzer = 785928731037794375
//quizmaster = 755106658371371069
//admin = 789382345110454272

var qn, img;
let ans = new String();

MongoClient.connect(mongo_url, function(err, db) {
    if (err) throw err;
    console.log("Database created");
    db.close();
});

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("Leaderboard");
    dbo.collection("Points").deleteMany({}, function(err, obj) {
      if (err) throw err;
      db.close();
    });
});

const client = new Discord.Client({partials: ["MESSAGE", "CHANNEL", "REACTION"]});

const prefix = '$';

const fs = require('fs');

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

for(const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', () => {
    console.log('QuizzerBot is online')
});

client.on('message', message =>{
    if(!message.content.startsWith(prefix) || message.author.bot) return;

    var args = message.content.slice(prefix.length).split(/ +/);
    var command = args.shift().toLowerCase();
    
    if(command === 'a')
    {
        client.commands.get('answering').execute(message, args, ans);
    }

    if(command === 'q' && message.member.roles.cache.has('789382345110454272'))
    {
        var data = fs.readFileSync('Questions.txt', 'utf8');
        var s = data.toString().split('\n');
        for(i = 0; i < s.length; i++)
        {
            if(s[i].trim() == args[0].trim())
            {
                qn = s[i+1];
                ans = s[i+2];
                img = s[i+3];
                break;
            }
        }
        client.commands.get('question').execute(message, args, qn, img, Discord);
    }

    if(command == 'start' && message.member.roles.cache.has('789382345110454272'))
    {
        client.commands.get('reactionrole').execute(message, Discord, client);
    }

    if(command == 'end' && message.member.roles.cache.has('789382345110454272'))
    {
        client.commands.get('ending').execute(message, Discord, client);
    }
});

client.login('Nzg1OTM0MjE0OTQ3OTMwMTcy.X8_ERg.D2Jnq8MkSACt0WBzqlhl_ZQkdyQ');