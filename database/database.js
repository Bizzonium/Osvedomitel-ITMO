/**
 * Модуль для работы с MongoDB
 * @type {object}
 */
var mongoClient = require('mongodb').MongoClient;

/**
 * Содержить url-адрес к бд MongoDB
 * @type {{url: string}}
 */
var url = require('../config/MongodbURL');

/**
 * Создаёт экземпляр класса Database
 *
 * @this {Database}
 * @constructor
 */
function Database() {

}

/**
 * @example <caption>Пример работы с этим модулем:</caption>
 *   var Database = require('./database/database.js');
 *   Database = new Database();
 *   var object = {
 *    id: 1337,
 *    notifications: true,
 *    kukareku: "kwa-kwa-lol-kek"
 *   }
 *   Database.insert("users", object, function(err, result){
 *   console.log(result);
 *   });
 *
 * подробнее тут: http://metanit.com/web/nodejs/6.1.php
 * возможно этот модуль не будет работать. ещё ни разу его не тестил
 *
 * @description Вставляет objects в collection и выполняет callback-функцию
 * @function
 * @param {string} collection коллекция
 * @param {object} objects объекты, которые нужно вставить
 * @param {object} callback callback-функция, получающая результат на обработку
 */
Database.prototype.insert = function(collection, objects, callback){
  mongoClient.connect(url, function(err, db){
    if(err){
      return console.log(err);
    }

    db.collection(collection).insertOne(objects, function(err, results){
      if(err){
        return console.log(err);
      }
      callback(err, results);
      db.close();
    });
  });
};

/**
 * Ищет объекты в collection просеивая через filter и выполняет callback-функцию
 *
 * @function
 * @param {string} collection коллекция
 * @param {object} filter фильтр поиска
 * @param {object} callback callback-функция, получающая результат на обработку
 */
Database.prototype.find = function (collection, filter, callback) {
  mongoClient.connect(url, function(err, db){
    if(err){
      return console.log(err);
    }

    db.collection(collection).find(filter).toArray(function(err, results){
      if(err){
        return console.log(err);
      }
      callback(err, results)
      db.close();
    });
  });
};

/**
 * Удаляет объекты в collection просеивая через filter и выполняет callback-функцию
 *
 * @function
 * @param {string} collection коллекция
 * @param {object} filter фильтр поиска
 * @param {object} callback callback-функция, получающая результат на обработку
 */
Database.prototype.delete = function (collection, filter, callback) {
  mongoClient.connect(url, function (err, db) {
    if (err) {
      return console.log(err);
    }

    db.collection(collection).deleteMany(filter, function (err, result) {
      if (err) {
        return console.log(err);
      }
      callback(err, result);
      db.close();
    });
  });
};

/**
 * Обновляет объекты в collection просеивая через filter и меняет по updateFilter и выполняет callback-функцию
 *
 * @function
 * @param {string} collection коллекция (название коллекции)
 * @param {object} filter фильтр поиска (уникальный идентификатор по которому необхожимо найти нужного пользователся
 * @param {object} updateFilter параметры замены
 * @param {object} callback callback-функция, получающая результат на обработку
 */
Database.prototype.update = function (collection, filter, updateFilter, callback) {
  mongoClient.connect(url, function(err, db){
    if (err) {
      return console.log(err);
    }

    db.collection(collection).updateOne(filter, updateFilter, function(err, result){
      if (err) {
        return console.log(err);
      }
      callback(err, result);
      db.close();
      }
    );
  });
};

module.exports = Database;