import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
interface ReservationDto {
  resevationId: number;
  checkInDate: string;   // أو Date، بس في العادة نستخدم string للتاريخ من API
  checkOutDate: string;
  roomId: number;
  roomNumber: string;
  userId: string;
  userName: string;
}

interface ReservationCreateDto {
  checkInDate: string;
  checkOutDate: string;
  roomId: number;
  userId: string;
}
@Component({
  selector: 'app-reservation',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './reservation.component.html',
  styleUrl: './reservation.component.css'
})
export class ReservationComponent implements OnInit {
reservations: ReservationDto[] = [];
  newReservation: Partial<ReservationCreateDto> = {};
  editReservation: ReservationDto | null = null;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAllReservations();
  }

  loadAllReservations() {
    this.http.get<ReservationDto[]>('http://localhost:5298/api/Reservation').subscribe({
      next: (data) => {
        this.reservations = data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to load reservations.';
        console.error(err);
      },
    });
  }

  openAddModal() {
    this.newReservation = {};
    this.errorMessage = '';
    const bootstrap = (window as any).bootstrap;
    const modal = new bootstrap.Modal(document.getElementById('addReservationModal'));
    modal.show();
  }

  onSubmitAdd() {
    this.http.post('http://localhost:5298/api/Reservation', this.newReservation).subscribe({
      next: () => {
        alert('Reservation added successfully!');
        this.loadAllReservations();
        this.closeAddModal();
      },
      error: (err) => {
        this.handleError(err);
      },
    });
  }

  closeAddModal() {
    const modalEl = document.getElementById('addReservationModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  openEditModal(reservation: ReservationDto) {
    this.editReservation = { ...reservation };
    this.errorMessage = '';
    const bootstrap = (window as any).bootstrap;
    const modal = new bootstrap.Modal(document.getElementById('editReservationModal'));
    modal.show();
  }

  onSubmitEdit() {
    if (!this.editReservation) return;

    this.http
      .put(`http://localhost:5298/api/Reservation/${this.editReservation.resevationId}`, this.editReservation)
      .subscribe({
        next: () => {
          alert('Reservation updated successfully!');
          this.loadAllReservations();
          this.closeEditModal();
        },
        error: (err) => {
          this.handleError(err);
        },
      });
  }

  closeEditModal() {
    const modalEl = document.getElementById('editReservationModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  deleteReservation(resevationId: number) {
    if (!confirm('Are you sure you want to delete this reservation?')) return;

    this.http.delete(`http://localhost:5298/api/Reservation/${resevationId}`).subscribe({
      next: () => {
        alert('Reservation deleted successfully!');
        this.loadAllReservations();
      },
      error: (err) => {
        this.handleError(err);
      },
    });
  }

  private handleError(err: any) {
    console.error('API error:', err);
    if (err.error && err.error.errors) {
      const messages: string[] = [];
      for (const key in err.error.errors) {
        if (err.error.errors.hasOwnProperty(key)) {
          messages.push(`${key}: ${err.error.errors[key].join(', ')}`);
        }
      }
      this.errorMessage = 'The following errors occurred:\n' + messages.join('\n');
    } else if (err.error && typeof err.error === 'string') {
      this.errorMessage = err.error;
    } else if (err.error && err.error.title) {
      this.errorMessage = err.error.title;
    } else {
      this.errorMessage = 'An unexpected error occurred.';
    }
  }

}
