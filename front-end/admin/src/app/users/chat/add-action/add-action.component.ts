import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ISmartAction } from 'src/app/shard/models/actionToUser';
import { ISmartChat } from 'src/app/shard/models/smartChatData';
import { AuthService } from 'src/app/shard/services/auth.service';

@Component({
  selector: 'app-add-action',
  templateUrl: './add-action.component.html',
  styleUrls: ['./add-action.component.css']
})
export class AddActionComponent implements OnInit {
  public message: any = []
  public errorMessage: any
  public Id: any;
  form = new FormGroup({
    title: new FormControl('', Validators.required),
    lang: new FormControl('', Validators.required),
    action: new FormArray([
      new FormGroup({
        key: new FormControl('', [Validators.required]),
        value: new FormControl('', [Validators.required]),
      })
    ])
  })
  constructor(private auth: AuthService, private route: ActivatedRoute) { }
  get f() {
    return this.form.controls
  }
  get title() {
    return this.form.get('title')
  }
  get lang() {
    return this.form.get('lang')

  }
  get action() {
    return this.f['action']
  }
  get getAtrb(): any {
    return this.form.controls['action'] as FormArray
  }
  addAtrb() {
    const atrbutForm = new FormGroup({
      key: new FormControl('', [Validators.required]),
      value: new FormControl('', [Validators.required]),
    })
    this.getAtrb.push(atrbutForm)
  }
  remove(index: any) {
    let atr: any = this.form.controls['action'] as FormArray
    this.getAtrb.removeAt(index)
  }
  save() {

    let data: ISmartAction = {
      action: this.action.value,
      title: this.title?.value,
      lang: this.lang?.value
    }
    this.auth.addAction(data, this.Id).subscribe((res: any) => {
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
  ngOnInit(): void {
    this.Id = this.route.snapshot.paramMap.get('id')

  }
}
