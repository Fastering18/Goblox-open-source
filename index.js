const discord = require('discord.js');
const calculator = require('mathjs');
const roblox = require("noblox.js");
const shortNumber = require("number-suffix")
const fetch = require("node-fetch")

const dotconfig = require("dotenv").config();
var configuration = require('./config.json');

const botToken = process.env.TOKEN;
const robloxToken = process.env.roblosecurity;

const OwnerId = configuration.bot.OwnerId
let botStatusDefault = configuration.bot.DefaultStatus || ["~"]
let prefix = configuration.bot.prefix || ["~"]

const mathKeamanan = ["import", "createUnit", "evaluate", "parse", "simplify", "derivative", ":", "eval"];
const presenceTypeRoblox = ["OFFLINE", "ONLINE", "IN GAME", "IN STUDIO"];
const devforumRole = ["Not a devforum member", "Devforum Member", "Devforum Regular", "Devforum Post Approval", "Devforum Community Sage/Leader"];
shortNumber.addStyle('officialSuffixes', ['k', 'M', 'B', 'T', 'Qd', 'Qn']);

const robloxInfoCooldown = {};
let countserver = client.guilds.cache.size;

const helpCategory = {
    roblox: {
        color: 0x0099ff,
        title: "Roblox list commands",
        timestamp: new Date(),
        description: "**Available commands**:\n\n~info `[roblox username]`\n~devforum `[roblox username]`\n~group `[group name]`\n~games\n~catalog `<asset name>`\n~verify `[username]`\n~unverify\n~myroblox\n~update\n\n**[] Required, <> Optional**",
    },
    math: {
        color: 0x0099ff,
        title: "Math commands list",
        timestamp: new Date(),
        description: "**Available commands**:\nAlways start with ~c `[math operation]`\n\n~c 5 + 5\n~c 5 - 5\n~c 5 * 5\n~c 5 / 5\n~c log(100,10)\n~c floor(0.25)\n~c 5!\n~c pi * 10 ^ 2\n\n**[] Required, <> Optional**",
    },
    mtk: helpCategory[math],
    fun: {
        color: 0x0099ff,
        title: "Fun command list",
        timestamp: new Date(),
        description: "**Available commands**:\n\n~say `[text]`\n~pfp `[mention]`\n~e dance\n~e dance2\n~e dance3\n~e wave\n~e rodab\n~how are you `<user>`\n~delete `<user>`\n~tags `<user>`\n~fakemessage `<user>` `[message]`\n~meme `<subreddit>`\n~8ball `[question]`\n\n**[] Required, <> Optional**",
    },
    other: {
        color: 0x0099ff,
        title: "Others list commands",
        timestamp: new Date(),
        description: "**Available commands**:\n\n~ping\n~bugreport `[incident]`\n~botinfo\n~donate\n~owner\n~uptime\n~vote\n~userinfo `<user>`\n~binary `[binary/text]`\n~search `[things to search]`\n~status `<user>`\n~translate `<to language>` `[text]`\n~wiki `[keyword]`\n~compile `[programming language]` `[script]`\n~supported country\n\n**[] Required, <> Optional**",
    },
    others: helpCategory[other]
}

function updateStatus(time) {
    setInterval(() => {
        countserver = client.guilds.cache.size;
        botStatus = `${prefix[0] || "~"}help | goblox.web.app`;
        if (countserver <= 0) {
            client.user.setPresence({ activity: { name: botStatusDefault }, status: "online" });
        } else {
            botStatus = `${prefix[0] || "~"}help | goblox.web.app`;
            client.user.setPresence({ activity: { name: botStatus }, status: "online" });
        }
   }, time);
}
String.prototype.startWithPrefix = function(prefixList) {
    return prefixList.findIndex((prefix) => { return this.startsWith(prefix)}, this)
}

client.on("ready", () => {
    console.log("Bot aktif");
    if (countserver === 0) {
        botStatus = "~help | bot maintenance";
        client.user.setPresence({ activity: { name: botStatus }, status: "online" });
    } else {
        client.user.setPresence({ activity: { name: botStatus }, status: "online" });
    }
    updateStatus(300000);
});

client.on("error", () => {
    botStatus = "~help | bot maintenance";
    client.user.setPresence({ activity: { name: botStatus }, status: "online" });
    console.log("bot error happened")
})

