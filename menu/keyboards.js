/**
 * Enum разметка клавиатуры для главного меню
 * @enum {object}
 */
module.exports.keyboardHelloMenu = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: '📚Расписание на завтра', callback_data: 'tomorrowSchedule'}],
      [{ text: '📅Расписание моей группы', callback_data: 'groupSchedule' }],
      [{ text: '⚙Настроить профиль', callback_data: 'settings' }]
    ]
  })
};

/**
 * Enum разметка клавиатуры для дней недели
 * @enum {object}
 */
module.exports.keyboardDayOfWeek = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Понедельник', callback_data: '1' },{text: 'Вторник', callback_data: '2'}],
      [{ text: 'Среда', callback_data: '3' },{text: 'Четверг', callback_data: '4'}],
      [{ text: 'Пятница', callback_data: '5' },{text: 'Суббота', callback_data: '6'}],
      [{text: 'На всю неделю', callback_data: 'allDay_0'}],
      [{ text: '⬅️Вернуться в главное меню', callback_data: 'settingsBack' }]
    ]
  })
};

/**
 * Enum разметка клавиатуры для чётности недели
 * @enum {object}
 */
module.exports.keyboardOddOrEven = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: 'Нечетная', callback_data: 'odd_1' },{text: 'Четная', callback_data: 'even_2'}],
      [{text: 'Все расписание', callback_data: 'both_0'},{ text: '⬅Вернуться ко дням', callback_data: 'backDay'}]
    ]
  })
};

/**
 * Enum разметка клавиатуры для настроек
 * @enum {object}
 */
module.exports.keyboardSettings = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: '🎓Номер вашей группы', callback_data: 'userGroup' }],
      [{ text: '🔔Уведомлять о следующей паре', callback_data: 'notificationLesson' }],
      [{ text: '🔔Уведомлять о следующем дне', callback_data: 'notificationDay' }],
      [{ text: '⬅️Вернуться в главное меню', callback_data: 'settingsBack' }]
    ]
  })
};

/**
 * Enum разметка клавиатуры выбора да/нет
 * @enum {object}
 */
module.exports.keyboardYesOrNo = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: '✔Да', callback_data: 'yes' },{ text: '✖️Нет', callback_data: 'no' }]
    ]
  })
};

/**
 * Enum разметка клавиатуры для выбора интервала времени уведомлений
 * @enum {object}
 */
module.exports.keyboardNotificationTime = {
  reply_markup: JSON.stringify({
    inline_keyboard: [
      [{ text: '🌝Утро(6:30-12:00)', callback_data: 'morning'},{ text: '🌞День(12:30-18:00)', callback_data: 'lunch'}],
      [{ text: '🌚Вечер(18:30-00:00)', callback_data: 'evening'},{ text: '🚫Отмена', callback_data: 'no' }]
    ]
  })
};

/**
 * Enum разметка клавиатуры для выбора времени уведомлений в интервале утра
 * @enum {object}
 */
module.exports.keyboardChooseTimeMorning = {
 reply_markup: JSON.stringify(({
   inline_keyboard: [
     [{text: '🕡6:30', callback_data:'Time_6:30'},{text: '🕖7:00', callback_data:'Time_7:00'},{text: '🕢7:30', callback_data:'Time_7:30'}],
     [{text: '🕗8:00', callback_data:'Time_8:00'},{text: '🕣8:30', callback_data:'Time_8:30'},{text: '🕘9:00', callback_data:'Time_9:00'}],
     [{text: '🕤9:30', callback_data:'Time_9:30'},{text: '🕙10:00', callback_data:'Time_10:00'},{text: '🕥10:30', callback_data:'Time_10:30'}],
     [{text: '🕚11:00', callback_data:'Time_11:00'},{text: '🕦11:30', callback_data:'Time_11:30'},{text: '🕛12:00', callback_data:'Time_12:00'}],
     [{text: '⬅Вернуться назад', callback_data:'backChooseTime'}]
   ]
 }))
};

/**
 * Enum разметка клавиатуры для выбора времени уведомлений в интервале обеда
 * @enum {object}
 */
module.exports.keyboardChooseTimeLunch = {
  reply_markup: JSON.stringify(({
    inline_keyboard: [
      [{text: '🕧12:30', callback_data:'Time_12:30'},{text: '🕐13:00', callback_data:'Time_13:00'},{text: '🕜13:30', callback_data:'Time_13:30'}],
      [{text: '🕑14:00', callback_data:'Time_14:00'},{text: '🕝14:30', callback_data:'Time_14:30'},{text: '🕒15:00', callback_data:'Time_15:00'}],
      [{text: '🕞15:30', callback_data:'Time_15:30'},{text: '🕓16:00', callback_data:'Time_16:00'},{text: '🕟16:30', callback_data:'Time_16:30'}],
      [{text: '🕔17:00', callback_data:'Time_17:00'},{text: '🕠17:30', callback_data:'Time_17:30'},{text: '🕕18:00', callback_data:'Time_18:00'}],
      [{text: '⬅Вернуться назад', callback_data:'backChooseTime'}]
    ]
  }))
};

/**
 * Enum разметка клавиатуры для выбора времени уведомлений в интервале вечера
 * @enum {object}
 */
module.exports.keyboardChooseTimeEvening = {
  reply_markup: JSON.stringify(({
    inline_keyboard: [
      [{text: '🕡18:30', callback_data:'Time_18:30'},{text: '🕖19:00', callback_data:'Time_19:00'},{text: '🕢19:30', callback_data:'Time_19:30'}],
      [{text: '🕗20:00', callback_data:'Time_20:00'},{text: '🕣20:30', callback_data:'Time_20:30'},{text: '🕘21:00', callback_data:'Time_21:00'}],
      [{text: '🕤21:30', callback_data:'Time_21:30'},{text: '🕙22:00', callback_data:'Time_22:00'},{text: '🕥22:30', callback_data:'Time_22:30'}],
      [{text: '🕚23:00', callback_data:'Time_23:00'},{text: '🕦23:30', callback_data:'Time_23:30'},{text: '🕛00:00', callback_data:'Time_00:00'}],
      [{text: '⬅Вернуться назад', callback_data:'backChooseTime'}]
    ]
  }))
};
