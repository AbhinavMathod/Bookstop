// @ts-ignore
import { Component, OnInit,AfterViewInit } from '@angular/core';
import { AuthenticationService, BookDetails,TokenPayload,UserDetails,cartDetails,BookTokenPayload,imageDetails} from '../authentication.service';
import {Router} from '@angular/router';
import { ImageUploadService } from './../image-upload.service';
import axios from 'axios';
import { HttpClient } from '@angular/common/http';
import {Ip} from './../nav-bar/url';
import * as moment from 'moment';
@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.scss']
})
export class SellerComponent implements OnInit{
  books : BookDetails;
  myimage : imageDetails;
  details : UserDetails;
  mynewbook : BookDetails;
  updatedbook : BookTokenPayload;
  newbook : BookTokenPayload[];
  deletebook : BookTokenPayload[];
  deleteclick : boolean;
  selectedFiles: FileList;
  imageObj: File;
  imageUrl: string;
  s3Book : string;
  s3ID : any;
  s3update :object;
  uploadInput;
  state;
  myvar : object[];
  imageArray;
  viewclick : Boolean;
  finalImage : String;
  constructor(private auth: AuthenticationService,private router: Router,private img: ImageUploadService,private http: HttpClient) { 
    this.state = {
      success : false,
      url : ""
    }
  }
  
  ngOnInit(): void {
    this.deleteclick = false;
    this.viewclick = false;
    this.auth.getBooks().subscribe(books =>{
      this.books = books;
      console.log(this.books);
  })

  

  this.auth.profile().subscribe(user => {
    this.details = user;
  }, (err) => {
    console.error(err);
  });

  }



addbook(isbn : string,title : string,authors : string,publication_date : Date,Quantity : number,price : number){
    
    if(Quantity<1 || Quantity >999)
    {
      alert("Add stock within range 1-999");
    }
    else if(price<1 || price >9999)
    {
      alert("Add price within range 0.01-9999.99")
    }
    else{
    const imageForm = new FormData();
    var publication_date_formatted : Date;
    publication_date_formatted = new Date();
    imageForm.append('image', this.imageObj);
    let newbook = {
    isbn : isbn,
    title : title,
    authors : authors,
    publication_date :publication_date_formatted,
    quantity : Quantity,
    price : price,
    seller_name : this.details.username,
    updatedAt: new Date(),
    file: imageForm

    }
    console.log(newbook);
    this.mynewbook = newbook;
    //imageForm.append('image', this.imageObj);
    this.auth.addBooks(this.mynewbook).subscribe((res: Response) => {
      //this.router.navigateByUrl('app-login');
      this.s3ID = res;
      //console.log(this.s3ID.id);
      alert("Order added successfully.")
      //debugger;
    }, (err) => {
      console.log(err);
    });
  
  }
}

  edit(book) {
    this.updatedbook = book
  }

  update() {
    console.log(this.updatedbook);
    this.updatedbook.updatedAt = new Date();
    if (this.updatedbook) {
      var cool : any;
      cool = this.s3ID;
      this.s3ID = this.updatedbook;
      //console.log(cool.id);
      this.auth.updatebook(this.updatedbook).subscribe(book => {
        const indexx = book ? this.newbook.findIndex(t => t.id === book.id) : -1
        if (indexx > -1) {
          this.newbook[indexx] = book
        }
      })
      this.updatedbook = undefined
    }
    else if(this.updatedbook==undefined){
      alert("Click on any one of the Todo Item to edit and update.")
    }
  }

  delete(book: BookTokenPayload): void {
    console.log(book);
    if(confirm("Are you Sure?"))
    {
    //this.deletebook = this.deletebook.filter(t => t !== book)
    this.auth.deletebook(book).subscribe()
    }
  }

  onImagePicked(event: Event): void {
    this.uploadInput = (event.target as HTMLInputElement)
    const FILE = (event.target as HTMLInputElement).files[0];
    this.imageObj = FILE;
    const imageForm = new FormData();
    imageForm.append('image', this.imageObj);
    console.log(imageForm);
  }

  // onImageUpload() {
  //   const imageForm = new FormData();
  //   imageForm.append('image', this.imageObj);
  //   this.auth.imageUpload(imageForm).subscribe(res => {
  //   this.imageUrl = res['image'];
  //   });
  // }
  handleUpload(){
    var cool2 : any;
    cool2 = this.s3ID;
    console.log(cool2.id);
    for(let i in this.uploadInput.files)
    {
    let file = this.uploadInput.files[i];
    // Split the filename to get the name and type
    let fileParts = this.uploadInput.files[i].name.split('.');
    let fileName = fileParts[0];
    let fileType = fileParts[1];
    console.log("Preparing the upload");
    axios.post(Ip.hosturl+"users/upload",{
      fileName : cool2.id+'/'+fileName,
      fileType : fileType
    })
    .then(response => {
      var returnData = response.data.data.returnData;
      var signedRequest = returnData.signedRequest;
      var url = returnData.url;
      console.log("Recieved a signed request " + signedRequest);
// Put the fileType in the headers for the upload
      var options = {
        headers: {
          'Content-Type': fileType
          }
      };
      this.s3Book = url.split("/",5)[3];
      axios.put(signedRequest,file,options)
      .then(result => {
        console.log("Response from s3")
        
      })
      .catch(error => {
        console.log("ERROR " + JSON.stringify(error.response));
      })
    })
    .catch(error => {
      alert(JSON.stringify(error));
    })
    let key = cool2.id+'/'+fileName;
    let myimage = {
      bookID : cool2.id,
      seller_name : this.details.username,
      key : key.toString()

    }
    this.auth.insertimage(myimage).subscribe((res: Response) => {
      console.log(res);
    })
  }
}

loadimage(book){
  this.auth.downloadimage(book.id).subscribe((res: Response) => {
    var response : any;
    response = res;
    this.myvar = [{
      "id": book.id,
      "image": response.att
    }]
    console.log(this.myvar)
    // this.imageArray.push({
    //   'id':book.id,
    //   'images': this.myvar
    // })
    // console.log(this.myvar);
    // var count = this.myvar.length;
    // var verify = 0;
    // this.myvar.map((e) => {
    //   console.log(e);
    //   this.finalImage = e;
    // })
  })
  // console.log(this.finalImage);
}


viewclicked(){
  this.viewclick = true;
}

convert(date)
{
  moment().format(date);

}



}


