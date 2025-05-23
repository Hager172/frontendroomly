import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-nav',
  imports: [CommonModule,RouterModule],
  templateUrl: './user-nav.component.html',
  styleUrl: './user-nav.component.css'
})
export class UserNavComponent implements OnInit {
  role: string | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
this.role = decodedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      console.log('ROLE:', this.role);
    } catch (err) {
      console.error('Error decoding token:', err);
    }
  }
}
// const token = localStorage.getItem('token');

//   if (!token) {
//     console.error('No token found');
//     return;
//   }

//   // فك الـ JWT عشان نجيب الدور
//   const payload = token.split('.')[1];
//   const decodedPayload = JSON.parse(atob(payload));
//   const role = decodedPayload.role;

//   // السماح فقط للي الدور بتاعه User
//   if (role !== 'User') {
//     console.warn('Access denied. Only users can view rooms.');
//     return;
//   }
