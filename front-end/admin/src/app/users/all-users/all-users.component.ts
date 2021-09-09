import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shard/services/auth.service';

@Component({
  selector: 'app-all-users',
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css']
})
export class AllUsersComponent implements OnInit {
  public users :any;
  constructor(private auth : AuthService) { }

  ngOnInit(): void {
    this.auth.getAllUsers().subscribe((res:any)=>{
      this.users = res
      console.log(res);

    })
  }

}
