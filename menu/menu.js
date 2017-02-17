/**
 * Содержит разметки клавиатур
 * @type {object}
 */
var keyboards = require('./keyboards.js');
var User = require('../user/user.js');
User = new User();
var bot2;
/**
 * Создаёт экземпляр класса Menu
 *
 * @this {Menu}
 * @constructor
 */
var Schedule = require('../schedule/schedule.js');
function Menu(bot) {
  this.bot = bot;
  this.Schedule = new Schedule();
  bot2 = bot;

}


//TODO: сделать подгрузку из БД
/**
 * Пользовательские настройки
 * @type {object}
 */



Menu.prototype.showStartMenu = function (msg) {
  this.bot.sendMessage(msg.from.id,'Преветствую тебя, '+msg.chat.first_name+'!'+
  ' Я бот, который упростит твою жизнь с расписанием в самом неклассическом университете' +
    'по следующим командам я могу тебе помочь: *тута команды типа будут*');

  User.getOptions(msg.from.id, function (userOptions) {
  });
};




Menu.prototype.sendSchedule = sendSchedule;
  function sendSchedule(schedule, chatID) {
  var options = {
    parse_mode: "HTML"
  };
  for(var i = 0, len = schedule.length; i < len; i++){
    bot2.sendMessage(chatID, schedule[i], options);
  }
}

/**
 * Показать главное меню
 *
 * @param {string} msg
 */
Menu.prototype.showHelloMenu = function (msg) {
  this.bot.sendMessage(msg.chat.id, 'Выберите, что вы хотите сделать', keyboards.keyboardHelloMenu);
};

//TODO: заменить if на switch, наверное
/**
 * Обработчик событий callbackQuery
 *
 * @param {object} callbackQuery
 */
Menu.prototype.callbackQueryHandler = function(callbackQuery) {
  var userOptions = {
    userID: callbackQuery.from.id
  };
  /**
   * Условия главного меню и переходы в подменю
   */
  if (callbackQuery.data == 'settings') {
    //console.log(callbackQuery);
    this.bot.editMessageText('Настройки профиля', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardSettings.reply_markup
    });
  }

  if (callbackQuery.data == 'groupSchedule'){
    this.bot.editMessageText('Выбери на какой день тебе показать расписание', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardDayOfWeek.reply_markup
    });
  }

  if (callbackQuery.data == 'teacherSchedule'){
    this.bot.answerCallbackQuery(callbackQuery.id,'🛠В процессе разработки🛠',true);
  }

  /**
   * Подменю вывода расписания своей группы
   */



  if ((callbackQuery.data >= 1 && callbackQuery.data <= 6)||(callbackQuery.data.split('_')[0] == 'allDay')) {
    if (callbackQuery.data.split('_')[0] == 'allDay') {
      this.DAY = callbackQuery.data.split('_')[1];
    }else {
      this.DAY = callbackQuery.data;
    }
      this.bot.editMessageText('Рапсисание четной или нечетной недели тебе показать?',{
        'chat_id': callbackQuery.from.id,
        'message_id': callbackQuery.message.message_id,
        'reply_markup': keyboards.keyboardOddOrEven.reply_markup
      });
  }


  if ((callbackQuery.data.split('_')[0] == 'odd')||(callbackQuery.data.split('_')[0] == 'even')){
    WEEK = callbackQuery.data;
    this.Schedule.Group('P3217').getSchedule(this.DAY,callbackQuery.data.split('_')[1],function (schedule) {
      sendSchedule(schedule, callbackQuery.from.id);
    }, true);

  }

  /**
   * Условия подменю "Настройки профиля" и его подменю
   */
  if (callbackQuery.data == 'settingsBack'){
    this.bot.editMessageText('Выберите что вы хотите сделать', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardHelloMenu.reply_markup
    });
  }


  if (callbackQuery.data == 'userGroup'){
    var options = {
      reply_markup: JSON.stringify({
        keyboard: [
          [{ text: 'Обновить мою группу'},{text: 'Отмена'}]
        ]
      })
    };

    this.bot.editMessageText('Выбери что ты хочешь сделать', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id
    },options);


//TODO: доеделать функционал для изменения группы пользователя

  }


  if (callbackQuery.data == 'notificationDay'){
    //TODO: user.getOptions(callback.from.id, function(){})

    userOptions.notificationDay = !userOptions.notificationDay; //TODO: отправлять изменения сразу на сервер

    this.bot.answerCallbackQuery(callbackQuery.id,'✔Уведомления о расписании на день '
      + ((userOptions.notificationDay==true)?'включены':'выключены'),false);

    if (userOptions.notificationDay == true) {
      this.bot.editMessageText('Хотите выполнить настройку уведомлений сейчас?' +
        '(Если нажмете нет, то они автоматически отключатся)',
        {
        'chat_id': callbackQuery.from.id,
        'message_id': callbackQuery.message.message_id,
        'reply_markup': keyboards.keyboardYesOrNo.reply_markup
      });
    }
  }

  if (callbackQuery.data == 'notificationLesson') {
    userOptions.notificationNextLesson = !userOptions.notificationNextLesson;
    //TODO: изменение каждой клавиши на другой смайл при изменение.
    this.bot.answerCallbackQuery(callbackQuery.id, '✔Уведомления о следующей паре ' +
      ((userOptions.notificationNextLesson == true) ? 'включены' : 'выключены'), false);
  }

  /**
   * Подменю выбора ДА или НЕТ
   */
  if (callbackQuery.data == 'yes'){
    this.bot.editMessageText('Выберите удобное для Вас время, когда будет приходить' +
      ' расписание на следующий день. При нажатии на кнопку "Отмена", уведомления о' +
      ' расписании на следующий день будут выключены.',
      {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardNotificationTime.reply_markup
    });
  }

  if (callbackQuery.data == 'no'){
    userOptions.notificationDay = false;
    this.bot.editMessageText('Настройки профиля', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardSettings.reply_markup
    });
  }

  /**
   * Подменю настройки уведомлений о расписании на следующий день
   */
  if (callbackQuery.data == 'morning'){
    this.bot.editMessageText('Выберите время', {
     'chat_id': callbackQuery.from.id,
     'message_id': callbackQuery.message.message_id,
     'reply_markup': keyboards.keyboardChooseTimeMorning.reply_markup
    });
  }

  if (callbackQuery.data == 'lunch'){
   this.bot.editMessageText('Выберите время', {
     'chat_id': callbackQuery.from.id,
     'message_id': callbackQuery.message.message_id,
     'reply_markup': keyboards.keyboardChooseTimeLunch.reply_markup
   });
  }

  if (callbackQuery.data == 'evening'){

    this.bot.editMessageText('Выберите время', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardChooseTimeEvening.reply_markup
    });
  }

  if (callbackQuery.data == 'backChooseTime'){
    this.bot.editMessageText('Выберите удобное для Вас время, когда будет приходить ' +
      'расписание на следующий день. При нажатии на кнопку "Отмена", уведомления о ' +
      'расписании на следующий день будут выключены.',
      {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardNotificationTime.reply_markup
    });
  }

  /*
  Обработка выбранного времени для уведомлений пользователем
   */
  if (callbackQuery.data.split('_')[0] == 'Time' ){
    userOptions.notificationTime = callbackQuery.data.split('_')[1];
    this.bot.answerCallbackQuery(callbackQuery.id, 'Расписание будет Вам приходить в '
      +userOptions.notificationTime, false);

    this.bot.editMessageText('Настройки профиля', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardSettings.reply_markup
    });
  }
};

module.exports = Menu;