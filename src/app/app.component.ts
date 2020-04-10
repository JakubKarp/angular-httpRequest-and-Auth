import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firebase } from '../../firebase/firebase';
import { map} from 'rxjs/operators';
import { Post } from './post.model'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];
  isFetching = false;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPost()
  }

  onCreatePost(postData: Post) {
    // console.log(postData);

    // Send Http request
    this.http
      .post<{name: string}>(
        `${firebase}/post.json`,
        postData
      )
      // request will be only sended if you subscribe
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  onFetchPosts() {
    this.fetchPost()
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPost() {
    this.isFetching = true;
    this.http
    .get<{[key: string]: Post}>(`${firebase}/post.json`)
    // to change json to array - pipe
    .pipe(map(responseData => {
    // można tu przekazać typy, ale też wyżej, zaraz za get
    // .pipe(map((responseData: {[key: string]: Post }) => {
      const postsArray: Post[] = [];
      for (const key in responseData) {
        if(responseData.hasOwnProperty(key)) {
          postsArray.push({ ...responseData[key], id: key })
        }
      }
      return postsArray
    }))
    // request will be only sended if you subscribe
    .subscribe(posts => {
      console.log(posts);
      this.isFetching = false;
      this.loadedPosts = posts;
    })
  };


}
