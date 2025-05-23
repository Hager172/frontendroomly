import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-allrooms',
  imports: [RouterModule,CommonModule,FormsModule],
  templateUrl: './allrooms.component.html',
  styleUrl: './allrooms.component.css'
})
export class AllroomsComponent implements OnInit {

    rooms: any[] = [];
      selectedRoom: any = null;
      editRoom: any = null;
      selectedMainImageFile: File | null = null;
selectedGalleryFiles: File[] = [];
errorMessage: string = '';




  constructor(private http: HttpClient,private router:Router) {}

  ngOnInit(): void {
    this.loadAllRooms();  // لما الصفحة تفتح تعرض كل الغرف
  }

  loadAllRooms() {
    this.http.get<any[]>('http://localhost:5298/api/Room/GetRooms').subscribe({
      next: (data) => {
        this.rooms = data;
        console.log(data);
      },
      error: (err) => {
        console.error('Error loading all rooms:', err);
      }
    });
  }


  viewDetails(roomId:string){

    this.http.get(`http://localhost:5298/api/Room/${roomId}`).subscribe({
    next: (data) => {
      this.selectedRoom = data;
      console.log('User details:', data);
        const bootstrap = (window as any).bootstrap;
const modal = new bootstrap.Modal(document.getElementById('userDetailsModal'));
modal.show();

    },
    error: (err) => {
      console.error('Error loading room details', err);
    }
  });


  }

  openEditModal(roomId: string) {
  this.http.get(`http://localhost:5298/api/Room/${roomId}`).subscribe({
    next: (data) => {
      this.editRoom = { ...data }; // نعمل نسخة من البيانات عشان التعديل بدون التأثير على الأصل
      console.log('Room data for edit:', this.editRoom);
      const bootstrap = (window as any).bootstrap;
      const modal = new bootstrap.Modal(document.getElementById('editRoomModal'));
      modal.show();
    },
    error: (err) => {
      console.error('Error loading room data for edit', err);
    }
  });
}

closeEditModal() {
  this.editRoom = null;
}

onSubmitEdit() {
  if (!this.editRoom) return;

  const formData = new FormData();
  formData.append('RoomNumber', this.editRoom.roomNumber);
  formData.append('RoomTypeId', this.editRoom.roomTypeId.toString());

  if (this.selectedMainImageFile) {
    formData.append('MainImage', this.selectedMainImageFile);
  }

  if (this.selectedGalleryFiles.length > 0) {
    this.selectedGalleryFiles.forEach(file => {
      formData.append('GalleryImages', file);
    });
  }

  this.http.put(`http://localhost:5298/api/Room/${this.editRoom.roomId}`, formData).subscribe({
    next: () => {
      alert('Room updated successfully!');
      this.closeEditModal();
      this.loadAllRooms(); // إعادة تحميل الغرف بعد التعديل
    },
    error: (err) => {
      console.error('Error updating room', err);
    }
  });
}
  onMainImageSelected(event: any) {
  this.selectedMainImageFile = event.target.files[0];
}

onGalleryImagesSelected(event: any) {
  this.selectedGalleryFiles = Array.from(event.target.files);
}
deleteRoom(roomId: string) {
  if (!confirm('Are you sure you want to delete this room?')) {
    return; // If user clicks cancel, do nothing
  }

  this.http.delete(`http://localhost:5298/api/Room/${roomId}`).subscribe({
    next: () => {
      alert('Room deleted successfully!');
      this.loadAllRooms(); // Reload rooms list after deletion
    },
error: (err) => {
  console.error('Error deleting the room', err);

  if (err.error && typeof err.error === 'object' && err.error.errors) {
    let messages = [];
    for (const key in err.error.errors) {
      if (err.error.errors.hasOwnProperty(key)) {
        messages.push(`${key}: ${err.error.errors[key].join(', ')}`);
      }
    }
    this.errorMessage = 'The following errors occurred:\n' + messages.join('\n');
  }
  else if (err.error && typeof err.error === 'object' && err.error.title) {
    this.errorMessage = 'Error: ' + err.error.title;
  }
  else if (err.error && typeof err.error === 'string') {
    this.errorMessage = err.error;  // هنا بنعرض رسالة الخطأ النصية مباشرة
  }
  else {
    this.errorMessage = 'An unexpected error occurred while deleting the room.';
  }
}


  });
}

}
