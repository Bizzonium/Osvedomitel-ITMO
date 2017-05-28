/**
 * Модуль для работы с telegram-ботами
 * @type {TelegramBot}
 */
global.TelegramBot = require("tgfancy");

/**
 * Содержит токен телеграм-бота
 * @type {string}
 */
var telegramBotToken = require('../config/TelegramBotToken.js');

/**
 * Содержит экземпляр объекта модуля TelegramBot
 * @type {TelegramBot}
 */
module.exports = new TelegramBot(telegramBotToken, {polling: true});