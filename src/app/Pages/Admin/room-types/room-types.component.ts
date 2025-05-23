import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
declare var bootstrap: any;
interface RoomType {
  roomTypeId: number;
  name: string;
  description?: string;
  price: number;
}
@Component({
  selector: 'app-room-types',
  imports: [FormsModule,CommonModule,RouterModule],
  templateUrl: './room-types.component.html',
  styleUrl: './room-types.component.css'
})

export class RoomTypesComponent implements OnInit{
   roomTypes: RoomType[] = [];
  newRoomType: Partial<RoomType> = { price: 0 };
  editRoomType: RoomType | null = null;
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAllRoomTypes();
  }

  loadAllRoomTypes() {
    this.http.get<RoomType[]>('http://localhost:5298/api/RoomType').subscribe({
      next: (data) => {
        this.roomTypes = data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'Failed to load room types.';
        console.error(err);
      },
    });
  }

  openAddModal() {
    this.newRoomType = { price: 0 };
    this.errorMessage = '';
    const bootstrap = (window as any).bootstrap;
    const modal = new bootstrap.Modal(document.getElementById('addRoomTypeModal'));
    modal.show();
  }

  onSubmitAdd() {
    this.http.post('http://localhost:5298/api/RoomType', this.newRoomType).subscribe({
      next: () => {
        alert('Room type added successfully!');
        this.loadAllRoomTypes();
        this.closeAddModal();
      },
      error: (err) => {
        this.handleError(err);
      },
    });
  }

  closeAddModal() {
    const modalEl = document.getElementById('addRoomTypeModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  openEditModal(roomType: RoomType) {
    this.editRoomType = { ...roomType };
    this.errorMessage = '';
    const bootstrap = (window as any).bootstrap;
    const modal = new bootstrap.Modal(document.getElementById('editRoomTypeModal'));
    modal.show();
  }

  onSubmitEdit() {
    if (!this.editRoomType) return;

    this.http
      .put(`http://localhost:5298/api/RoomType/${this.editRoomType.roomTypeId}`, this.editRoomType)
      .subscribe({
        next: () => {
          alert('Room type updated successfully!');
          this.loadAllRoomTypes();
          this.closeEditModal();
        },
        error: (err) => {
          this.handleError(err);
        },
      });
  }

  closeEditModal() {
    const modalEl = document.getElementById('editRoomTypeModal');
    const modal = (window as any).bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }

  deleteRoomType(roomTypeId: number) {
    if (!confirm('Are you sure you want to delete this room type?')) return;

    this.http.delete(`http://localhost:5298/api/RoomType/${roomTypeId}`).subscribe({
      next: () => {
        alert('Room type deleted successfully!');
        this.loadAllRoomTypes();
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
