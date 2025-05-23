import { CommonModule } from '@angular/common';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-favourite',
  imports: [RouterModule,CommonModule],
  templateUrl: './favourite.component.html',
  styleUrl: './favourite.component.css'
})
export class FavouriteComponent {
 favorites :any[]=[];
 constructor(private http:HttpClient){}

 ngOnInit(): void {
 const token = localStorage.getItem('token');
 const headers= new HttpHeaders().set('Authorization', `Bearer ${token}`)
 this.http.get<any[]>('http://localhost:5298/api/Favorites', { headers }).subscribe({
      next: (data) => {
        this.favorites = data;
      },
      error: (err) => {
        console.error('Error loading favorites', err);
      }
    });
  }
  //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
  //Add 'implements OnInit' to the class.
removeFromFavorites(roomId: number) {
  const token = localStorage.getItem('token'); // أو sessionStorage حسب مكان التخزين عندك
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.delete(`http://localhost:5298/api/Favorites/${roomId}`, { headers }).subscribe({
    next: () => {
      this.favorites = this.favorites.filter(fav => fav.roomId !== roomId);
      alert('Room removed from favorites successfully!');
    },
    error: (err) => {
      console.error('Error removing favorite:', err);
      alert('Failed to remove room from favorites. Please try again.');
    }
  });
}



 }


