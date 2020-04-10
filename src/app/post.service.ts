import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

import { firebase } from '../../firebase/firebase';
import { Post } from './post.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    const postData: Post = { title, content };
    this.http
      .post<{ name: string }>(`${firebase}/post.json`, postData)
      // request will be only sended if you subscribe
      // where subscribie? fetchPost is subscribed in app.component - there is something with data 
      // here is nothing to do with data.
      // you have to subscribe where you need handle data/response
      .subscribe((responseData) => {
        console.log(responseData);
      });
  }

  fetchPost() {
    return (
      this.http
        .get<{ [key: string]: Post }>(`${firebase}/post.json`)
        // to change json to array - pipe
        .pipe(
          map((responseData) => {
            // można tu przekazać typy, ale też wyżej, zaraz za get
            // .pipe(map((responseData: {[key: string]: Post }) => {
            const postsArray: Post[] = [];
            for (const key in responseData) {
              if (responseData.hasOwnProperty(key)) {
                postsArray.push({ ...responseData[key], id: key });
              }
            }
            return postsArray;
          })
        )
    );
  }
}
