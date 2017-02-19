/**
 * Содержит путями к API ISU
 * @type {object}
 */
const paths = require('../config/IsuApiURL.js');

/**
 * Содержит токен для использования API ISUПодключаем файл с путями к API ISU
 * @type {string}
 */
const IsuApiToken = require('../config/IsuApiToken.js');

/**
 * Модуль для работы с http[s]-запросами
 * @type {function}
 */
var request = require('request');

/**
 * Содержит константы чётности недели и дней недели
 * @type {object}
 */
const options = require('./options.js');

/**
 * Содержит дни недели
 * @type {object}
 */
const WEEK_DAY = options.WEEK_DAY;

/**
 * Содержит чётность недели
 * @type {object}
 */
const WEEK_PARITY = options.WEEK_PARITY;

/**
 * Создает экземпляр класса Group
 *
 * @param {string} groupName номер группы
 * @this {Group}
 * @constructor
 */
function Group(groupName) {
 this.groupName = groupName;
}


/**
 * Получает расписание занятий групп по указанным параметрам и передаёт результат в callback-функцию
 * @param {number} weekDay день недели
 * @param {number} weekParity чётность недели
 * @param {function} callback callback-фукнция, получающая результат на обработку
 * @param {boolean} getFormatted вернуть не коллекцию, а форматированный текст
 */
Group.prototype.getSchedule = function(weekDay, weekParity, callback, getFormatted) {
  /**
   * Опции для запроса
   * Подробнее: https://www.npmjs.com/package/request#requestoptions-callback
   */
  var url = paths.host + paths.basepath + '/schedule/common/group/'+ IsuApiToken + '/' + this.groupName;
  var options = {
    url: url,
    json: true
  };

  /**
   * Вызов ассинхронной функции https-запроса по указанному в options url
   */
  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      if(body.faculties.length === 0){
        return;
      }

      var groups = body.faculties[0].departments[0].groups;
      var result = {};
      result.schedule = [];
      result.group_name = groups[0].group_name;
      result.weekDay = weekDay;
      result.weekParity = weekParity;

      var group = {};
      group.group_name = groups[0].group_name;
      group.study_schedule = [];
      var days = groups[0].study_schedule;

      if (weekDay == WEEK_DAY.ALL){
        for (var dayIndex = 0, len = days.length; dayIndex < len; dayIndex++) {
          var day = {};
          day.weekday = days[dayIndex].weekday;
          day.lessons = [];

          for (var i = 0, len2 = days[dayIndex].lessons.length; i < len2; i++){
            if(weekParity == WEEK_PARITY.BOTH){
              day.lessons.push(days[dayIndex].lessons[i]);
            }else{
              if(days[dayIndex].lessons[i].parity == weekParity
                || days[dayIndex].lessons[i].parity == WEEK_PARITY.BOTH){
                day.lessons.push(days[dayIndex].lessons[i]);
              }
            }
          }

          if(day.lessons.length > 0){
            group.study_schedule.push(day);
          }
        }
      }else {
        var day = {};
        day.weekday = weekDay;
        day.lessons = [];
        var weekDayIndex = -1;

        for (var i = 0, daysLen = days.length; i < daysLen; i++){
          if( days[i].weekday == weekDay ){
            weekDayIndex = i;
            break;
          }
        }
        //console.log(day);

        if (weekDayIndex != -1){
          for (var i = 0, len = days[weekDayIndex].lessons.length; i < len; i++){
            if(weekParity == WEEK_PARITY.BOTH){
              day.lessons.push(days[weekDayIndex].lessons[i]);
            }else{
              if(days[weekDayIndex].lessons[i].parity == weekParity
                || days[weekDayIndex].lessons[i].parity == WEEK_PARITY.BOTH){
                day.lessons.push(days[weekDayIndex].lessons[i]);
              }
            }
          }
        }

        if (day.lessons.length > 0){
          group.study_schedule.push(day);
        }

      }

      if (group.study_schedule.length > 0){
        result.schedule.push(group);
      }

      if(getFormatted){
        callback(format(result));
      }else{
        callback(result);
      }
    }
  });
};

/**
 * Форматирует переданную коллекцию
 */
function format(collection, time) {
  var result = [];
  var schedule = collection.schedule;
  //console.log(collection);

  var message;
  if(time !== 'undefined'){
    message = 'Слудующая пара:\n';
  }else{
    var date = new Date();
    //date.setDate( date.getDate() + 1);
    var dateString = options.WEEK_DAY_STRING_LONG[date.getDay()].toLowerCase() + ', ' + date.getDate() + ' ' +
      options.MONTHS_STRING_LONG[date.getMonth()] + ' ' + date.getFullYear() + ' г.';
    var par = options.WEEK_PARITY_STRING[collection.weekParity];
    var week = (collection.weekParity == 0) ? 'обе недели' : 'всю '+ par + ' неделю';
    var add = ' на ' + (collection.weekDay == 0 ? week : par + ' ' + options.WEEK_DAY_STRING_LONG_A[collection.weekDay]);

    message = 'Расписание занятий для группы ' + collection.group_name + add +'.\n' +
      '<i>Сегодня ' + dateString + '</i>';
  }

  result.push(message);

  if(schedule.length === 0){
    message = 'Пусто';
    result.push(message);
    return result;
  }

  var group = schedule[0].study_schedule;

  for(var dayIndex = 0, len = group.length;  dayIndex < len; dayIndex++){
    var day = group[dayIndex];
    date.setDate( date.getDate() + dayIndex);
    if(time !== 'undefined') {
      message = '';
    }else{
      message = '<b>'+options.WEEK_DAY_STRING_LONG[day.weekday]+'</b>' + '\n';
    }

    for(var lessonIndex = 0, len2 = day.lessons.length; lessonIndex < len2; lessonIndex++){
      var lesson = day.lessons[lessonIndex];
      if(time !== 'undefined'){
        var timeSplit = time.split(':');
        var timePlus10 = timeSplit[0] + ':' + (timeSplit[1]+10);
        var timePlus20 = timeSplit[0] + ':' + (timeSplit[1]+20);
        var flag = lesson.time_start === timePlus10 || lesson.time_start === timePlus20;
        if(flag){

        }else{
          continue;
        }
      }

      var type = '';
      switch (lesson.type){
        case '1': type = 'лек '; break;
        case '2': type = 'лаб '; break;
        case '3': type = 'прак'; break;
      }

      var aud_name = lesson.auditories[0].auditory_name;
      if(aud_name == null){
        aud_name = '';
      }else{
        aud_name = aud_name +' ауд., ';
      }

      var teach_name = lesson.teachers[0].teacher_name;
      if(teach_name == null){
        teach_name = '';
      }else{
        teach_name = '<code>'+ teach_name +'</code>\n';
      }

      message += '<code>' + lesson.time_start + '-' + lesson.time_end + '\t\t</code>' +
                '<i>' + options.WEEK_PARITY_STRING[lesson.parity] + '</i>\n' +
                '<code>' + type + '\t\t</code>' + '<b>' + lesson.subject + '</b>\n' +
                teach_name +
                '<i>' + aud_name + lesson.auditories[0].auditory_address + '</i>\n'+
                '\n';

      if(flag){
        break;
      }
    }
    message += '\n';
    result.push(message);
    if(flag){
      break;
    }
  }
  return result;
}
Group.prototype.format = format;

module.exports = Group;