"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserId = void 0;
async function getUserId(socket) {
    socket.on("join", (room) => {
        console.log("user is join from server " + room.idUser);
    });
}
exports.getUserId = getUserId;
//# sourceMappingURL=getIDUser.js.map