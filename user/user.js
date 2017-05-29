/**
 * Модуль для работы с базой данных MongoDB
 * @type {Database}
 */
var Database = require('../database/database.js');
Database = new Database();

/**
 * Создаёт экземпляр класса User
 *
 * @this {User}
 * @constructor
 */
function User() {

}

/**
 * @function
 * @type {addUser}
 */
User.prototype.addUser = addUser;

/**
 * Добавляет пользователя в базу данных
 *
 * @function
 * @param {number} userID ID пользователя
 */
function addUser(userID) {
  var userOptions = {
    userID: userID,
    notificationNextLesson: false,
    group: null,
    notificationDay: false,
    notificationTime: null
  };

  Database.insert('Users',userOptions,function (err, results) {
    //console.log('это опции вернулись\n'+results);
  });
}

/**
 * @function
 * @type {getOptions}
 */
User.prototype.getOptions = getOptions;

/**
 * Получает опции пользователя
 *
 * @function
 * @param {nimber} userID ID пользователя
 * @param {function} callback
 */
function getOptions(userID, callback){
  var filter = {
   userID: userID
 };
  Database.find('Users',filter, function(err, results) {
    //console.log(results);
    if (results.length == 0){
      addUser(userID);
      getOptions(userID, function (userOptions) {
        callback(userOptions);
      });
    } else {
      var userOptions = {
        userID: results[0].userID,
        notificationNextLesson: results[0].notificationNextLesson,
        group: results[0].group,
        notificationDay: results[0].notificationDay,
        notificationTime: results[0].notificationTime
      };
      callback(userOptions);
    }
  });
}

/**
 * @function
 * @type {updateInfo}
 */
User.prototype.updateInfo = updateInfo;

/**
 * Обновляет опции пользователя в базе данных
 *
 * @function
 * @param {number} userID ID пользователя
 * @param {object} userOptions опции пользователя
 */
function updateInfo(userID,userOptions) {
  var filter = {
    userID: userID
  };
  Database.update('Users', filter, userOptions,function (err, result) {
  });
}

module.exports = User;