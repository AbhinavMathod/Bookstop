import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import {Ip} from '../app/nav-bar/url'

const imageForm = new FormData();

export interface UserDetails {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  iat ?: number;
  exp ?: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  username: string;
  password: string;
  firstname?: string;
  lastname?: string;
  
}

export interface TokenPayload2 {
    isbn: number,
    title: string,
    quantity: number,
    price: number,
    username: string
}

export interface BookDetails {
  isbn: string,
  title: string,
  authors: string,
  publication_date: Date,
  quantity: number,
  price: number,
  seller_name: string,
  updatedAt: Date,
  file: object
}
export interface BookTokenPayload {
  id: number,
  isbn: string,
  title: string,
  authors: string,
  publication_date: Date,
  quantity: number,
  price: number,
  seller_name: string,
  updatedAt: Date
}

export interface cartDetails {
    isbn: number,
    title: string,
    quantity: number,
    price: number,
    username: string
}
export interface imageDetails {
  bookID : number,
  seller_name : string,
  key : string
}
export interface TokenPayload3 {
  username: string
}





@Injectable()
export class AuthenticationService {
  public rootURL = Ip.hosturl+'users';
  public FOLDER = './';
  sendEmailUrl = `/send`;
  sendEmailUrlReg = `/sendreg`;
  private token: string;

  constructor(private http: HttpClient, private router: Router) {}

  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
      return true;
    } else {
      return false;
    }
  }



  private request(method: 'post'|'get'|'put', type: 'signin'|'signup'|'profile'|'update'|'books', user?: TokenPayload,books?: TokenPayload2): Observable<any> {
    let base;

    if (method === 'post') {
      if(type === 'books') {
        base = this.http.post(this.rootURL + `/${type}`, user );
      }
      base = this.http.post(this.rootURL + `/${type}`, user);
    } 
    else if(method === 'put') {
      base = this.http.put(this.rootURL + `/${type}`, { headers: { 'x-access-token': this.getToken().substring(4)},user: user});
    }
    else {
      if(type === 'books')
      {
        base = this.http.get(this.rootURL + `/${type}`, { headers: { 'Authorization': this.getToken()}});

      }
      else
      {
      base = this.http.get(this.rootURL + `/${type}`, { headers: { 'x-access-token': this.getToken().substring(4)}});
      }
      
    }

    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );

    return request;
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'signup', user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'signin', user);
  }

  public profile(): Observable<any> {
    return this.request('get', 'profile');
  }



  public logout(): void {
    console.log(this.token);
    this.deletetoken();
    window.localStorage.removeItem('mean-token');
    this.router.navigateByUrl('/');
    this.token = '';
  }

  public update(user: TokenPayload): Observable<any> {
    return this.request('put', 'profile', user);
  }

  public getBooks(): Observable<any> {
    return this.request('get','books')
  }

  public addToCart(books: TokenPayload2) : Observable<any> {
    console.log(books);
    let content={
      headers:{
        'Authorization': this.getToken()
      },
    }
    console.log(content)
    return this.http.post(this.rootURL + `/orders`, books, content);
  }

  public getCart(): Observable<any> {
    //debugger;
    //console.log(books);
    let content={
      headers:{
        'Authorization': this.getToken()
      },
      
    }
    //console.log(content)
    return this.http.get(this.rootURL + `/orders`,content);
  }

  public getMyBooks(books: TokenPayload3): Observable<any> {
    //debugger;
    console.log(books);
    let content={
      headers:{
        'Authorization': this.getToken()
      },
      books:books.username
    }
    console.log(content);
    //debugger;
    return this.http.get(this.rootURL + `/mybooks`,content);
  }

  public addBooks(books : BookDetails): Observable<any>{
    let content={
      headers:{
        'Authorization': this.getToken()
      },
    }
    console.log(books);
    return this.http.post(this.rootURL + `/create`, books, content);

  }

  updatebook(updatedbook: BookTokenPayload): Observable<any> {
    let content={
      headers:{
        'Authorization': this.getToken()
      },
    }
    return this.http.put(this.rootURL+`/books/${updatedbook.id}`, updatedbook,content)
  }
  public deletebook(book : BookTokenPayload): Observable<any> {
    //debugger;
    //console.log(books);
    let content={
      headers:{
        'Authorization': this.getToken()
      },
      body:{
        book
      }
      
    }
    //console.log(content)
    return this.http.delete(this.rootURL + `/books/${book.id}`,content);
  }

  public deleteimage(key : string): Observable<any>{
    let content={
      headers:{
        'Authorization': this.getToken()
      },
        body :{
          key
        }
      }

    return this.http.delete(this.rootURL + `/deleteimage`,content);
  }

  public insertimage(image : imageDetails): Observable<any>{

    return this.http.post(this.rootURL + `/storeimage`,image);
  }

  public downloadimage(id : number): Observable<any>{
    let content={
      
        bookId : id
      
    }

    return this.http.post(this.rootURL + `/download`,content);
  }

  

  public getimages(): Observable<any>{
    let content={
      headers:{
        'Authorization': this.getToken()
      },
    }

    return this.http.get(this.rootURL + `/myimages`,content);
  }



  imageUpload(imageForm: FormData) {
    console.log('image uploading');
    console.log(imageForm);
    return this.http.post(this.rootURL+`/upload`, imageForm);
  }

  deletetoken()
  {
    this.http.delete(this.rootURL+`/logout`, { headers: { 'Authorization': this.getToken()}});
  }

  forgotpassword(user: String)
  {
    let forgotpayload = {
      username : user
    }
    console.log("forgot password running");
    console.log(forgotpayload);
    return this.http.post(this.rootURL+`/subscribe`,forgotpayload);
  }

}

  
  

  
