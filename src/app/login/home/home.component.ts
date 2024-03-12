import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { endPoints } from 'src/app/shared/endPoints';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    userMail: ['', Validators.required],
    userPassword: ['', Validators.required],
    captcha: [''],
  });

  get loginFormFC() {
    return this.loginForm.controls;
  }

  showInvalidCredentialsAlert: boolean = false;
  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {

  }

  onSubmit() {
    if (this.loginForm.valid) {
      const body = {
        email: this.loginFormFC['userMail']?.value,
        password: this.loginFormFC['userPassword']?.value,
      };

      console.log(body);
      this.apiService.post(endPoints.login, body).subscribe(
        (res) => {
          console.log(res);
          if (res.status === 200) {
            sessionStorage.setItem('auth-token', res.token);
            this.router.navigate(['dashboard']);
            console.log('success');
          } else {
            this.showInvalidCredentialsAlert = true;

            // Hide the alert after 3 seconds
            setTimeout(() => {
              this.showInvalidCredentialsAlert = false;
            }, 3000);
            Swal.fire('Oops...', 'Invalid Credentials', 'error');
          }
        },
        (error) => {
          // Handle the HTTP error response
          console.error(error);

          if (error.status != 200) {
            // The server responded with 401 (Unauthorized), indicating invalid credentials
            this.showInvalidCredentialsAlert = true;

            // Hide the alert after 3 seconds
            setTimeout(() => {
              this.showInvalidCredentialsAlert = false;
            }, 3000);
          } else {
            // Handle other error scenarios
            // ...
          }
        }
      );

      // try {
      //   this.apiService.post(endPoints.login, body).subscribe((res) => {
      //     console.log(res);
      //     if (res.status === 200) {
      //       sessionStorage.setItem('auth-token', res.token);
      //       this.router.navigate(['dashboard']);
      //       console.log('success');
      //     } else {
      //       this.showInvalidCredentialsAlert = true;

      //       // Hide the alert after 3 seconds
      //       setTimeout(() => {
      //         this.showInvalidCredentialsAlert = false;
      //       }, 3000);
      //       Swal.fire('Oops...', 'Invalid Credentials', 'error');
      //     }
      //   }),
      // } catch (error) {
      //   Swal.fire('Oops...', 'Error Login', 'error');
      // }
    }
  }
}
