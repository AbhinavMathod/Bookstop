import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserDetails,TokenPayload } from '../authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  details: UserDetails;
  updatedDetails: TokenPayload;
  buttonStatus= true;

  constructor(private auth: AuthenticationService,private router: Router) {}

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.updatedDetails=user;
      console.log(this.updatedDetails.firstname);
    }, (err) => {
      console.error(err);
    });
  }
  update() {
    console.log("here");
    console.log(this.updatedDetails);
    
    this.auth.update(this.updatedDetails).subscribe(() => {
      
    //this.router.navigateByUrl('app-login');
    alert("Fields updated successfully. Please login to view changes.")
    this.auth.logout();
    //debugger;
  }, (err) => {
    console.log(err);
  });
}

onChange(){
  //debugger;
  this.buttonStatus = false;
}
}



