import {  Socket } from "socket.io";
//use socet to send id user from clinte side to save date in it table
export async function getUserId(socket: Socket) {
    //this is name unq of room
    socket.on("join", (room: any) => {
        console.log("user is join from server " + room.idUser);
    });
}
//  