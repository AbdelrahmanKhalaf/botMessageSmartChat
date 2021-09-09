"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chacke = exports.serchTitle = exports.ResponseMessage = void 0;
function ResponseMessage(response, array) {
    return array.some(function (res) {
        return res.toLocaleLowerCase().trim() == response.toLocaleLowerCase().trim();
    });
}
exports.ResponseMessage = ResponseMessage;
function serchTitle(response, array) {
    return array.some(function (res) {
        return String(res.title) == String(response);
    });
}
exports.serchTitle = serchTitle;
function Chacke(array) {
    var count = {};
    array.forEach(function (para) {
        count[para] = (count[para] || 0) + 1;
    });
    return count;
}
exports.Chacke = Chacke;
//# sourceMappingURL=search.js.map