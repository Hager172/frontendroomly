import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-llogin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private auth: AuthService, private router: Router) {

  }

  login() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';

      return;

    }

    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        console.log(res)
        console.log("success",res.token)// روح ع الصفحة الرئيسية بعد اللوجين
      },
      error: (err) => {
        this.errorMessage = 'Invalid credentials or server error';

        console.error(err);
      }
    });
  }
}
