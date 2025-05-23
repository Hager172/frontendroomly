import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';

import { ActivatedRoute, Router, RouterModule, } from '@angular/router';

@Component({
  selector: 'app-reserve-room',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './reserve-room.component.html',
  styleUrl: './reserve-room.component.css'
})
export class ReserveRoomComponent {
  errorMessage :string='';
    reservation: any = {
    roomId: null,
    checkInDate: '',
    checkOutDate: ''
  };
constructor(private http:HttpClient,private route :ActivatedRoute,private router :Router){
}
ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    if (params['roomId']) {
      this.reservation.roomId = +params['roomId'];
    }
  });

}
createReservation() {
  const token = localStorage.getItem('token'); // أو من أي مكان بتخزن فيه التوكن

  const headers = token ? new HttpHeaders().set('Authorization', 'Bearer ' + token) : undefined;

  this.http.post('http://localhost:5298/api/Reservation/user/create', this.reservation, { headers }).subscribe({
    next: (res) => {
      alert('Reservation successful!');
    },
      error: (err) => {
      if (err.status === 409) {
        // حالة الغرفة غير متاحة
        this.errorMessage = err.error; // بيكون سترينج
      } else if (err.status === 400) {
        // ModelState Error (Validation)
        if (typeof err.error === 'object') {
          this.errorMessage = Object.values(err.error)
            .flat()
            .join(' | ');
        } else {
          this.errorMessage = err.error;
        }
      } else if (err.status === 401) {
        this.errorMessage = "You are not authorized to make a reservation.";
      } else {
        this.errorMessage = 'An unexpected error occurred.';
      }
    }

  });
}
}
