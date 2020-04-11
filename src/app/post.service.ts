import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';

import { firebase } from '../../firebase/firebase';
import { Post } from './post.model';
import { Subject, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostService {
  // żeby obsłużyć error tutaj (bo tu jest subscribe w createAndStorePost() )
  // trzeba użyć Subject()
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    // const postData: Post = { title: title, content: content };
    const postData: Post = { title, content };
    this.http
      .post<{ name: string }>(`${firebase}/post.json`, postData)
      // request will be only sended if you subscribe
      // where subscribie? fetchPost is subscribed in app.component - there is something with data
      // here is nothing to do with data.
      // you have to subscribe where you need handle data/response
      .subscribe(
        (responseData) => {
          console.log(responseData);
          // to handle error here use Subject()
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  fetchPost() {
    return (
      this.http
        .get<{ [key: string]: Post }>(
          `${firebase}/post.json`, // )
          // to co poniżej aż do .pipe jest opcjonalne
          // headers - nie zawsze musisz ich używać, są opcjonalne w zależności od potrzeb
          {
            headers: new HttpHeaders({ 'Custom-Header': 'Hello Header !!!' }),
            // parametry też są opcjonalne
            // czyli url/?print=pretty
            params: new HttpParams().set('print', 'pretty'),
            // można też dostać się do: body, response, events
            // w event można obserwować np. uploadProgres
            // if event.type === HttpEventType.UploadProgress
            observe: 'body',
            // można też zmieniać typ odpowiedzi (body) np. na 'text'
            // defaultowo to jest json - co mówi Angularowi, żeby wszystko zmieniać na jsona
            responseType: 'json',
          }
        )
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
          }),
          // onother method for errors
          catchError((errorRes) => {
            return throwError(errorRes);
          })
        )
    );
  }

  deleteAllPosts() {
    return this.http.delete(`${firebase}/post.json`);
  }
}
