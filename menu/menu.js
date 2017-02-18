/**
 * Содержит разметки клавиатур
 * @type {object}
 */
var keyboards = require('./keyboards.js');

/**
 *
 * @type {User}
 */
var User = require('../user/user.js');
User = new User();


var _bot;
/**
 * Создаёт экземпляр класса Menu
 *
 * @this {Menu}
 * @constructor
 */
function Menu(bot) {
  _bot = bot;
  this.Schedule = new Schedule();
}

/**
 *
 * @type {Schedule}
 */
var Schedule = require('../schedule/schedule.js');

//var UserOptions = require('../user/userOptions.js');


//TODO: сделать подгрузку из БД
/**
 * Пользовательские настройки
 * @type {object}
 */



Menu.prototype.showStartMenu = function (msg) {
  _bot.sendMessage(msg.from.id,'Преветствую тебя, '+msg.chat.first_name+'!'+
  ' Я бот, который упростит твою жизнь с расписанием в самом неклассическом университете' +
    'по следующим командам я могу тебе помочь: *тута команды типа будут*');
};

Menu.prototype.sendSchedule = sendSchedule;
  function sendSchedule(schedule, chatID) {
  var options = {
    parse_mode: "HTML"
  };
  for(var i = 0, len = schedule.length; i < len; i++){
    _bot.sendMessage(chatID, schedule[i], options);
  }
  _bot.sendMessage(chatID,'Выберите, что вы хотите сделать', keyboards.keyboardHelloMenu);
}

/**
 * Показать главное меню
 *
 * @param {string} msg
 */
Menu.prototype.showHelloMenu = function (msg) {
  _bot.sendMessage(msg.chat.id, 'Выберите, что вы хотите сделать', keyboards.keyboardHelloMenu);
};


//TODO: заменить if на switch, наверное
/**
 * Обработчик событий callbackQuery
 *
 * @param {object} callbackQuery
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


  if ((callbackQuery.data.split('_')[0] == 'odd') || (callbackQuery.data.split('_')[0] == 'even')) {
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
    _bot.editMessageText('Выберите что вы хотите сделать', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardDayOfWeek.reply_markup
    });
  }

  /**
   * Условия подменю "Настройки профиля" и его подменю
   */
  if (callbackQuery.data == 'settingsBack') {
    _bot.editMessageText('Выберите что вы хотите сделать', {
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
        _bot.editMessageText('Хотите выполнить настройку уведомлений сейчас?' +
          '(Если нажмете нет, то они автоматически отключатся)',
          {
            'chat_id': callbackQuery.from.id,
            'message_id': callbackQuery.message.message_id,
            'reply_markup': keyboards.keyboardYesOrNo.reply_markup
          });
      }
    });
  }

  if (callbackQuery.data == 'notificationLesson') {
    User.getOptions(callbackQuery.from.id, function (userOption) {
      userOption.notificationNextLesson = !userOption.notificationNextLesson;
      var updateFilter = {
        $set: {
          notificationNextLesson: userOption.notificationNextLesson
        }
      };
      User.updateInfo(callbackQuery.from.id, updateFilter);
      //TODO: изменение каждой клавиши на другой смайл при изменение.
      _bot.answerCallbackQuery(callbackQuery.id, '✔Уведомления о следующей паре ' +
        ((userOption.notificationNextLesson == true) ? 'включены' : 'выключены'), false);
    });
    return;
  }

  /**
   * Подменю выбора ДА или НЕТ
   */
  if (callbackQuery.data == 'yes') {
    _bot.editMessageText('Выберите удобное для Вас время, когда будет приходить' +
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
    _bot.editMessageText('Выберите время', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardChooseTimeMorning.reply_markup
    });
  }

  if (callbackQuery.data == 'lunch') {
    _bot.editMessageText('Выберите время', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardChooseTimeLunch.reply_markup
    });
  }

  if (callbackQuery.data == 'evening') {

    _bot.editMessageText('Выберите время', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardChooseTimeEvening.reply_markup
    });
  }

  if (callbackQuery.data == 'backChooseTime') {
    _bot.editMessageText('Выберите удобное для Вас время, когда будет приходить ' +
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

      _bot.answerCallbackQuery(callbackQuery.id, 'Расписание будет Вам приходить в '
        + userOption.notificationTime, false);

      _bot.editMessageText('Настройки профиля', {
        'chat_id': callbackQuery.from.id,
        'message_id': callbackQuery.message.message_id,
        'reply_markup': keyboards.keyboardSettings.reply_markup
      });
    });
  }
};

module.exports = Menu;

function waitForAnswer(callbackQuery) {
  _bot.onText(/[A-Z][0-9]{4}/,function (msg, match) {
    if(msg.from.id === callbackQuery.from.id){
      updateFilter = {
        $set: {
          group: match[0]
        }
      };
      console.log('ДО\n');
      console.log(callbackQuery);
       _bot.answerCallbackQuery(callbackQuery.id,'Отлично я запомнил твою группу: '+match[0],false);

       console.log('ПОСЛЕ\n');
      console.log(callbackQuery);

       User.updateInfo(callbackQuery.from.id, updateFilter);

      _bot.sendMessage(callbackQuery.from.id,'Настройки профиля', {
        'chat_id': callbackQuery.from.id,
        'message_id': callbackQuery.message.message_id,
        'reply_markup': keyboards.keyboardSettings.reply_markup
      });
    }

  });
}