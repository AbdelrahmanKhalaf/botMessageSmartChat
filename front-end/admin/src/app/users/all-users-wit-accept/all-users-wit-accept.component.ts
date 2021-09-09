import { Component, OnInit } from '@angular/core';
import { Ibouqute } from 'src/app/shard/models/IbouquteUserUpdqate';
import { AuthService } from 'src/app/shard/services/auth.service';

@Component({
  selector: 'app-all-users-wit-accept',
  templateUrl: './all-users-wit-accept.component.html',
  styleUrls: ['./all-users-wit-accept.component.css']
})
export class AllUsersWitAcceptComponent implements OnInit {

  constructor(private auth: AuthService) { }
  public users: any;
  public errorMessage: any
  public message:any;

  ngOnInit(): void {
    this.auth.getAllUsersNotAccept().subscribe((res: any) => {
      console.log(res);
      this.users = res

    })
  }
  update(userId: any, value: any, index: any) {

    let data: Ibouqute = {
      userId: userId,
      value: value
    }
    this.auth.upateBouquteUser(data).subscribe((res: any) => {
      this.message = res.message
      if (index > -1) {
        this.users.splice(index, 1);
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
