import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth-data.model";
import { AuthDataLogin } from "./auth-data-login.model";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private isAuthenticated = false;
  private token: string | null;
  tokenTimer: any;
  private userId: string | null;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {

  }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string | number | string[] | undefined, password: string | number | string[] | undefined,
     name: string | number | string[] | undefined, surname: string | number | string[] | undefined) {
    const authData: AuthData = {email: email, password: password, name: name, surname: surname};
    this.http.post('http://localhost:3000/api/user/signupExpress', authData)
    .subscribe(() =>{
      this.router.navigate(["/"]);
    }, error => {
      this.authStatusListener.next(false);
    })
  }

  login(email: string | number | string[] | undefined, password: string | number | string[] | undefined) {
    const authDataLogin: AuthDataLogin = {email: email, password: password}
    this.http.post<{token: string, expiresIn: number, userId: string}>('http://localhost:3000/api/user/loginExpress',
    authDataLogin)
      .subscribe(response => {
        const token = response.token;
        this.token = token;
        if(token) {
          const expiresInDuraction = response.expiresIn;
          this.setAuthTimer(expiresInDuraction);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuraction * 1000);
          console.log(expirationDate);
          this.saveAuthData(token,expirationDate, this.userId)
          this.router.navigate(['/']);
          clearTimeout(this.tokenTimer);
          console.log(this.userId);
          this.router.navigate(['/main', this.userId]);
        }
      }, error=> {
        this.authStatusListener.next(false);
        console.log('wrong password or email');
      });
  }

  autoAuthUser() {
    const authInformation =  this.getAuthData();
    if(!authInformation) {

    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log(authInformation, expiresIn);
    if(expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(()=> {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationData: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationData.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userUd');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if(!token || !expirationDate) {
      return;
    } else {
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId
      }
    }
  }
}
