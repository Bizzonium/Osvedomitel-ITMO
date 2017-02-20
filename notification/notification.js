/**
 * Модуль для работы с базой данных MongoDB
 * @type {Database}
 */
var Database = require('../database/database.js');
Database = new Database();

/**
 * Модуль для работы с расписанием
 * @type {Schedule}
 */
var Schedule = require('../schedule/schedule.js');
Schedule = new Schedule();

var _bot;
var enableNotificationOnNextDay;
var enableNotificationOnNextLesson;
var scheduleEndTime = ['8:20', '9:50', '11:30', '13:10', '15:00', '16:50', '18:30', '20:10'];
var startTime;
var endTime;
var currentTime;
var deltaTime;
var deltaTimezone = require('../config/timezoneDelta.js');

/**
 * Создаёт экземпляр класса Notification
 *
 * @param {TelegramBot} bot экземпляр класса TelegramBot
 * @this {Notification}
 * @constructor
 */
function Notification(bot) {
  _bot = bot;
  enableNotificationOnNextDay = false;
  enableNotificationOnNextLesson = false;
  startTime = '6:30';
  endTime = '0:00';
  deltaTime = 30;
  //currentTime = findCurrentTime();
}

// function getMinutesWithDelta() {
//   var minutes = [];
//   for(var i = 0; i < 60 / deltaTime + 1; i++){
//     minutes.push(i * deltaTime);
//   }
//   return minutes;
// }

// function findCurrentTime() {
//   var minutes = getMinutesWithDelta();
//   var now = new Date().getMinutes();
//   //var now = new moment();
//   //now = now.tz(new Date().toDateString(), 'Europe/Moscow');
//
//   for (var i = 0; i < minutes.length - 1; i++) {
//     if(now > minutes[i] && now < minutes[i+1]){
//       if(minutes[i+1] == 60){
//         return minutes[0];
//       }else{
//         return minutes[i+1];
//       }
//     }
//   }
// }

/**
 * Запускает асинхронные функции отправки уведомлений
 *
 * @function
 */
Notification.prototype.run = function () {
  enableNotificationOnNextDay = true;
  enableNotificationOnNextLesson = true;
  runNotificationOnNextDay();
  runNotificationOnNextLesson();
};

/**
 * Останавливает асинхронные функции отправки уведомлений
 *
 * @function
 */
Notification.prototype.stop = function () {
  enableNotificationOnNextDay = false;
  enableNotificationOnNextLesson = false;
};

/**
 * Останавливает на время выполнение фукнции
 *
 * @function
 * @param {number} time время в мс
 */
function sleep (time) {
  return new Promise(function(resolve){
    setTimeout(resolve, time);
  });
}

/**
 * Запускает асинхронную фукнцию уведомления расписанием на след. день
 *
 * @function
 */
function runNotificationOnNextDay() {
  return new Promise( function (resolved) {
    if (enableNotificationOnNextDay === true){
      var now = new Date();
      now.setHours(now.getHours() + deltaTimezone);
      //var nowPlusOneHour = now;
      //nowPlusOneHour.setHours(now.getHours() + 1);

      var addZero = '';
      if(now.getMinutes() < 10){
        addZero = '0';
      }
      var time = now.getHours() + ':' + addZero + now.getMinutes();
      console.log('NotificationOnNextDay: time = ' + time);

      //if(now.getHours() > 6 && nowPlusOneHour.getHours() < 1){
        if(now.getMinutes() % deltaTime == 0){
          var filter = {
            "group": {
              $ne: null
            },
            "notificationDay": true,
            "notificationTime": {
              $ne: null,
              $eq: time
            }
          };
          var userID;
          Database.find("Users", filter, function(err, users) {
            console.log(users);
            for(var i = 0, len = users.length; i < len; i++){
              console.log(users[i].userID);
              userID = users[i].userID;
              Schedule.Group(users[i].group).getSchedule(Schedule.WEEK_DAY.TOMORROW, Schedule.WEEK_PARITY.BOTH, function (schedule) {
                sendSchedule(userID, schedule);
              }, true);
            }
          });
        }
      //}
      sleep(60000).then(runNotificationOnNextDay); // 600000 ms = 10 min
    }
    resolved();
  });

}

/**
 * Запускает асинхронную фукнцию уведомления расписанием след. пары
 *
 * @function
 */
function runNotificationOnNextLesson() {
  return new Promise( function (resolved) {
    if (enableNotificationOnNextLesson === true){
      var now = new Date();
      now.setHours(now.getHours() + deltaTimezone);
      //var nowPlusOneHour = now;
      //nowPlusOneHour.setHours(now.getHours() + 1);

      var addZero = '';
      if(now.getMinutes() < 10){
        addZero = '0';
      }
      var time = now.getHours() + ':' + addZero + now.getMinutes();
      console.log('NotificationOnNextLesson: time = ' + time);

      if(find(scheduleEndTime, time) !== -1 && now.getDay != 0 && currentTime != time){
        currentTime = time;
        var filter = {
          "group": {
            $ne: null
          },
          "notificationNextLesson": true
        };
        Database.find("Users", filter, function(err, users) {
          console.log(users);
          for(var i = 0, len = users.length; i < len; i++){
            Schedule.Group(users[i].group).getSchedule(now.getDay(), Schedule.WEEK_PARITY.BOTH, function (schedule) {
              var userID = schedule.userID;
              var groupName = schedule.groupName;
              schedule = Schedule.Group(groupName).format(schedule, time);
              if(schedule.length > 1){
                sendSchedule(userID, schedule);
              }
            }, false, users[i].userID);
          }
        });
      }
      sleep(60000).then(runNotificationOnNextLesson); // 600000 ms = 10 min
    }
    resolved();
  });

}

/**
 * Отправляет расписания
 *
 * @function
 * @param {number} userID ID пользователя
 * @param {string} schedule сообщения с расписанием
 */
function sendSchedule(userID, schedule) {
  var options = {
    parse_mode: "HTML"
  };
  for (var i = 0, len = schedule.length; i < len; i++) {
    _bot.sendMessage(userID, schedule[i], options);
  }
}

/**
 * Ищет совпадения в массиве
 *
 * @function
 * @param array
 * @param value
 * @returns {number} индекс элемента в массиве или -1
 */
function find(array, value) {
  if (array.indexOf) { // если метод существует
    return array.indexOf(value);
  }

  for (var i = 0; i < array.length; i++) {
    if (array[i] === value) return i;
  }

  return -1;
}

module.exports = Notification;