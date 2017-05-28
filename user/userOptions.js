/**
 * ВНИМАНИЕ! Не работает... сохранено на будущее
 */

/**
 * Модуль для работы с пользователями
 * @type {User}
 */
var User = require('../user/user.js');
User = new User();

var _userOption = {};
var _userID = undefined;
var _notificationNextLesson = undefined;
var _group = undefined;
var _notificationDay = undefined;
var _notificationTime = undefined;

/**
 * Создаёт экземпляр класса UserOptions
 *
 * @this {UserOptions}
 * @param userID
 * @constructor
 */
function UserOptions(userID) {
  _userOption = {};
  _userID = userID;
  _notificationNextLesson = undefined;
  _group = undefined;
  _notificationDay = undefined;
  _notificationTime = undefined;
}

Object.defineProperties(_userOption, {
  userID: {
    set: function (userID){
      _userID = userID;
    },
    get: function () {
      return _userID;
    }
  },

  notificationNextLesson: {
    set: function (notificationNextLesson) {
      // if(typeof _notificationNextLesson === 'undefined'){
      //  update();
      // }
      var updateFilter = {
        $set: {
          notificationNextLesson: notificationNextLesson
        }
      };

      User.updateInfo(_userID, updateFilter);
      _notificationNextLesson = notificationNextLesson;
    },
    get: function () {
      if(typeof _notificationNextLesson === 'undefined'){
        update().then(function () {
          this.notificationNextLesson;
        });
        //while (typeof _notificationNextLesson === 'undefined'){}
      }else{
        return _notificationNextLesson;
      }

    }
  },

  group: {
    set: function (group) {
      // if(typeof _group === 'undefined'){
      //   update().then(this.notificationNextLesson);
      // }
      var updateFilter = {
        $set: {
          group: group
        }
      };

      User.updateInfo(_userID, updateFilter);
      _group = group;
    },
    get: function () {
      if(typeof _group === 'undefined'){
        update().then(this.group);
        //while (typeof _group === 'undefined'){}
      }
      return _group;
    }
  },

  notificationDay: {
    set: function (notificationDay) {
      // if(typeof _notificationDay === 'undefined'){
      //   update().then(this.notificationNextLesson);
      // }
      var updateFilter = {
        $set: {
          notificationDay: notificationDay
        }
      };

      User.updateInfo(_userID, updateFilter);
      _notificationDay = notificationDay;
    },
    get: function () {
      if(typeof _notificationDay === 'undefined'){
        update().then(this.notificationDay);
        //while (typeof _notificationDay === 'undefined'){}
      }
      return _notificationDay;
    }
  },

  notificationTime: {
    set: function (notificationTime) {
      // if(typeof _notificationTime === 'undefined'){
      //   update().then(this.notificationNextLesson);
      // }
      var updateFilter = {
        $set: {
          notificationTime: notificationTime
        }
      };

      User.updateInfo(_userID, updateFilter);
      _notificationTime = notificationTime;
    },
    get: function () {
      if(typeof _notificationTime === 'undefined'){
        update().then(this.notificationTime);
        //while (typeof _notificationTime === 'undefined'){}
      }
      return _notificationTime;
    }
  }
});

function update(){
  return new Promise(function (resolved) {
    User.getOptions(_userID, function (userOption) {
      _notificationNextLesson = userOption.notificationNextLesson;
      _group = userOption.group;
      _notificationDay = userOption.notificationDay;
      _notificationTime = userOption.notificationTime;
      resolved();
    });
  });
}

UserOptions.prototype.userOption = _userOption;
module.exports = UserOptions;