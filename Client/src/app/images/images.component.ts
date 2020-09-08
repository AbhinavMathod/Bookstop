import { Component, OnInit } from '@angular/core';
import { AuthenticationService, BookDetails,TokenPayload,UserDetails,cartDetails,BookTokenPayload,imageDetails} from '../authentication.service';
import {Router} from '@angular/router';
import { ImageUploadService } from './../image-upload.service';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.scss']
})
export class ImagesComponent implements OnInit {
  books : BookDetails;
  images : imageDetails;
  details : UserDetails;
  constructor(private auth: AuthenticationService,private router: Router,private img: ImageUploadService,private http: HttpClient) { }

  ngOnInit(): void {
    this.auth.getBooks().subscribe(books =>{
      this.books = books;
      console.log(this.books);
     });

    this.auth.getimages().subscribe(images =>{
    this.images = images;
    console.log(this.books);
    });

    this.auth.profile().subscribe(user => {
    this.details = user;
    }, (err) => {
  console.error(err);
    });

  }

  deleteimage(image){
    this.auth.deleteimage(image.key).subscribe((res : Response) => {
      console.log(res);
    })
 }

  


}
