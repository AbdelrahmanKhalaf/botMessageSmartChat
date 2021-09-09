"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDays = void 0;
function addDays(date, days) {
    date.setDate(date.getDate() + Number(days));
    return date;
}
exports.addDays = addDays;
//# sourceMappingURL=add.days.js.map