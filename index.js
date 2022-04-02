const creds = require('./client_secret.json');
const data  = require('./private-data');
const { token, spreadsheetId, chatId } = JSON.parse((JSON.stringify(data)));

const { GoogleSpreadsheet } = require('google-spreadsheet');
const TelegramApi = require('node-telegram-bot-api');

const bot = new TelegramApi(token, { polling: true });

bot.setMyCommands([
  { command: '/start', description: 'Начальное приветствие' },
  { command: '/info',  description: 'Получить информацию о боте' },
  { command: '/name',  description: 'Узнать своё имя' },
]);

const start = () => {
  bot.on('message', async msg => {
    const text = String(msg.text).toLowerCase();
    const chatId = msg.chat.id;
    const userName = msg.from.username;

    if (text == '/start') {
      return bot.sendMessage(chatId, `Приветствую`);
    }
    if (text == '/info') {
      return bot.sendMessage(chatId, 'бот, просто бот');
    }
    if (text == '/name') {
      return bot.sendMessage(chatId, `Твоё имя: ${userName}`);
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю')
  })
};

let prevCount = -1;

const applicationGet = async () => {
  const doc = new GoogleSpreadsheet(spreadsheetId);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();

  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();

  let data = [];
  for (let row of rows) {
    const values = row._rawData;
    data.push(values);
  }
  const count = data.length;

  if (count !== prevCount) {
    console.log("Появились новые заявки");
    const applications = data.slice(prevCount);
    console.log(applications);

    for (let application of applications) {
      const [name, tel, description] = application;

      bot.sendMessage(chatId, `
        Заявка:
        Имя: ${name}
        Телефон: ${tel}
        Проблема: ${description}
      `)
      bot.sendMessage(chatId, tel)
    }
  }
  prevCount = count;
};

start();
setInterval(applicationGet, 3_000);