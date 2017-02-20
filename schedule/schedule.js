/**
 * Модуль для работы с группами
 * @type {Group}
 */
var Group = require('./group.js');

/**
 * Модуль для работы с группами
 * @type {Teacher}
 */
var Teacher = require('./teacher.js');

/**
 * Содержит константы чётности недели и дней недели
 * @type {object}
 */
const options = require('./options.js');

/**
 * Создает экземпляр класса Schedule
 *
 * @this {Schedule}
 * @constructor
 */
function Schedule() {

}

/**
 * Содержит дни недели
 * @type {object}
 */
Schedule.prototype.WEEK_DAY = options.WEEK_DAY;

/**
 * Содержит чётность недели
 * @type {object}
 */
Schedule.prototype.WEEK_PARITY = options.WEEK_PARITY;

/**
 * @description Создаёт экземпляр класса Group
 *
 * @example <caption>Пример использования:</caption>
 * var Schedule = require('./schedule/schedule.js');
 * Schedule = new Schedule();
 * Schedule.Group('P3217').getSchedule(Schedule.WEEK_DAY.TOMORROW, Schedule.WEEK_PARITY.EVEN, function (result) {
 *  //processing and output
 *  console.log(result);
 * });
 *
 * @param {string} groupName номер группы
 * @returns {Group}
 * @constructor
 */
Schedule.prototype.Group = function (groupName) {
  return new Group(groupName);
};

/**
 * @description Создаёт экземпляр класса Teacher
 *
 * @example <caption>Пример использования:</caption>
 * var Schedule = require('./schedule/schedule.js');
 * Schedule = new Schedule();
 * Schedule.Teacher(157347).getSchedule(Schedule.WEEK_DAY.ALL, Schedule.WEEK_PARITY.EVEN, function (result) {
 *  //processing and output
 *  console.log(result);
 * });
 *
 * @param {number} teacherId ID преподавателя
 * @returns {Teacher}
 * @constructor
 */
Schedule.prototype.Teacher = function (teacherId) {
  return new Teacher(teacherId);
};

module.exports = Schedule;





