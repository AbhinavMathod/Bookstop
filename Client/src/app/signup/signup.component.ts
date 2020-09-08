import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  credentials: TokenPayload = {
    username: '',
    password: '',
    firstname: '',
    lastname:''
  };

  constructor(private auth: AuthenticationService, private router: Router, private http: HttpClient) { }

  register() {
    console.log(this.credentials);
    this.auth.register(this.credentials).subscribe(() => {
      this.router.navigateByUrl('app-login');
      alert("You have been registered successfully! Please Login!")
    }, (err) => {
      console.error(err);
      alert("Username not available!")
    });

}
}
