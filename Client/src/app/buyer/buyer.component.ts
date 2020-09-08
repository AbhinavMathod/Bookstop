import { Component, OnInit } from '@angular/core';
import { AuthenticationService, BookDetails,TokenPayload,UserDetails,cartDetails } from '../authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-buyer',
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss']
})
export class BuyerComponent implements OnInit {
books : BookDetails;
details: UserDetails;
cart : cartDetails;
quantity : number;
deleteclick : boolean;
selectedFiles: FileList;
imageObj: File;
imageUrl: string;
s3Book : string;
s3ID : object;
uploadInput;
state;
myvar : object[];
imageArray;
viewclick : Boolean;
finalImage : String;
  constructor(private auth: AuthenticationService,private router: Router) { }
  
  ngOnInit(): void {
    this.auth.getBooks().subscribe(books =>{
        books.sort(this.GetSortOrder("quantity"));
        books.sort(this.GetSortOrder("price"));
        this.books = books;
        console.log(this.books);
    } )

    this.auth.profile().subscribe(user => {
      this.details = user;
    }, (err) => {
      console.error(err);
    });
  }
  addtocart(book){
    if(book.quantity<1)
    {
      alert("out of stock");
    }
    else if(book.quantity < this.quantity)
    {
      alert("Insufficient Stock!");
    }
    else if(this.quantity<1)
    {
      alert("Please choose a valid quantity!");
    }
    else
    {
    let subCart = {
      isbn: Number(book.isbn),
      title: book.title,
      quantity: this.quantity,
      price: book.price,
      username: this.details.username
      
    }
    this.cart = subCart;
    console.log(this.cart);
    
    // this.cart.product_title = book.title;
    // this.cart.username = this.details.username;
    // this.cart.user_id = this.details.id;
    // this.cart.Quantity = 1;
    this.auth.addToCart(this.cart).subscribe(() => {
      //this.router.navigateByUrl('app-login');
      alert("Order added successfully.")
      //debugger;
    }, (err) => {
      console.log(err);
    });
  }
  }
  setQuantity(quantity){
    this.quantity = quantity;
    console.log(this.quantity);

  }

  GetSortOrder(prop) {    
    return function(a, b) {    
        if (a[prop] > b[prop]) {    
            return 1;    
        } else if (a[prop] < b[prop]) {    
            return -1;    
        }    
        return 0;    
    } 
  }   

  loadimage(book){
    this.auth.downloadimage(book.id).subscribe((res: Response) => {
      var repsonse : any;
      repsonse = res;
      this.myvar = [{
        "id": book.id,
        "image": repsonse.att
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

}
