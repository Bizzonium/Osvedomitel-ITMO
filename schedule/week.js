/**
 * Содержит пути к API ISU
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
 * Enum дни недели
 * @readonly
 * @enum {number}
 */
const WEEK_DAY = options.WEEK_DAY;

/**
 * Enum чётность недели
 * @readonly
 * @enum {object}
 */
const WEEK_PARITY = options.WEEK_PARITY;

/**
 * Создает экземпляр класса Group
 *
 * @param {string} groupName номер группы
 * @this {Group}
 * @constructor
 */
function Week() {

}

Week.prototype.get = function (callback) {
  /**
   * Опции для запроса
   * Подробнее: https://www.npmjs.com/package/request#requestoptions-callback
   */
  var url = paths.host + paths.basepath + '/schedule/week/'+ IsuApiToken;
  var options = {
    url: url,
    json: true
  };

  /**
   * Вызов ассинхронной функции https-запроса по указанному в options url
   */
  request(options, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var parity = body.parity;

      var now = new Date();
      if(now.getDay() === 0){
        switch (parity) {
        case "even":
          parity = WEEK_PARITY.ODD;
          break;
        case "odd":
          parity = WEEK_PARITY.EVEN;
          break;
        default:
          parity = WEEK_PARITY.BOTH;
          break;
        }
      }else{
        switch (parity) {
          case "even":
            parity = WEEK_PARITY.EVEN;
            break;
          case "odd":
            parity = WEEK_PARITY.ODD;
            break;
          default:
            parity = WEEK_PARITY.BOTH;
            break;
        }
      }
      callback(parity);
    }
  });
};

module.exports = Week;