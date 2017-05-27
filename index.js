/**
 * Фреймворк для работы с Telegram API
 * @type {TelegramBot}
 */
var bot = require('./telegrambot/telegramBot.js');

/**
 * Модуль для работы с расписанием
 * @type {Schedule}
 */
var Schedule = require('./schedule/schedule.js');
Schedule = new Schedule();

/**
 * Модуль для работы с меню
 * @type {Menu}
 */
var Menu = require('./menu/menu.js');
Menu = new Menu(bot);

/**
 * Модуль для работы с уведомлениями
 * @type {Notification}
 */
var Notification = require('./notification/notification.js');
Notification = new Notification(bot);
Notification.run();

/**
 * Для отладки.
 */
bot.getMe().then(function (me) {
  console.log('Hi my name is %s! And i am running ✔️', me.username);
});

/**
 * Ожидает команду /start
 */
bot.onText(/\/start/, function(msg){
  Menu.showStartMenu(msg);
});

/**
 * Ожидает команду /schedule [groupName] [weekDay] [weekParity]
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

/**
 * Ожидает команду /schedule [teacherID] [weekDay] [weekParity]
 */
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

/**
 * Ожидает команду /menu
 */
bot.onText(/\/menu/, function(msg){
  Menu.showHelloMenu(msg);
});
bot.onText(/\/admin/, function(msg){
  Menu.adminPanel(msg);
});
bot.onText(/\/broadcast/, function(msg){
  Menu.broadcast(msg);
});
/**
 * Callback Query Handler
 */
bot.on('callback_query', function(callbackQuery){
  Menu.callbackQueryHandler(callbackQuery);
});

