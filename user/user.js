var Database = require('../database/database.js');
Database = new Database();

function User() {

}


// function callback(err,results) {
//   console.log('Это из базы данных пришли резалты\n'+results.userID);
//   this.userOptions = results;
// }

User.prototype.addUser = addUser;

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

User.prototype.getOptions = getOptions;
function getOptions(userID, callback){
  var filter = {
   userID: userID
 };
  Database.find("Users",filter, function(err, results) {
    //console.log(results);
    if (results.length == 0){
      addUser(userID);
      getOptions(userID, function (userOptions) {
        callback(userOptions);
      });
    }else {
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

User.prototype.updateInfo = updateInfo;
function updateInfo(userID,userOptions) {
  var filter = {
    userID: userID
  };
  Database.update("Users", filter, userOptions,function (err, result) {
  });
}


module.exports = User;
///module.exports.userOptions = this.userOptions;