import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shard/services/auth.service';
import { WebSocketService } from 'src/app/shard/services/web-socket.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  public chat: any;
  public date: any
  public error: any
  constructor(
    private auth: AuthService,
    private Socket: WebSocketService

  ) { }
  public user: any
  ngOnInit(): void {

    // this.Socket.listen('error').subscribe((error: any) => {
    //   console.log('hi');
    //   console.log(error + "error");
    // })
    // this.Socket.listen('online').subscribe((res: any) => {
    //   console.log(res);
    // })
    this.date = new Date(Date.now())
    this.auth.getInfo().subscribe((res: any) => {
      this.user = res.user[0]
      this.Socket.emit('join', { idUser: this.user._id });
      this.Socket.emit('conecte', { userId: this.user._id });
      this.Socket.emit('user',  this.user._id );
      this.Socket.emit('online', this.user._id);

    })
    this.auth.getChat().subscribe((res: any) => {
      this.chat = res.chat
      console.log(res);
    }, (err: any) => {
      if (err) {
        this.error = err.error.error_en

      }
    })

  }
  click() {

  }
  access(name: any) {
    if (name === "twitter") {
      this.Socket.emit('Iduser', { userId: this.user._id });
      this.Socket.emit('userDone', { userId: this.user._id });
      location.href = "http://localhost:3000/api/chat//twitter/login"

    }
  }
}

