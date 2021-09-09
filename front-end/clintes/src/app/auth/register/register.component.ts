import { IRegister } from './../../shard/models/IRegister';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/shard/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  public token: any;
  public errorMessage:any
  public message:any;
  constructor(private auth: AuthService,private router : Router) { }
  form = new FormGroup({
    name: new FormControl('',Validators.required),
    password: new FormControl('',Validators.required),
    phone: new FormControl('',Validators.required),
    confirmPassword: new FormControl('',Validators.required),
    email: new FormControl('',Validators.required),
    address:new FormControl('',Validators.required),
  });
  get name (){
    return this.form.get('name')
  }
  get password (){
    return this.form.get('password')
  }
  get phone (){
    return this.form.get('phone')
  }
  get confirmPassword (){
    return this.form.get('confirmPassword')
  }
  get email (){
    return this.form.get('email')
  }
  get address (){
    return this.form.get('address')
  }
  register(){
    let data :IRegister = {
      name : this.name?.value,
      phone:this.phone?.value,
      email:this.email?.value,
      password:this.password?.value,
      confirmPassword:this.confirmPassword?.value,
      address:this.address?.value
    }
    this.auth.makeRegister(data).subscribe((res:any)=>{
     this.message = res.message_en;
      console.log(res);
      this.router.navigate(['/auth/login'])

    },(err:any)=>{
      if (err.status === 502) {
        this.errorMessage = err.error;
      }
      if (err.status === 501) {
        this.errorMessage = err.error;
      }
      if (err.status === 500) {

        this.errorMessage = err.error;
      }
      if (err.status === 400) {
        this.errorMessage = err.error;
      }
      if (err.error.error_ar) {
        this.errorMessage = err.error.error_ar;
      }
      if (err.error.error_en) {
        this.errorMessage = err.error.error_en;
      }
      if (err.status === 404) {
        this.errorMessage = err.error;
      }
      if (err.status === 401) {
        this.errorMessage = err.error.error_ar;
      }
    })
  }
  ngOnInit(): void {
  }

}
