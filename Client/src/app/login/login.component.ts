import { Component, OnInit } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { FormsModule} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  credentials: TokenPayload = {
    username: '',
    password: '',
  };

  constructor(private auth: AuthenticationService, private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('app-profile');
    }, (err) => {
      console.error(err);
      alert('Warning: Wrong Credentials');
      return;
    });
  }

  forgotpassword(username) {
    console.log(username);
    this.auth.forgotpassword(username).subscribe(() => {
       alert("An email with a link to reset your password has been sent to your EmailID")
    }, (err) => {
      console.error(err);
      alert('Warning: Wrong Credentials');
      return;
    });

  }

}
