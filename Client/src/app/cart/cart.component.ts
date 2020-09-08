import { Component, OnInit } from '@angular/core';
import { AuthenticationService, BookDetails,TokenPayload3,UserDetails,cartDetails } from '../authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  orders : cartDetails;
  payload : TokenPayload3;
  details : UserDetails;


  constructor(private auth: AuthenticationService,private router: Router) { }

  ngOnInit(): void {
    this.auth.profile().subscribe(user => {
      this.details = user;
    }, (err) => {
      console.error(err);
    });

    this.auth.getCart().subscribe(orders => {
      this.orders = orders;
    }, (err) => {
      console.error(err);
    });
    
    
  }
  

}
