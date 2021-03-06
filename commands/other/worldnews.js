const { Command } = require('discord.js-commando');
const { newsAPI } = require('../../config.json');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');

module.exports = class WorldNewsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'worldnews',
      aliases: ['globalnews'],
      memberName: 'worldnews',
      group: 'other',
      description: 'Отправляет последние 5 мировых новостей',
      throttling: {
        usages: 2,
        duration: 10
      }
    });
  }

  async run(message) {
    try {
      const response = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=reuters&pageSize=5&apiKey=${newsAPI}`
      );
      const json = await response.json();
      let articleArr = json.articles;
      let processArticle = article => {
        let embed = new MessageEmbed()
          .setColor('#FF4F00')
          .setTitle(article.title)
          .setURL(article.url)
          .setAuthor(article.author)
          .setDescription(article.description)
          .setThumbnail(article.urlToImage)
          .setTimestamp(article.publishedAt)
          .setFooter('by NewsAPI.org');
        return embed;
      };
      async function processArray(array) {
        for (let article of array) {
          let msg = await processArticle(article);
          message.say(msg);
        }
      }
      await processArray(articleArr);
    } catch (err) {
      message.say('Что-то пошло не так :(');
      return console.error(err);
    }
  }
};