import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IDataSocail } from 'src/app/shard/models/dataSocail';
import { AuthService } from 'src/app/shard/services/auth.service';

@Component({
  selector: 'app-add-socail',
  templateUrl: './add-socail.component.html',
  styleUrls: ['./add-socail.component.css']
})
export class AddSocailComponent implements OnInit {
  constructor(private auth: AuthService) { }
  public errorMessage: any
  public message: any
  ngOnInit(): void {
  }

  form = new FormGroup({
    title: new FormControl('', Validators.required),

    language: new FormControl('', Validators.required),
  })
  get title() {
    return this.form.get('title')
  }

  get language() {
    return this.form.get('language')
  }

  save() {
    let data: IDataSocail = {
      title: this.title?.value,
      language: this.language?.value,
    }
    this.auth.addSocail(data).subscribe((res: any) => {
      this.message = res.message
      console.log(res);
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
