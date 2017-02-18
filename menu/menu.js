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
Menu.prototype.callbackQueryHandler = function(callbackQuery,userOption) {
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

  if (callbackQuery.data == 'groupSchedule'){
    _bot.editMessageText('Выбери на какой день тебе показать расписание', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardDayOfWeek.reply_markup
    });
  }

  if (callbackQuery.data == 'teacherSchedule'){
    _bot.answerCallbackQuery(callbackQuery.id,'🛠В процессе разработки🛠',true);
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
      _bot.editMessageText('Рапсисание четной или нечетной недели тебе показать?',{
        'chat_id': callbackQuery.from.id,
        'message_id': callbackQuery.message.message_id,
        'reply_markup': keyboards.keyboardOddOrEven.reply_markup
      });
  }


  if ((callbackQuery.data.split('_')[0] == 'odd')||(callbackQuery.data.split('_')[0] == 'even')){
    WEEK = callbackQuery.data;
    this.Schedule.Group(userOption.group).getSchedule(this.DAY,callbackQuery.data.split('_')[1],function (schedule) {
      sendSchedule(schedule, callbackQuery.from.id);
    }, true);

  }

  /**
   * Условия подменю "Настройки профиля" и его подменю
   */
  if (callbackQuery.data == 'settingsBack'){
    _bot.editMessageText('Выберите что вы хотите сделать', {
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
    _bot.editMessageText('Выбери что ты хочешь сделать', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id
    },options);
//TODO: доеделать функционал для изменения группы пользователя

  }


  if (callbackQuery.data == 'notificationDay'){
    //TODO: user.getOptions(callback.from.id, function(){})

    userOption.notificationDay = !userOption.notificationDay; //TODO: отправлять изменения сразу на сервер
    // User.updateInfo(userOption.userID, userOption);

    _bot.answerCallbackQuery(callbackQuery.id,'✔Уведомления о расписании на день '
      + ((userOption.notificationDay==true)?'включены':'выключены'),false);

    if (userOption.notificationDay == true) {
      _bot.editMessageText('Хотите выполнить настройку уведомлений сейчас?' +
        '(Если нажмете нет, то они автоматически отключатся)',
        {
        'chat_id': callbackQuery.from.id,
        'message_id': callbackQuery.message.message_id,
        'reply_markup': keyboards.keyboardYesOrNo.reply_markup
      });
    }
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
  if (callbackQuery.data == 'yes'){
    _bot.editMessageText('Выберите удобное для Вас время, когда будет приходить' +
      ' расписание на следующий день. При нажатии на кнопку "Отмена", уведомления о' +
      ' расписании на следующий день будут выключены.',
      {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardNotificationTime.reply_markup
    });
  }

  if (callbackQuery.data == 'no'){
    userOption.notificationDay = false;
    _bot.editMessageText('Настройки профиля', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardSettings.reply_markup
    });
  }

  /**
   * Подменю настройки уведомлений о расписании на следующий день
   */
  if (callbackQuery.data == 'morning'){
    _bot.editMessageText('Выберите время', {
     'chat_id': callbackQuery.from.id,
     'message_id': callbackQuery.message.message_id,
     'reply_markup': keyboards.keyboardChooseTimeMorning.reply_markup
    });
  }

  if (callbackQuery.data == 'lunch'){
   _bot.editMessageText('Выберите время', {
     'chat_id': callbackQuery.from.id,
     'message_id': callbackQuery.message.message_id,
     'reply_markup': keyboards.keyboardChooseTimeLunch.reply_markup
   });
  }

  if (callbackQuery.data == 'evening'){

    _bot.editMessageText('Выберите время', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardChooseTimeEvening.reply_markup
    });
  }

  if (callbackQuery.data == 'backChooseTime'){
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
  if (callbackQuery.data.split('_')[0] == 'Time' ){
    userOption.notificationTime = callbackQuery.data.split('_')[1];
    _bot.answerCallbackQuery(callbackQuery.id, 'Расписание будет Вам приходить в '
      +userOption.notificationTime, false);

    _bot.editMessageText('Настройки профиля', {
      'chat_id': callbackQuery.from.id,
      'message_id': callbackQuery.message.message_id,
      'reply_markup': keyboards.keyboardSettings.reply_markup
    });
  }
};

module.exports = Menu;