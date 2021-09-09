import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shard/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit {
  public token: any;

  constructor(public auth: AuthService) { }

  ngOnInit(): void {
    this.token = this.auth.getToken()

  }
  logout(){
    return this.auth.removToken()
  }
}
