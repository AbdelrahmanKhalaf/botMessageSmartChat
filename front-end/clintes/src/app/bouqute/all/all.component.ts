import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDataChat } from 'src/app/shard/models/datachat';
import { AuthService } from 'src/app/shard/services/auth.service';
import { environment } from 'src/environments/environment';
declare const Stripe: any

@Component({
  selector: 'app-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.css']
})
export class AllComponent implements OnInit {
  public bouqute: any;
  public errorMessage: any;
  public userId: any;
  public message: any;
  constructor(private auth: AuthService, private route: ActivatedRoute) { }
  form = new FormGroup({
    bouquteId: new FormControl('', Validators.required),
  })
  //   const stripe = Stripe(environment.sercet_key)

  ngOnInit(): void {
    this.auth.getAllBouqute().subscribe((res: any) => {
      this.bouqute = res
      console.log(res);
    });
    this.auth.getInfo().subscribe((res: any) => {
      this.userId = res.user[0]
    }, (err: any) => {
      if (err.status === 502) {
        this.errorMessage = err.error;
      }
      if (err.status === 501) {
        this.errorMessage = err.error;
      }
      if (err.status === 500) {
        this.errorMessage = err.error.error
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
        this.errorMessage = err.error;
      }
      if (err.status === 401) {
        this.errorMessage = err.error.error_ar;
      }
    })
    this.route.queryParams.subscribe((pram: any) => {
      let dataProdac: IDataChat = {
        bouquteId: pram.prodactId,
      };
      if (pram.session_id) {
        this.auth.addchat(dataProdac).subscribe((res: any) => {
          this.message = res.message

        }, (err: any) => {
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
      if(pram.error){
        this.errorMessage = pram.error
      }
      pram.session_id
    })

  }
  buy(id: any, index: any) {
    if (this.userId) {
      const data = {
        prodactId: id,
        customer_email: this.userId.email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: "sar",
              unit_amount: this.bouqute[index].price * 100,
              product_data: {
                name: this.bouqute[index].title,
                images: [`https://zeejprint.com/website/images/services/graphic-design/marketing-and-advertising.jpg`]
              }

            }
          }
        ]
      }
      this.auth.chackOut(data).subscribe((res: any) => {
        console.log(res);
        const stripe = Stripe(environment.sercet_key)
        console.log(stripe);
        stripe.redirectToCheckout(
          { sessionId: res.sessionId }
        )
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
          this.errorMessage = err.error;
        }
        if (err.status === 401) {
          this.errorMessage = err.error.error_ar;
        }

      })
    } else {
      this.errorMessage = "please login or register befor buy"
    }
  }

}
