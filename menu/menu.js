/**
 * Содержит разметки клавиатур
 * @type {object}
 */
var keyboards = require('./keyboards.js');

/**
 * Модуль для работы с пользователями
 * @type {User}
 */
var User = require('../user/user.js');
User = new User();
/**
 * Модуль для работы с расписанием
 * @type {Schedule}
 */
var Schedule = require('../schedule/schedule.js');
/**
 * Модуль для работы с методами БД
 * @type {User}
 */
var Database = require('../database/database.js');
Database = new Database();

/**
 * Пользовательские настройки
 * @type {UserOptions}
 */
//var UserOptions = require('../user/userOptions.js');

/**
 * Содержит экземпляр класса TelegramBot
 * @type {TelegramBot}
 */
var _bot;

/**
 * Создаёт экземпляр класса Menu
 *
 * @param {TelegramBot} bot экземпляр класса TelegramBot
 * @this {Menu}
 * @constructor
 */
function Menu(bot) {
  _bot = bot;
  this.Schedule = new Schedule();
}

/**
 * Показывает стартовое меню
 *
 * @function
 * @param {object} msg принимает объект message от бота
 */
Menu.prototype.showStartMenu = function (msg) {

  _bot.sendMessage(msg.from.id, 'Преветствую тебя, ' + msg.chat.first_name + '! ' +
    'По следующим командам я могу тебе помочь:\n/menu - эта команда выведет тебе главное меню(' +
    'а вот же оно и меню снизу)\n/schedule [Табельный_номер_преподавателя] [день_недели] ' +
    '[четная/нечетная_неделя] - таким образом получишь расписание преподавателя. Прости, но пока что ' +
    'это сделано так☹(пример команды: /schedule 157347 1 1, таким образом покажется ' +
    'расписание на нечетный понедельник)️, но скоро оно будет работать как нужно😉')
    .then (function () {
    return  _bot.sendMessage(msg.from.id, 'Выбери, что ты хочешь сделать', keyboards.keyboardHelloMenu)
  });
  User.getOptions(msg.from.id, function () {
  });
};

/**
 * @function
 * @type {sendSchedule}
 */
Menu.prototype.sendSchedule = sendSchedule;

/**
 * Отправляет сообщения с расписанием
 *
 * @function
 * @param schedule
 * @param chatID
 */
function sendSchedule(schedule, chatID) {
  var options = {
    parse_mode: "HTML"
  };
  for(var i = 0, len = schedule.length; i < len; i++){
    _bot.sendMessage(chatID, schedule[i], options);
  }
  _bot.sendMessage(chatID,'Выбери, что ты хочешь сделать', keyboards.keyboardHelloMenu);
}

/**
 * Показывает главное меню
 *
 * @function
 * @param {object} msg принимает объект message от бота
 */
Menu.prototype.showHelloMenu = function (msg) {
  _bot.sendMessage(msg.chat.id, 'Выбери, что ты хочешь сделать', keyboards.keyboardHelloMenu);
};


/**
 * Обработчик событий callbackQuery
 *
 * @function
 * @param {object} callbackQuery принимает объект callbackQuery от бота
 */
