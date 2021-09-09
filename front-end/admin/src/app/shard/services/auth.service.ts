import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { IRegister } from '../models/IRegister';
import { ILogin } from '../models/Ilogin'
import { IDataChat } from '../models/datachat';
import { Ibouqute } from '../models/IbouquteUserUpdqate';
import { ISmartChat } from '../models/smartChatData';
import { ISmartAction } from '../models/actionToUser';
import { IDataSocail } from '../models/dataSocail';
import { IDataBouqute } from '../models/dataBouqte';
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
    return this.http.post(`${environment.url}/auth/admin`, ILogin)

  }
  getInfo() {
    return this.http.get(`${environment.url}/users/me`)

  }
  getAllBouqute() {
    return this.http.get(`${environment.url}/bouqute/get`)
  }
  getAllSocail() {
    return this.http.get(`${environment.url}/socail/get`)
  }
  addchat(data: IDataChat) {
    return this.http.post(`${environment.url}/chat/addPlatform`, data)

  }
  getChat(id: any) {
    return this.http.get(`${environment.url}/chat/getChat/admin/${id}`)
  }
  accessTwitter() {
    return this.http.get(`${environment.url}/chat/twitter/login`)
  }
  getAllUsers() {
    return this.http.get(`${environment.url}/users/users`)

  }
  getAllUsersNotAccept() {
    return this.http.get(`${environment.url}/users/users/notAccept`)

  }
  getAllUsersAccept() {
    return this.http.get(`${environment.url}/users/users/accept`)

  }
  upateBouquteUser(data: Ibouqute) {
    return this.http.put(`${environment.url}/chat/updatePlatform`, data)

  }
  addSmart(data: ISmartChat, id: any) {
    return this.http.post(`${environment.url}/chat/addSmart/${id}`, data)

  }
  addAction(data: ISmartAction, id: any) {
    return this.http.post(`${environment.url}/chat/addAction/${id}`, data)

  }
  deleteAction(data: any, id: any) {
    return this.http.put(`${environment.url}/chat/deleteAction/${id}`, data)

  }
  DeleteSmart(data: any, id: any) {
    return this.http.put(`${environment.url}/chat/deleteSmart/${id}`, data)
  }
  userDetails(id: any) {
    return this.http.get(`${environment.url}/users/users/accept/${id}`)
  }
  addSocail(data: IDataSocail) {
    return this.http.post(`${environment.url}/socail`, data)

  }
  addBouqute(data: IDataBouqute) {
    return this.http.post(`${environment.url}/bouqute`, data)

  }

}
