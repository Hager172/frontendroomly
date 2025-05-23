import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-reservations',
  imports: [RouterModule, CommonModule,FormsModule],
  templateUrl: './my-reservations.component.html',
  styleUrl: './my-reservations.component.css'
})
export class MyReservationsComponent {
  reservations: any[] = [];
  errorMessage: string = '';
editingReservation: any = null;
  constructor(private http: HttpClient) {}

 ngOnInit(): void {
    this.loadReservations();
  }

  loadReservations() {
    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', 'Bearer ' + token) : undefined;

    this.http.get('http://localhost:5298/api/reservation/user/myreservations', { headers })
      .subscribe({
        next: (data: any) => {
          this.reservations = data;
        },
        error: (err) => {
          console.error('Error fetching reservations:', err);
          this.errorMessage = 'Something went wrong while fetching your reservations';
        }
      });
  }
  cancelReservation(id: number) {
    if (!confirm('Are you sure you want to cancel this reservation?')) {
      return;
    }

    const token = localStorage.getItem('token');
    const headers = token ? new HttpHeaders().set('Authorization', 'Bearer ' + token) : undefined;

    this.http.delete(`http://localhost:5298/api/reservation/${id}`, { headers }).subscribe({
      next: () => {
        alert('Reservation cancelled successfully.');
        // إزالة الحجز الملغى من القائمة بدون إعادة تحميل الصفحة بالكامل
        this.reservations = this.reservations.filter(r => r.resevationId !== id);
      },
      error: (err) => {
        console.error('Error cancelling reservation:', err);
        if (err.status === 401) {
          this.errorMessage = 'You are not authorized to cancel this reservation.';
        } else if (err.status === 404) {
          this.errorMessage = 'Reservation not found or already cancelled.';
        } else {
          this.errorMessage = 'An unexpected error occurred while cancelling the reservation.';
        }
      }
    });
  }

  editReservation(reservation: any) {
    // نسخ الحجز عشان نعدل فيه بدون ما نغير النسخة الأصلية مباشرةً
    this.editingReservation = { ...reservation };
    // تحويل التواريخ لنموذج مناسب (input[type=date] يقبل yyyy-MM-dd)
    this.editingReservation.checkInDate = this.formatDateForInput(this.editingReservation.checkInDate);
    this.editingReservation.checkOutDate = this.formatDateForInput(this.editingReservation.checkOutDate);
  }

  cancelEdit() {
    this.editingReservation = null;
  }

updateReservation() {
  if (!this.editingReservation) return;

  // فك تشفير التوكن عشان تجيب userId (نفترض JWT)
  const token = localStorage.getItem('token');
  const UserId = localStorage.getItem('userId');



  if (!UserId) {
    this.errorMessage = 'User is not authenticated properly.';
    return;
  }

  // تحضير بيانات التحديث مع userId من التوكن
  const updateData = {
    roomId: this.editingReservation.roomId,
    checkInDate: this.editingReservation.checkInDate,
    checkOutDate: this.editingReservation.checkOutDate,
    userId: UserId
  };

  const headers = new HttpHeaders().set('Authorization', 'Bearer ' + token);

  this.http.put(`http://localhost:5298/api/reservation/user/${this.editingReservation.resevationId}`, updateData, { headers })
    .subscribe({
      next: () => {
        alert('Reservation updated successfully.');
        this.editingReservation = null;
        this.loadReservations();
        this.errorMessage = '';
      },
     error: (err) => {
  console.error('Error updating reservation:', err);
  if (err.error) {
    if (typeof err.error === 'string') {
      this.errorMessage = err.error;  // رسالة نصية بسيطة من السيرفر
    } else if (err.error.message) {
      this.errorMessage = err.error.message;  // رسالة من كائن يحتوي على خاصية message
    } else if (Array.isArray(err.error)) {
      this.errorMessage = err.error.join(', '); // لو في مصفوفة من الأخطاء
    } else {
      this.errorMessage = 'Failed to update the reservation due to server error.';
    }
  } else {
    this.errorMessage = 'Failed to update the reservation.';
  }
}

    });
}


  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