client.on("message", async message => {
    if (message.author.bot) return;
    const guild = message.guild;
    const pengirim = message.author;
    const pesan = message.content.slice()
    
    if (pesan.toLowerCase() === `<@!${client.user.id}>` || pesan === `<@${client.user.id}>`) {
        const embed = new discord.MessageEmbed()
            .setTitle(`Forgot my prefix ?`)
            .setDescription(`Current prefix: **${prefix.join(" | ")}**\n\n**Get Started**\nsay ${"`" + prefix[0] +"help`"} for help category.`)
            .setTimestamp()
            .setFooter(`${guild.name}'s server`)
            .setColor('WHITE');
        return message.channel.send(embed);
   }
   
   if (message.content.startWithPrefix(prefix) <= -1) return;
   
   const args = message.content
        .slice(prefix[0].length)
        .trim()
        .split(/ +/g);
    const command = args.shift().toLowerCase();
    
    if (command === "c" || command === "calculate") {
        let toCalculate = args.slice(0).join(" ");
        if (!toCalculate) {
            return message.channel.send("use format, `~math` for math commands list");
        }

        message.channel.send("calculating...").then(function (loading) {

            try {
                mathKeamanan.forEach(function (value) {
                    if (toCalculate.includes(value)) {
                        throw toCalculate
                    }
                });
            } catch (err) {
                return loading.edit("Failed to calculate, please use format, `~math` for math commands list");
            }

            const pool1 = workerpool.pool();
            var start = new Date()
            var hrstart = process.hrtime()
            let hasil = calculator.evaluate(toCalculate)
            if (hasil === "" || hasil.length >= 100) throw toCalculate;
                var end = new Date() - start,
                hrend = process.hrtime(hrstart)
                let Answer = new discord.MessageEmbed()
                   .setTitle(`Answer: ${hasil}`)
                   setDescription(`Took time: ${hrend[1] / 1000000}ms`);
                return loading.edit(Answer);
        }).catch(err => message.channel.send("Failed to calculate, please use format, `~math` for math commands list"));
        return;
    } else if (helpCategory[command] !== undefined) {
        return message.channel.send({ embed: helpCategory[command] });
    } else if (command === "help") {
        const specificHelp = args[0]
        if (!specificHelp) {
            const exampleEmbed = {
                color: 0x0099ff,
                title: "Daftar commands",
                description: "Commands categories,\ntype the following category command to get commands list",
                fields: [
                    {
                        name: "(1) Roblox Util",
                        value: "~roblox"
                    },
                    {
                        name: "(2) Math",
                        value: "~math"
                    },
                    {
                        name: "(5) Fun",
                        value: "~fun"
                    },
                    {
                        name: "(7) Others",
                        value: "~other\n\n[Support server](https://discord.gg/nCtKAWAWCb)  |  [Donate](https://www.paypal.com/paypalme/yanuarpriambudi)  |  [Roblox](https://www.roblox.com/users/467971019/profile)"
                    }
                ],
                timestamp: new Date(),

            };
            return message.channel.send({ embed: exampleEmbed });
        } else if (helpCategory[specificHelp]) {
            return message.channel.send({ embed: helpCategory[specificHelp] });
        } else {
            return message.channel.send(`No category for: ${"`" + specificHelp + "`"}`);
        };
    } else if (command === "info") {
        if (robloxInfoCooldown[message.author.id] && ((new Date().getTime() - robloxInfoCooldown[message.author.id]) <= 7000) && !OwnerId.includes(message.author.id)) return message.reply(`You can search another user **${(new Date().getTime() - robloxInfoCooldown[message.author.id]).toFixed(2)} seconds** later!`);
        let akun = args[0];
        if (!akun) {
            return message.channel.send("use format: `~info [Roblox username]`");
        }
        async function exec() {
            roblox.getIdFromUsername(akun).then(useriddd => {
                akun = useriddd
                getInfo()
            }).catch(err => {
                getInfo()
            });
            async function getInfo() {
                roblox
                    .getPlayerInfo(akun)
                    .then(async (playerInfo) => {
                        let PlayerStatus = playerInfo.status || "Empty"
                        let blurb = playerInfo.blurb || "Empty"
                        let joinDate = playerInfo.joinDate || "Unknown"
                        let age = playerInfo.age || "Unknown"
                        let RobloxName = playerInfo.username
                        let oldNames = playerInfo.oldNames
                        let followers = playerInfo.followerCount
                        if (typeof(followers) == "number" && followers >= 1099) followers = shortNumber.format(followers, { style: 'officialSuffixes' });
                        console.log(JSON.stringify(playerInfo))
                        joinDate = String(joinDate).replace("GMT+0000 (Coordinated Universal Time)", "")
                        if (playerInfo.isBanned == true) return message.channel.send(`The user ${RobloxName} is banned/deleted from Roblox.\nSorry the information not found!`);
                        let Information = [
                            {
                                name: "Status",
                                value: PlayerStatus.substring(0, 150),
                                inline: true
                            },
                            {
                                name: "Description",
                                value: blurb.substring(0, 300),
                                inline: true
                            },
                            {
                                name: "Followers",
                                value: followers
                            },
                            {
                                name: "Join Date",
                                value: joinDate
                            },
                            {
                                name: "Account Age in days",
                                value: age + " days"
                            },
                        ]
                        if (oldNames.length > 0) Information.push({ name: "Old Names", value: oldNames.join(", ").substring(0, 100) })
                        robloxInfoCooldown[message.author.id] = new Date().getTime()
                        
                        const infoEmbed = {
                            color: 0x0099ff,
                            title: "Roblox Profile",
                            url: "https://www.roblox.com/users/" + akun + "/profile",
                            author: {
                                name: "Account information"
                            },
                            description: RobloxName,
                            fields: Information,
                            thumbnail: {
                                url: `https://www.roblox.com/headshot-thumbnail/image?userId=${akun}&width=512&height=512&format=png`,
                            },
                            timestamp: new Date(),
                            footer: {
                                text: `Requested by ${message.author.username}#${message.author.discriminator}`,
                                icon_url: message.author.displayAvatarURL()
                            },
                       };
                       return message.channel.send({ embed: infoEmbed });
                   })
               }
         }
         exec();
    }
    // more commands is on working :p
});

client.login(botToken); //lol
