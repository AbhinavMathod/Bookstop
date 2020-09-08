import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {SignupComponent} from './signup/signup.component';
import {AuthGuardService} from './auth-guard.service';
import {ProfileComponent} from './profile/profile.component';
import {BuyerComponent}  from './buyer/buyer.component';
import {CartComponent} from './cart/cart.component';
import {SellerComponent} from './seller/seller.component';
import { ImagesComponent } from './images/images.component';


const routes: Routes = [
  {path: 'app-login' , component : LoginComponent},
   {path: 'app-register' , component : SignupComponent},
   {path: 'app-profile' , component : ProfileComponent, canActivate: [AuthGuardService]},
   {path: 'app-buyer' ,component : BuyerComponent, canActivate: [AuthGuardService]},
   {path: 'app-cart' ,component:CartComponent,canActivate: [AuthGuardService]},
   {path: 'app-seller',component:SellerComponent,canActivate:[AuthGuardService]},
   {path: 'app-images',component:ImagesComponent,canActivate:[AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AppRoutingModule { }
