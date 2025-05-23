import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../Services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-regester',
  imports: [CommonModule,FormsModule],
  templateUrl: './regester.component.html',
  styleUrl: './regester.component.css'
})
export class RegesterComponent {
email:string='';
  fullName: string='';
  phoneNumber: string='';
  address: string='';
  password: string='';

constructor(private auth:AuthService,private router:Router){}


 errorMessage: string = '';
 errorMessages:string[]=[]

regester() {
  this.errorMessage = '';
 this.errorMessages=[]
  if (!this.email || !this.password || !this.fullName || !this.phoneNumber || !this.address) {
    this.errorMessage = 'Please fill all fields';
    return;
  }

  const userData = {
    email: this.email,
    password: this.password,
    fullName: this.fullName,
    phoneNumber: this.phoneNumber,
    address: this.address
  };

  this.auth.register(userData).subscribe({
    next: (res) => {
      localStorage.setItem('token', res.token);
      console.log("Register success", res.token,res.fullName);
      this.router.navigateByUrl("login"); // بعد التسجيل روح لصفحة المستخدم
    },
   error: (err) => {
    // لو جالك رسالة نصية عادية
    if (typeof err.error === 'string') {
      this.errorMessages = [err.error];
    }
    // لو جالك موديل فيه errors
    else if (err.status === 400 && err.error && err.error.errors) {
      const allErrors: string[] = [];

      for (const key in err.error.errors) {
        if (err.error.errors.hasOwnProperty(key)) {
          allErrors.push(...err.error.errors[key]);
        }
      }

      this.errorMessages = allErrors;
    }
    else {
      this.errorMessages = ['Something went wrong. Please try again later.'];
    }
  }
  });
}

}
