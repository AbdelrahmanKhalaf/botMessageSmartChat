import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shard/services/auth.service';

@Component({
  selector: 'app-accept',
  templateUrl: './accept.component.html',
  styleUrls: ['./accept.component.css']
})
export class AcceptComponent implements OnInit {
  public users:any;
  constructor(private auth : AuthService) { }
  ngOnInit(): void {
    this.auth.getAllUsersAccept().subscribe((res: any) => {
      this.users = res

    })
  }

}
