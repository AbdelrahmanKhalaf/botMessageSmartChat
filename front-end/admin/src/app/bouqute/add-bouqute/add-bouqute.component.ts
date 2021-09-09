import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IDataBouqute } from 'src/app/shard/models/dataBouqte';
import { AuthService } from 'src/app/shard/services/auth.service';

@Component({
  selector: 'app-add-bouqute',
  templateUrl: './add-bouqute.component.html',
  styleUrls: ['./add-bouqute.component.css']
})
export class AddBouquteComponent implements OnInit {
  public errorMessage: any
  public message: any;
  public socailCateg: any;
  form = new FormGroup({
    limit: new FormControl('', Validators.required),
    date: new FormControl('', Validators.required),
    title: new FormControl('', Validators.required),
    price: new FormControl('', Validators.required),
    sale: new FormControl('', Validators.required),
    socail: new FormControl('', Validators.required),
  })
  get limit() {
    return this.form.get('limit')
  }
  get date() {
    return this.form.get('date')
  }
  get title() {
    return this.form.get('title')
  }
  get price() {
    return this.form.get('price')
  }
  get sale() {
    return this.form.get('sale')
  }
  get socail() {
    return this.form.get('socail')
  }
  save() {
    let data: IDataBouqute = {
      title: this.title?.value,
      date: this.date?.value,
      limit: this.limit?.value,
      sale: this.sale?.value,
      price: this.price?.value,
      socail: this.socail?.value,
    }
    this.auth.addBouqute(data).subscribe((res: any) => {
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
  constructor(private auth: AuthService) { }

  ngOnInit(): void {
    this.auth.getAllSocail().subscribe((res: any) => {
      this.socailCateg = res
      console.log(res);

    })
  }

}
