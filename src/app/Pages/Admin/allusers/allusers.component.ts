import { CommonModule } from '@angular/common';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-allusers',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './allusers.component.html',
  styleUrl: './allusers.component.css'
})
export class AllusersComponent implements OnInit {
  users : any[]=[];
  selectedUser: any = null;
    editUser: any | null = null;



  constructor(private http:HttpClient){}

ngOnInit(): void {
    this.loadAllUsers();
  }


  getUserRole(): string | null {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    return decodedPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || null;
  } catch (e) {
    console.error('Error decoding token', e);
    return null;
  }
}

loadAllUsers(): void {
  const role = this.getUserRole();

  if (role !== 'Admin') {
    console.warn('Access denied. Only admins can view users.');
    return;
  }

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.get<any[]>('http://localhost:5298/api/User', { headers }).subscribe({
    next: (data) => {
      this.users = data;
      console.log(data);
    },
    error: (err) => {
      console.error('Error loading users', err);
    }
  });
}
viewDetails(userId: string) {
  const role = this.getUserRole();
  if (role !== 'Admin') {
    console.warn('Access denied. Only admins can view user details.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.get(`http://localhost:5298/api/User/${userId}`, { headers }).subscribe({
    next: (data) => {
      this.selectedUser = data;
      console.log('User details:', data);
        const bootstrap = (window as any).bootstrap;
const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
modal.show();

    },
    error: (err) => {
      console.error('Error loading user details', err);
    }
  });
}

deleteUser(userId: string) {
  const role = this.getUserRole();
  if (role !== 'Admin') {
    console.warn('Access denied. Only admins can delete users.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }

  const confirmed = confirm('Are you sure you want to delete this user?');  // Confirmation message
  if (!confirmed) return;

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.delete(`http://localhost:5298/api/User/${userId}`, { headers }).subscribe({
    next: () => {
      alert('User deleted successfully!');
      this.loadAllUsers(); // Refresh the users list after deletion
    },
    error: (err) => {
      console.error('Error deleting user', err);
      alert('Failed to delete the user, please try again.');
    }
  });
}


openEditModal(userId: string) {
  const role = this.getUserRole();
  if (role !== 'Admin') {
    console.warn('Access denied. Only admins can view user details.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });
    this.http.get<any>(`http://localhost:5298/api/User/${userId}`, { headers }).subscribe({
      next: (user) => {
        this.editUser = { ...user }; // clone the user object to avoid modifying selectedUser directly
        // افتح المودال باستخدام bootstrap js
        const modalEl = document.getElementById('editUserModal');
        if (modalEl) {

                  const bootstrap = (window as any).bootstrap;
const modal = new bootstrap.Modal(modalEl);
modal.show();
        }
      },
      error: (err) => {
        console.error('Error loading user for edit', err);
      }
    });
  }

  closeEditModal() {
    this.editUser = null;
  }

  onSubmitEdit() {
  if (!this.editUser) return;

  const role = this.getUserRole();
  if (role !== 'Admin') {
    console.warn('Access denied. Only admins can update user details.');
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.put(`http://localhost:5298/api/User/${this.editUser.id}`, this.editUser, { headers }).subscribe({
    next: () => {
      alert('User updated successfully!');
      this.closeEditModal();
      this.loadAllUsers();  // لو عايز تحدث الليست بعد التعديل
    },
    error: (err) => {
      console.error('Error updating user', err);
    }
  });
}


}
