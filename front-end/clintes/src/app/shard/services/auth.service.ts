import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IRegister } from '../models/IRegister';
import { ILogin } from '../models/Ilogin'
import { IDataChat } from '../models/datachat';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }
  getToken(): any {
    return localStorage.getItem('token')
  }
  removToken(): any {
    localStorage.removeItem('token'),
      this.router.navigate(['/auth/login']);
  }
  makeRegister(IRegister: IRegister) {
    return this.http.post(`${environment.url}/users/singup`, IRegister)
  }
  login(ILogin: ILogin) {
    return this.http.post(`${environment.url}/auth/login`, ILogin)

  }
  getInfo() {
    return this.http.get(`${environment.url}/users/me`)

  }
  getAllBouqute() {
    return this.http.get(`${environment.url}/bouqute/get`)
  }
  addchat(data: IDataChat) {
    return this.http.post(`${environment.url}/chat/addPlatform`, data)

  }
  getChat() {
    return this.http.get(`${environment.url}/chat/getChat`)
  }
  accessTwitter(){
    return this.http.get(`${environment.url}/chat/twitter/login`)
  }
  chackOut(data: any) {
    return this.http.post(`${environment.url}/chat/chake`, data)

  }
}
