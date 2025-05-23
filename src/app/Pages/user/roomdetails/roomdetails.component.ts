import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';

@Component({
  selector: 'app-roomdetails',
  imports: [RouterModule,CommonModule],
  templateUrl: './roomdetails.component.html',
  styleUrl: './roomdetails.component.css'
})
export class RoomdetailsComponent {
  roomId!:number;
 roomDetails:any;

  constructor(private http :HttpClient,private route:ActivatedRoute){}

  ngOnInit(): void {

    this.roomId= +this.route.snapshot.paramMap.get('id')!;

     this.http.get(`http://localhost:5298/api/Room/${this.roomId}`).subscribe({

      next:(data)=>{

        this.roomDetails=data;
        console.log(data);
      },
      error:(err)=>{


         console.error('Error loading room details:', err);
      }
    })
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

  }

}