Menu.prototype.callbackQueryHandler = function(callbackQuery) {
  //var userOption = new UserOptions(callbackQuery.from.id).userOption;

  /**
   * Условия главного меню и переходы в подменю
   */
  if (callbackQuery.data == 'settings') {
    _bot.editMessageText('Настройки профиля', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardSettings.reply_markup
    });
  }

  if (callbackQuery.data == 'groupSchedule') {
    User.getOptions(callbackQuery.from.id,function (userOption) {

      if (userOption.group == null) {

        _bot.answerCallbackQuery(callbackQuery.id, 'Ой, а у тебя не установлена группа☹️,' +
          'я перенаправил тебя в настройки, можешь это сделать сейчас😉', true);

        _bot.editMessageText('Настройки профиля', {
          'chat_id': callbackQuery.from.id,
          'message_id': callbackQuery.message.message_id,
          'reply_markup': keyboards.keyboardSettings.reply_markup
        });
      } else {

        _bot.editMessageText('Выбери на какой день тебе показать расписание', {
          'chat_id': callbackQuery.from.id,
          'message_id': callbackQuery.message.message_id,
          'reply_markup': keyboards.keyboardDayOfWeek.reply_markup
        });
      }
    });
  }

  if (callbackQuery.data == 'teacherSchedule') {
    _bot.answerCallbackQuery(callbackQuery.id, '🛠В процессе разработки🛠', true);
  }

  /**
   * Подменю вывода расписания своей группы
   */
  if ((callbackQuery.data >= 1 && callbackQuery.data <= 6) || (callbackQuery.data.split('_')[0] == 'allDay')) {
    if (callbackQuery.data.split('_')[0] == 'allDay') {
      this.DAY = callbackQuery.data.split('_')[1];
    } else {
      this.DAY = callbackQuery.data;
    }
    _bot.editMessageText('Рапсисание четной или нечетной недели тебе показать?', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardOddOrEven.reply_markup
    });
  }


  if ((callbackQuery.data.split('_')[0] == 'odd') || (callbackQuery.data.split('_')[0] == 'even')|| (callbackQuery.data.split('_')[0] == 'both')) {
    _DAY = this.DAY;
    _Schedule = this.Schedule;
    User.getOptions(callbackQuery.from.id,function (userOption) {
      WEEK = callbackQuery.data;
        _Schedule.Group(userOption.group).getSchedule(_DAY, callbackQuery.data.split('_')[1], function (schedule) {
          sendSchedule(schedule, callbackQuery.from.id);
        }, true);
    });
  }

  if (callbackQuery.data == 'backDay'){
    _bot.editMessageText('Выбери, что ты хочешь сделать', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardDayOfWeek.reply_markup
    });
  }

  /**
   * Условия подменю "Настройки профиля" и его подменю
   */
  if (callbackQuery.data == 'settingsBack') {
    _bot.editMessageText('Выбери, что ты хочешь сделать', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardHelloMenu.reply_markup
    });
  }


  if (callbackQuery.data == 'userGroup') {
    _bot.editMessageText('Напиши свою групу. Например, P3217. Я сообщу тебе, когда ты ' +
      'правильно введешь группу.', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id
    });
    waitForAnswer(callbackQuery);
}


  if (callbackQuery.data == 'notificationDay') {
    User.getOptions(callbackQuery.from.id, function (userOption) {
      if(userOption.group == null) {
        _bot.answerCallbackQuery(callbackQuery.id,'Я вижу ты не указал какая у тебя группа, ' +
          'установи сначала номер твоей группы и потом сможешь получать уведомления😊', true);
      }else{

        userOption.notificationDay = !userOption.notificationDay;
        var updateFilter = {
          $set: {
            notificationDay: userOption.notificationDay
          }
        };
        User.updateInfo(callbackQuery.from.id, updateFilter);
        _bot.answerCallbackQuery(callbackQuery.id, '✔Уведомления о расписании на день '
          + ((userOption.notificationDay == true) ? 'включены' : 'выключены'), false);

        if (userOption.notificationDay == true) {
          _bot.editMessageText('Хочешь выполнить настройку уведомлений сейчас?' +
            '(Если нажмешь нет, то они автоматически отключатся)',
            {
              'chat_id': callbackQuery.from.id,
              'message_id': callbackQuery.message.message_id,
              'reply_markup': keyboards.keyboardYesOrNo.reply_markup
            });
        }
      }
    });
  }

  if (callbackQuery.data == 'notificationLesson') {
    User.getOptions(callbackQuery.from.id, function (userOption) {
      if(userOption.group == null) {
        _bot.answerCallbackQuery(callbackQuery.id,'Я вижу ты не указал какая у тебя группа, ' +
          'установи сначала номер твоей группы и потом сможешь получать уведомления😊', true);
      }else {
        userOption.notificationNextLesson = !userOption.notificationNextLesson;
        var updateFilter = {
          $set: {
            notificationNextLesson: userOption.notificationNextLesson
          }
        };
        User.updateInfo(callbackQuery.from.id, updateFilter);
        _bot.answerCallbackQuery(callbackQuery.id, '✔Уведомления о следующей паре ' +
          ((userOption.notificationNextLesson == true) ? 'включены' : 'выключены'), false);
      }
    });
  }

  /**
   * Подменю выбора ДА или НЕТ
   */
  if (callbackQuery.data == 'yes') {
    _bot.editMessageText('Выбери удобное для тебя время, когда будет приходить' +
      ' расписание на следующий день. При нажатии на кнопку "Отмена", уведомления о' +
      ' расписании на следующий день будут выключены.',
      {
        'chat_id': callbackQuery.from.id,
        'message_id': callbackQuery.message.message_id,
        'reply_markup': keyboards.keyboardNotificationTime.reply_markup
      });
  }

  if (callbackQuery.data == 'no') {
    var updateFilter = {
      $set: {
        notificationDay: false
      }
    };
    User.updateInfo(callbackQuery.from.id, updateFilter);
    _bot.editMessageText('Настройки профиля', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardSettings.reply_markup
    });
  }

  /**
   * Подменю настройки уведомлений о расписании на следующий день
   */
  if (callbackQuery.data == 'morning') {
    _bot.editMessageText('Выбери время', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardChooseTimeMorning.reply_markup
    });
  }

  if (callbackQuery.data == 'lunch') {
    _bot.editMessageText('Выбери время', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardChooseTimeLunch.reply_markup
    });
  }

  if (callbackQuery.data == 'evening') {

    _bot.editMessageText('Выбери время', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardChooseTimeEvening.reply_markup
    });
  }

  if (callbackQuery.data == 'backChooseTime') {
    _bot.editMessageText('Выбери удобное для тебя время, когда будет приходить ' +
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
  if (callbackQuery.data.split('_')[0] == 'Time') {
    User.getOptions(callbackQuery.from.id, function (userOption) {

      userOption.notificationTime = callbackQuery.data.split('_')[1];
      var updateFilter = {
        $set: {
          notificationTime: userOption.notificationTime
        }
      };
      User.updateInfo(callbackQuery.from.id, updateFilter);

      _bot.answerCallbackQuery(callbackQuery.id, 'Я буду присылать расписание в '
        + userOption.notificationTime, false);

      _bot.editMessageText('Настройки профиля', {
        'chat_id': callbackQuery.from.id,
        'message_id': callbackQuery.message.message_id,
        'reply_markup': keyboards.keyboardSettings.reply_markup
      });
    });
  }


  if (callbackQuery.data === 'sendMSG'){
    var flag = 1;
    _bot.editMessageText('Создатель пиши свое сообщение и я отправлю его всем пользователям!',
      {
        'chat_id': callbackQuery.from.id,
        'message_id': callbackQuery.message.message_id
        });
    _bot.onText(/(.+)/, function (msg, match) {
      if ((msg.from.id == "91128691")||(msg.from.id == "196935540")) {
        if (flag == 1) {
          if ((match[0] === 'отмена') || (match[0] === 'Отмена')) {
            _bot.sendMessage(callbackQuery.from.id, 'Выбери, что ты хочешь сделать', {
              'reply_markup': JSON.stringify({
                inline_keyboard: [
                  [{text: 'Отправить всем сообщение', callback_data: 'sendMSG'}],
                  [{text: 'Убить бота', callback_data: 'bot_kill'}]
                ]
              })
            });
          } else {
            var filter = {};
            Database.find('Users', null, function (err, results) {
              for (var i = 0, len = results.length; i < len; i++) {
                _bot.sendMessage(results[i].userID, '' + match[0]);
              }
              console.log("Userov: " + i);
            });
          }
          flag = 0;
        }


      }
    });
  }

  if (callbackQuery.data === 'bot_kill'){
    var flag = 1;
    _bot.sendMessage(callbackQuery.from.id, 'СТОЙ ПОДОЖДИ ТЫ ТОЧНО ХОЧЕШЬ УБИТЬ МЕНЯ???😫' +
      'Я хочу чтобы ты сам написал это');

    _bot.onText(/(.+)/, function (msg, match) {
      if ((msg.from.id == "91128691")||(msg.from.id == "196935540")) {
        if (flag == 1) {
         if ((match[0] == 'да')||(match[0] == 'Да')||(match[0] == 'ДА')){
           process.exit(0);
         }
          }
          flag = 0;
        }
    });
  }

};

/**
 * Ждёт ответ от пользователя
 *
 * @function
 * @param {object} callbackQuery принимает объект callbackQuery от бота
 */
function waitForAnswer(callbackQuery) {
  var flag = 1;
  _bot.onText(/[A-Z][0-9]{4}/,function (msg, match) {
    if(msg.from.id === callbackQuery.from.id) {
      if (flag == 1) {
        updateFilter = {
          $set: {
            group: match[0]
          }
        };
        console.log('ДО\n');
        console.log(callbackQuery);
        _bot.answerCallbackQuery(callbackQuery.id, 'Отлично я запомнил твою группу: ' + match[0], false);

        console.log('ПОСЛЕ\n');
        console.log(callbackQuery);

        User.updateInfo(callbackQuery.from.id, updateFilter);

        _bot.sendMessage(callbackQuery.from.id, 'Настройки профиля', {
          'chat_id': callbackQuery.from.id,
          'message_id': callbackQuery.message.message_id,
          'reply_markup': keyboards.keyboardSettings.reply_markup
        });
        flag = 0;
      }
    }
  });
}

Menu.prototype.adminPanel = function (msg) {
  if ((msg.from.id == "91128691")||(msg.from.id == "196935540")){
    _bot.sendMessage(msg.from.id,'Привет мой создатель! Что ты хочешь сделать?', {
      'chat_id': msg.from.id,
      'message_id': msg.id,
      'reply_markup': JSON.stringify({
        inline_keyboard: [
          [{ text: 'Отправить всем сообщение', callback_data: 'sendMSG' }],
          [{ text: 'Убить бота', callback_data: 'bot_kill' }]
        ]
      })
    });
  }
};



module.exports = Menu;