import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './Layouts/auth-layout/auth-layout.component';
import { UserLayoutComponent } from './Layouts/user-layout/user-layout.component';
import { LoginComponent } from './Pages/login/login.component';
import { RegesterComponent } from './Pages/regester/regester.component';
import { HomeComponent } from './Pages/home/home.component';
import { authGuard } from './guard/auth.guard';
import { RoomsComponent } from './Pages/user/rooms/rooms.component';
import { RoomdetailsComponent } from './Pages/user/roomdetails/roomdetails.component';
import { FavouriteComponent } from './Pages/user/favourite/favourite.component';
import { ReserveRoomComponent } from './Pages/user/reserve-room/reserve-room.component';
import { MyReservationsComponent } from './Pages/user/my-reservations/my-reservations.component';
import { AllusersComponent } from './Pages/Admin/allusers/allusers.component';
import { AllroomsComponent } from './Pages/Admin/allrooms/allrooms.component';
import { RoomTypesComponent } from './Pages/Admin/room-types/room-types.component';
import { ReservationComponent } from './Pages/Admin/reservation/reservation.component';

export const routes: Routes = [


  {path:'',component:AuthLayoutComponent,
    children:[
      {path:'',redirectTo:'login',pathMatch:'full'},
      {path:'login',component:LoginComponent},
      {path:'regester',component:RegesterComponent}

    ]
  },
  {path:'user',component:UserLayoutComponent,
    children:[
     { path:'home',component:HomeComponent,
      canActivate:[authGuard]
     },
     {path:'rooms', component:RoomsComponent},
     {path:'room/:id', component:RoomdetailsComponent},
     {path:'favourite',component:FavouriteComponent},
     {path:'reserve',component:ReserveRoomComponent},
     {path:'my-reservations',component:MyReservationsComponent},
{ path: 'user/admin/allusers', component: AllusersComponent },
{ path: 'user/admin/allrooms', component: AllroomsComponent },
{path:'user/admin/alltypes',component:RoomTypesComponent},
{path:'user/admin/reservation',component:ReservationComponent}


    ]
  }


];
