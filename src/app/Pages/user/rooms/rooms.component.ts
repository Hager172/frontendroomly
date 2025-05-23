import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-rooms',
  standalone: true,            // لازم تعلن كده
  imports: [CommonModule,RouterModule],      // عشان *ngFor
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: any[] = [];

  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit(): void {
    this.loadAllRooms();  // لما الصفحة تفتح تعرض كل الغرف
  }

  loadAllRooms() {
    this.http.get<any[]>('http://localhost:5298/api/Room/GetRooms').subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (err) => {
        console.error('Error loading all rooms:', err);
      }
    });
  }

  loadAvailableRooms() {
    this.http.get<any[]>('http://localhost:5298/api/Room/GetAvailableRooms').subscribe({
      next: (data) => {
        this.rooms = data;
      },
      error: (err) => {
        console.error('Error loading available rooms:', err);
      }
    });
  }
goToReserve(roomId: number) {
    console.log('Navigating to reserve with roomId:', roomId);
  this.router.navigate(['user/reserve'], {queryParams: { roomId: roomId } });
}
goToMyReservations() {
  this.router.navigate(['/user/my-reservations']);
}

addToFavorite(roomId: number): void {
  const token = localStorage.getItem('token');

  if (!token) {
    console.error('No token found in localStorage');
    alert('User is not authenticated.');
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  this.http.post('http://localhost:5298/api/Favorites', { roomId }, { headers }).subscribe({
    next: () => {
      alert('Added to favorites!');
    },
    error: (err) => {
      console.error('Error adding to favorites', err);
      alert('Error adding to favorites.');
    }
  });
}
}
