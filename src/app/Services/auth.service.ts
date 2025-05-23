import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

interface LoginResponse {
  userId: string;
  email: string;
  fullName: string;
  token: string;
}

interface regester{
email:string,
  fullName: string,
  token: string;

}

@Injectable({
      providedIn: 'root'
})
export class  AuthService{
    private apiurl="http://localhost:5298/api";

    constructor(private http:HttpClient){}

login(email:string,password:string):Observable<LoginResponse>{

    return this.http.post<LoginResponse>(`${this.apiurl}/Account/login`,{email,password})




}


register(userData: any): Observable<regester> {
  return this.http.post<regester>(`${this.apiurl}/Account/register`, userData);
}

}
