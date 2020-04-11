import { PostService } from "./post.service";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { firebase } from "../../firebase/firebase";

import { Post } from "./post.model";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts = [];
  isFetching = false;
  error = null;
  private errorSub: Subscription;

  // tslint:disable-next-line: no-shadowed-variable
  constructor(private http: HttpClient, private PostService: PostService) {}

  ngOnInit() {
    // jeśli w service mamy eror z Subject() tu go instalujemy tak:
    // a potem trzeba zdrobić destroy subscription - na samym dole klasy
    this.errorSub = this.PostService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });

    this.isFetching = true;
    this.PostService.fetchPost().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }

  onCreatePost(postData: Post) {
    this.PostService.createAndStorePost(postData.title, postData.content);
  }

  onFetchPosts() {
    this.isFetching = true;
    this.PostService.fetchPost().subscribe(
      (posts) => {
        this.isFetching = false;
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }

  onClearPosts() {
    this.PostService.deleteAllPosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy() {
    this.errorSub.unsubscribe();
  }
}
