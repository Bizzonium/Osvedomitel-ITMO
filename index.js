var bot = require('./telegrambot/telegramBot.js');

/**
* Модуль для работы с расписанием
* @type {object}
*/
var user = require('./user/user.js');
var user = new user();
var Schedule = require('./schedule/schedule.js');
var Schedule = new Schedule();

/**
 * Содержит экземпляр объекта модуля Menu
 * @type {Menu}
 */
var Menu = require('./menu/menu.js');
var Menu = new Menu(bot);
bot.getMe().then(function (me) {
  console.log('Hi my name is %s! And i am running ✔️', me.username);
});

bot.onText(/\/start/, function(msg){
  Menu.showStartMenu(msg);
});

/**
 * Тестовая команда для проверки работы модуля расписаний
 */
bot.onText(/\/schedule ([A-Z][0-9]{4}) ([0-8]) ([0-2])/, function(msg, match){
  var options = {
    parse_mode: "HTML"
  };

  var weekDay;
  if(match[2] == 8){
    weekDay = Schedule.WEEK_DAY.TOMORROW;
  }else{
    weekDay = match[2];
  }
  var weekParity = match[3];

  Schedule.Group(match[1]).getSchedule(weekDay, weekParity, function (schedule) {
    //processing and output
    for(var i = 0, len = schedule.length; i < len; i++){
      bot.sendMessage(msg.from.id, schedule[i], options);
    }
  }, true);

});

bot.onText(/\/schedule ([0-9]{1,10}) ([0-8]) ([0-2])/, function(msg, match){
  var options = {
    parse_mode: "HTML"
  };

  var weekDay;
  if(match[2] == 8){
    weekDay = Schedule.WEEK_DAY.TOMORROW;
  }else{
    weekDay = match[2];
  }
  var weekParity = match[3];

  Schedule.Teacher(match[1]).getSchedule(weekDay, weekParity, function (schedule) {
    //processing and output
    for(var i = 0, len = schedule.length; i < len; i++){
      bot.sendMessage(msg.from.id, schedule[i], options);
    }
  }, true);

});

bot.onText(/\/menu/, function(msg){
  Menu.showHelloMenu(msg);
});

bot.on('callback_query', function(callbackQuery){
  Menu.callbackQueryHandler(callbackQuery);
});
