import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shard/services/auth.service';

@Component({
  selector: 'app-all-socail',
  templateUrl: './all-socail.component.html',
  styleUrls: ['./all-socail.component.css']
})
export class AllSocailComponent implements OnInit {
  public socails:any
  constructor(private Auth: AuthService) { }

  ngOnInit(): void {
    this.Auth.getAllSocail().subscribe((res:any)=>{
      this.socails = res
      console.log(res);
    })
  }

}
