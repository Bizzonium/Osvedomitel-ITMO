/**
 * Модуль для работы с MongoDB
 * @type {object}
 */
var mongoClient = require('mongodb').MongoClient;

/**
 * Содержить url-адрес к бд MongoDB
 * @type {{url: string}}
 */
var url = require('./config/MongodbURL');

/**
 * Создаёт экземпляр класса Database
 *
 * @this {Database}
 * @constructor
 */
function Database() {

}

/**
 * Вставляет objects в collection и выполняет callback-функцию
 *
 * @param {string} collection коллекция
 * @param {object} objects объекты, которые нужно вставить
 * @param {object} callback callback-функция, получающая результат на обработку
 */
Database.prototype.insert = function(collection, objects, callback){
  mongoClient.connect(url, function(err, db){
    if(err){
      return console.log(err);
    }

    db.collection(collection).insertMany(users, function(err, results){
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
 * Удаляет объекты в collection просеивая через filter и выполняет callback-функцию
 *
 * @param {string} collection коллекция
 * @param {object} filter фильтр поиска
 * @param {object} updateFilter параметры замены
 * @param {object} callback callback-функция, получающая результат на обработку
 */
Database.prototype.update = function (collection, filter, updateFilter, callback) {
  mongoClient.connect(url, function(err, db){
    if (err) {
      return console.log(err);
    }

    db.collection(collection).updateMany(filter, updateFilter, function(err, result){
      if (err) {
        return console.log(err);
      }
      callback(err, result);
      db.close();
      }
    );
  });
};