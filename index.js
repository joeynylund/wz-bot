const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();
const fetch = require('node-fetch');

client.once('ready', () => {
	console.log('Ready!!');
    client.user.setPresence({
        status: 'online',
        activity: {
            name: "!wz help",
            type: "PLAYING"
        }
    }); 
});

client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

    if (message.channel.id === '867161618936889354' || message.channel.id === '803385881901662278') {
        if (command === 'wz') {
            if (!args.length) {
                return message.channel.send(`Provide your platform and username to get stats, use !wz help to see how to use this bot ${message.author}!`);
            }
    
            if (`${args[0]}` === 'help') {
                message.channel.send('!wz platform(pc,xbl,psn) username(if you play on pc include the #12345)');
                message.channel.send('Also make sure your account is set to public https://www.dexerto.com/call-of-duty/how-to-make-call-of-duty-stats-public-warzone-black-ops-cold-war-1495112/');
                return ;    
            }
    
            if (args.length === 1) {
                return message.channel.send(`Provide both your platform and username, use !wz help to see how to use this bot ${message.author}!`);
            }
    
            var firstArg = `${args[0]}`;
            var secondArg = `${args[1]}`;
            var platform = firstArg;
            var userName = secondArg;
    
            if(firstArg === 'pc') {
                platform = 'battle'
                userName = secondArg.replace('#','%23');
            }
    
            fetch('https://app.wzstats.gg/v2/player?username=' + userName + '&platform=' + platform)
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.status)
                }
                return res.json();
            })
            .then(data => {
                var br = data.data.lifetime.mode.br.properties;
                seconds = Number(br.timePlayed);
                var d = Math.floor(seconds / (3600*24));
                var h = Math.floor(seconds % (3600*24) / 3600);
                var m = Math.floor(seconds % 3600 / 60);
                var s = Math.floor(seconds % 60);
    
                var dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
                var hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
                var mDisplay = m > 0 ? m + (m == 1 ? " minute " : " minutes ") : "";
                var time = dDisplay + hDisplay + mDisplay;
                const exampleEmbed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('Warzone Stats')
                .addFields(
                    { name: 'Games Played', value: br.gamesPlayed, inline: true },
                    { name: 'Time Played', value: time, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                )
                .addFields(
                    { name: 'Total Kills', value: br.kills, inline: true },
                    { name: 'Total Deaths', value: br.deaths, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                )
                .addFields(
                    { name: 'K/D Ratio', value: br.kdRatio.toFixed(2), inline: true },
                    { name: 'Wins', value: br.wins, inline: true },
                    { name: '\u200B', value: '\u200B', inline: true },
                )
                .setTimestamp()
    
                message.channel.send(exampleEmbed);
            })
            .catch(err => {
                console.error(err)
                if(err.message === '403') {
                    return message.channel.send('Your account is set to private!')
                }
                if(err.message === '404') {
                    return message.channel.send('Your account is set to private, does not exist, or you used the wrong platform! If you are playing on PC be sure to include the #12345 in your name.')
                }
                message.channel.send('Error occured. Please try again or contact a discord mod for help!');
            })
    
            
        }
    } else {

    }

	
});

client.login(token);