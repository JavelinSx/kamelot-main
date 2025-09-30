"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = defineEventHandler(function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var body, config, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, message, response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, readBody(event)];
            case 1:
                body = _a.sent();
                config = useRuntimeConfig();
                TELEGRAM_BOT_TOKEN = config.telegramBotToken;
                TELEGRAM_CHAT_ID = config.telegramChatId;
                if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
                    throw createError({
                        statusCode: 500,
                        statusMessage: 'Telegram configuration missing'
                    });
                }
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                message = formatTelegramMessage(body);
                return [4 /*yield*/, $fetch("https://api.telegram.org/bot".concat(TELEGRAM_BOT_TOKEN, "/sendMessage"), {
                        method: 'POST',
                        body: {
                            chat_id: TELEGRAM_CHAT_ID,
                            text: message,
                            parse_mode: 'HTML'
                        }
                    })];
            case 3:
                response = _a.sent();
                return [2 /*return*/, { success: true, message: 'Booking request sent successfully' }];
            case 4:
                error_1 = _a.sent();
                console.error('Telegram API error:', error_1);
                throw createError({
                    statusCode: 500,
                    statusMessage: 'Failed to send booking request'
                });
            case 5: return [2 /*return*/];
        }
    });
}); });
function formatTelegramMessage(data) {
    var privateText = data.isPrivate ? '✅ Да' : '❌ Нет';
    var parentText = data.isParent ? '✅ Да (запись для ребёнка)' : '❌ Нет';
    var trainingTypes = {
        'boxing': 'Бокс',
        'kickboxing': 'Кикбоксинг',
        'grappling': 'Грэпплинг',
        'bjj': 'БЖЖ (Бразильское джиу-джитсу)',
        'mma': 'ММА',
        'pankration': 'Панкратион'
    };
    var trainingLabel = trainingTypes[data.trainingType] || data.trainingType;
    var contactIcon = data.contactMethod === 'telegram' ? '💬' : '📱';
    var contactLabel = data.contactMethod === 'telegram' ? 'Telegram' : 'Телефон';
    var message = "\uD83E\uDD4A <b>\u041D\u041E\u0412\u0410\u042F \u0417\u0410\u042F\u0412\u041A\u0410 \u041D\u0410 \u0422\u0420\u0415\u041D\u0418\u0420\u041E\u0412\u041A\u0423</b>\n\n\uD83D\uDC64 <b>\u041A\u043E\u043D\u0442\u0430\u043A\u0442\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435".concat(data.isParent ? ' (родитель)' : '', ":</b>\n   \u0418\u043C\u044F: ").concat(data.firstName, " ").concat(data.lastName, "\n   ").concat(contactIcon, " ").concat(contactLabel, ": ").concat(data.contact, "\n   \uD83C\uDF82 \u0412\u043E\u0437\u0440\u0430\u0441\u0442: ").concat(data.age, " \u043B\u0435\u0442\n\n\uD83E\uDD4B <b>\u041D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u0435:</b> ").concat(trainingLabel, "\n\uD83C\uDFAF <b>\u041F\u0435\u0440\u0441\u043E\u043D\u0430\u043B\u044C\u043D\u044B\u0435 \u0442\u0440\u0435\u043D\u0438\u0440\u043E\u0432\u043A\u0438:</b> ").concat(privateText, "\n\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67\u200D\uD83D\uDC66 <b>\u0417\u0430\u043F\u0438\u0441\u044C \u0434\u043B\u044F \u0440\u0435\u0431\u0451\u043D\u043A\u0430:</b> ").concat(parentText);
    if (data.isParent && data.childFirstName && data.childLastName) {
        message += "\n\n\uD83D\uDC76 <b>\u0414\u0430\u043D\u043D\u044B\u0435 \u0440\u0435\u0431\u0451\u043D\u043A\u0430:</b>\n   \u0418\u043C\u044F: ".concat(data.childFirstName, " ").concat(data.childLastName, "\n   \uD83C\uDF82 \u0412\u043E\u0437\u0440\u0430\u0441\u0442: ").concat(data.childAge, " \u043B\u0435\u0442");
    }
    if (data.additionalInfo) {
        message += "\n\n\uD83D\uDCAC <b>\u0414\u043E\u043F\u043E\u043B\u043D\u0438\u0442\u0435\u043B\u044C\u043D\u043E:</b> ".concat(data.additionalInfo);
    }
    message += "\n\n<i>\u0414\u0430\u0442\u0430 \u0437\u0430\u044F\u0432\u043A\u0438: ".concat(new Date().toLocaleString('ru-RU'), "</i>");
    return message;
}
