import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ISmartChat } from 'src/app/shard/models/smartChatData';
import { AuthService } from 'src/app/shard/services/auth.service';

@Component({
  selector: 'app-setting-chat-user',
  templateUrl: './setting-chat-user.component.html',
  styleUrls: ['./setting-chat-user.component.css']
})
export class SettingChatUserComponent implements OnInit {
  public messageSend: any = []
  public clearValue: any
  public valueSend: any = []
  public message: any = []
  public errorMessage: any
  public Id: any;
  constructor(private auth: AuthService, private route: ActivatedRoute) { }
  ngOnInit(): void {
    this.Id = this.route.snapshot.paramMap.get('id')
  }


  form = new FormGroup({
    title: new FormControl('', Validators.required),
    lang: new FormControl('', Validators.required),
  })
  get title() {
    return this.form.get('title')
  }
  get lang() {
    return this.form.get('lang')
  }
  addmessage(value: any) {
    this.messageSend.push(value)
    this.clearValue = null

  }
  addValue(value: any) {
    this.valueSend.push(value)
  }
  clearMessage(i: any) {
    if (i > -1) {
      this.messageSend.splice(i, 1);
    }
  }
  clearValue1(i: any) {
    if (i > -1) {
      this.valueSend.splice(i, 1);
    }
  }
  save() {

    let data: ISmartChat = {
      value: this.valueSend,
      message: this.messageSend,
      title: this.title?.value,
      lang: this.lang?.value
    }
    this.auth.addSmart(data, this.Id).subscribe((res: any) => {
      console.log(res);
      this.message.push(res.message)
    }, (err: any) => {
      console.log(err);

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
