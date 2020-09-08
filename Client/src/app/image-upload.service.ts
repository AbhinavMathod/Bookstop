import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {
  public rootURL = 'http://localhost:3000/users';
  constructor(private http: HttpClient) {
    
  }
  
}
