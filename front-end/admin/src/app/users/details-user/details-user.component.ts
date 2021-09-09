import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/shard/services/auth.service';

@Component({
  selector: 'app-details-user',
  templateUrl: './details-user.component.html',
  styleUrls: ['./details-user.component.css']
})
export class DetailsUserComponent implements OnInit {
  public Id: any;
  public user: any;
  public chat: any;
  public error: any;
  public errorMessage: any
  constructor(private auth: AuthService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.Id = this.route.snapshot.paramMap.get('id')
    this.auth.userDetails(this.Id).subscribe((res: any) => {
      this.user = res

    }, (err) => { })
    this.auth.getChat(this.Id).subscribe((res: any) => {
      this.chat = res.chat
      console.log(this.chat);

    }, (err: any) => {
      if (err) {
        this.error = err.error.error_en
      }
    })
  }
  delete(indexChat: any, indexSocail: any, title: any) {
    let data: any = {
      title: title
    }
    this.auth.DeleteSmart(data, this.Id).subscribe((res: any) => {
      if (indexChat > -1) {
        this.chat.social[indexSocail].chatIntilagine.splice(indexChat, 1);
      }
    }, (err: any) => {
      if (err.status === 502) {
        this.errorMessage = err.error.error;
      }
      if (err.status === 501) {
        this.errorMessage = err.error.error;
      }
      if (err.status === 500) {

        this.errorMessage = err.error.error;
      }
      if (err.status === 400) {
        this.errorMessage = err.error.error;
      }
      if (err.error.error_ar) {
        this.errorMessage = err.error.error_ar;
      }
      if (err.error.error_en) {
        this.errorMessage = err.error.error_en;
      }
      if (err.status === 404) {
        this.errorMessage = err.error.error;
      }
      if (err.status === 401) {
        this.errorMessage = err.error.error_ar;

      }
    })
  }

  deleteAction(indexChat: any, indexSocail: any, title: any) {
    let data: any = {
      title: title
    }
    this.auth.deleteAction(data, this.Id).subscribe((res: any) => {
      if (indexChat > -1) {
        this.chat.social[indexSocail].actions.splice(indexChat, 1);
      }
    }, (err: any) => {
      if (err.status === 502) {
        this.errorMessage = err.error.error;
      }
      if (err.status === 501) {
        this.errorMessage = err.error.error;
      }
      if (err.status === 500) {

        this.errorMessage = err.error.error;
      }
      if (err.status === 400) {
        this.errorMessage = err.error.error;
      }
      if (err.error.error_ar) {
        this.errorMessage = err.error.error_ar;
      }
      if (err.error.error_en) {
        this.errorMessage = err.error.error_en;
      }
      if (err.status === 404) {
        this.errorMessage = err.error.error;
      }
      if (err.status === 401) {
        this.errorMessage = err.error.error_ar;

      }
    })
  }

}
