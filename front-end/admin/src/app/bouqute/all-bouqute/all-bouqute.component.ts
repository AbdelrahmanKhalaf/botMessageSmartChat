import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shard/services/auth.service';

@Component({
  selector: 'app-all-bouqute',
  templateUrl: './all-bouqute.component.html',
  styleUrls: ['./all-bouqute.component.css']
})
export class AllBouquteComponent implements OnInit {

  constructor(private auth : AuthService) { }
  public bouqute:any;
  ngOnInit(): void {
    this.auth.getAllBouqute().subscribe((res:any)=>{
      this.bouqute = res
      console.log(res);

    })
  }

}
