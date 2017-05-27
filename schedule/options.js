/**
 * Содержит чётность недели
 * @type {{BOTH: number, ODD: number, EVEN: number}}
 */
module.exports.WEEK_PARITY = {
  BOTH: 0,
  ODD: 1,
  EVEN:  2
};

/**
 * Содержит дни недели
 * @type {{ALL: number, MONDAY: number, TUESDAY: number, WEDNESDAY: number, THURSDAY: number, FRIDAY: number, SATURDAY: number, SUNDAY: number}}
 */
var WEEK_DAY = {
  ALL: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 7
};

Object.defineProperty(WEEK_DAY, "TOMORROW", {
  get: function() {
    var date = new Date();
    date.setDate(date.getDate() + 1);
    var weekDay = [7, 1, 2, 3, 4, 5, 6];
    var tomorrow = date.getDay();
    // if(tomorrow == 0){
    //   tomorrow = 1;
    // }
    return weekDay[tomorrow];
  }
});

module.exports.WEEK_DAY = WEEK_DAY;

module.exports.WEEK_DAY_STRING_LONG = {
  1: 'ПОНЕДЕЛЬНИК',
  2: 'ВТОРНИК',
  3: 'СРЕДА',
  4: 'ЧЕТВЕРГ',
  5: 'ПЯТНИЦА',
  6: 'СУББОТА',
  0: 'ВОСКРЕСЕНЬЕ'
};

module.exports.WEEK_DAY_STRING_LONG_A = {
  1: 'понедельник',
  2: 'вторник',
  3: 'среду',
  4: 'четверг',
  5: 'пятницу',
  6: 'субботу',
  0: 'воскресенье'
};

module.exports.WEEK_PARITY_STRING = {
  0: '',
  1: 'нечёт',
  2: 'чёт'
};

module.exports.MONTHS_STRING_SHORT = {
  0: 'янв',
  1: 'фев',
  2: 'мар',
  3: 'апр',
  4: 'май',
  5: 'июн',
  6: 'июл',
  7: 'авг',
  8: 'сен',
  9: 'окт',
  10: 'ноя',
  11: 'дек'
};

module.exports.MONTHS_STRING_LONG = {
  0: 'Января',
  1: 'Февраля',
  2: 'Марта',
  3: 'Апреля',
  4: 'Мая',
  5: 'Июня',
  6: 'Июля',
  7: 'Августа',
  8: 'Сентября',
  9: 'Октября',
  10: 'Ноября',
  11: 'Декабря'
};