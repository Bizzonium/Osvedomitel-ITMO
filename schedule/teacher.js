/**
 * Содержит путями к API ISU
 * @type {object}
 */
const paths = require('../config/IsuApiURL.js');

/**
 * Содержит токен для использования API ISU
 * @type {string}
 */
const IsuApiToken = require('../config/IsuApiToken.js');

/**
 * Модуль для работы с http[s]-запросами
 * @type {request}
 */
var request = require('request');

/**
 * Содержит константы чётности недели и дней недели
 * @type {object}
 */
const options = require('./options.js');

/**
 * Содержит дни недели
 * @enum {number}
 */
const WEEK_DAY = options.WEEK_DAY;

/**
 * Содержит чётность недели
 * @enum {number}
 */
const WEEK_PARITY = options.WEEK_PARITY;

/**
 * Создает экземпляр класса Teacher
 *
 * @param {number} teacherId ID преподавателя
 * @this {Teacher}
 * @constructor
 */
function Teacher(teacherId) {
  this.teacherId = teacherId;
}

/**
 * Получает расписание занятий групп по указанным параметрам и передаёт результат в callback-функцию
 *
 * @function
 * @param {number} weekDay день недели
 * @param {number} weekParity чётность недели
 * @param {function} callback callback-фукнция, получающая результат на обработку
 */
Teacher.prototype.getSchedule = function(weekDay, weekParity, callback, getFormatted) {
  /**
   * Опции для запроса
   * Подробнее: https://www.npmjs.com/package/request#requestoptions-callback
   */
  var url = paths.host + paths.basepath + '/schedule/common/teacher/'+ IsuApiToken + '/' + this.teacherId;
  var options = {
    url: url,
    json: true
  };

  /**
   * Вызов ассинхронной функции https-запроса по указанному в options url
   */
  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      // console.log(body);
      // if(body.http != 200){
      //   return;
      // }
      var groups = body.faculties[0].departments[0].groups; //[0].study_schedule
      var result = {};
      result.schedule = [];
      result.teacher_name = null;
      result.weekDay = weekDay;
      result.weekParity = weekParity;

      for (var groupIndex = 0, len3 = groups.length; groupIndex < len3; groupIndex++){
        var group = {};
        group.group_name = groups[groupIndex].group_name;
        group.study_schedule = [];
        var days = groups[groupIndex].study_schedule;

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

              if(result.teacher_name == null && days[dayIndex].lessons[i].teachers[0].teacher_name != null){
                result.teacher_name = days[dayIndex].lessons[i].teachers[0].teacher_name;
              }
            }
            if (day.lessons.length > 0){
              group.study_schedule.push(day);
            }
          }
        }else {
          var day = {};
          day.weekday = weekDay;
          day.lessons = [];
          var weekDayIndex = -1;

          for (var i = 0, daysLen = days.length; i < daysLen; i++){
            if(result.teacher_name == null && days[i].lessons[0].teachers[0].teacher_name != null){
              result.teacher_name = days[i].lessons[0].teachers[0].teacher_name;
            }
            if( days[i].weekday == weekDay ){
              weekDayIndex = i;
              if (weekDayIndex != -1){
                for (var lessonIndex = 0, len = days[weekDayIndex].lessons.length; lessonIndex < len; lessonIndex++){
                  if(weekParity == WEEK_PARITY.BOTH){
                    day.lessons.push(days[weekDayIndex].lessons[lessonIndex]);
                  }else{
                    if(days[weekDayIndex].lessons[lessonIndex].parity == weekParity
                      || days[weekDayIndex].lessons[lessonIndex].parity == WEEK_PARITY.BOTH){
                      day.lessons.push(days[weekDayIndex].lessons[lessonIndex]);
                    }
                  }
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
 * @function
 * @type {format}
 */
Teacher.prototype.format = format;

/**
 * Форматирует переданную коллекцию
 *
 * @function
 * @param {object} collection
 * @returns {Array} массив сообщений
 */
function format(collection) {
  var result = [];
  var schedule = collection.schedule;
  //console.log('COLLECTION:');
  //console.log(collection);

  var date = new Date();
  //date.setDate( date.getDate() + 1);
  var dateString = options.WEEK_DAY_STRING_LONG[date.getDay()].toLowerCase() + ', ' + date.getDate() + ' ' +
    options.MONTHS_STRING_LONG[date.getMonth()] + ' ' + date.getFullYear() + ' г.';
  var par = options.WEEK_PARITY_STRING[collection.weekParity];
  var week = (collection.weekParity == 0) ? 'обе недели' : 'всю '+ par + ' неделю';
  var add = ' на ' + (collection.weekDay == 0 ? week : par + ' ' + options.WEEK_DAY_STRING_LONG_A[collection.weekDay]);

  var message = 'Расписание занятий для преподавателя ' + collection.teacher_name + add +'.\n' +
    '<i>Сегодня ' + dateString + '</i>';
  result.push(message);

  if(schedule.length === 0){
    message = 'Пусто';
    result.push(message);
    return result;
  }

  // for (var groupIndex = 0, groupsLen = schedule.length; groupIndex < groupsLen; groupIndex++){
  //   var group = schedule[groupIndex];
  //   for () {
  //
  //   }
  // }

  for (var groupIndex = 0, len3 = schedule.length; groupIndex < len3; groupIndex++){
    var group = schedule[groupIndex].study_schedule;
    var groupName = schedule[groupIndex].group_name;
    //console.log('GROUP:');
    //console.log(group);
    message = '';

    for(var dayIndex = 0, len = group.length;  dayIndex < len; dayIndex++){
      var day = group[dayIndex];
      //console.log(day);
      date.setDate( date.getDate() + dayIndex);
      message += '<b>'+options.WEEK_DAY_STRING_LONG[day.weekday]+'</b>' + '\n';

      for(var lessonIndex = 0, len2 = day.lessons.length; lessonIndex < len2; lessonIndex++){
        var lesson = day.lessons[lessonIndex];

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

        // var teach_name = lesson.teachers[0].teacher_name;
        // if(teach_name == null){
        //   teach_name = '';
        // }else{
        //   teach_name = '<code>'+ teach_name +'</code>\n';
        // }

        message += '<code>' + lesson.time_start + '-' + lesson.time_end + '\t\t</code>' +
          '<i>' + options.WEEK_PARITY_STRING[lesson.parity] + '</i>' +
          '<code>\t\t\t</code><i>' + groupName + '</i>\n' +
          '<code>' + type + '\t\t</code>' + '<b>' + lesson.subject + '</b>\n' +
          //teach_name +
          '<i>' + aud_name + lesson.auditories[0].auditory_address + '</i>\n';
      }
      message += '\n';
    }
    result.push(message);
  }


  return result;
}

module.exports = Teacher;