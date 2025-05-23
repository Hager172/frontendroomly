import { Component } from '@angular/core';
import { UserNavComponent } from "../../Component/user-nav/user-nav.component";
import { UserFooterComponent } from "../../Component/user-footer/user-footer.component";
import { HomeComponent } from "../../Pages/home/home.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  imports: [UserNavComponent, UserFooterComponent,RouterOutlet],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {

}
