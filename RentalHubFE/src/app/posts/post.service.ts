import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, catchError, tap } from 'rxjs';
import { PostItem } from './posts-list/post-item/post-item.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { resDataDTO } from '../shared/resDataDTO';
import { environment } from 'src/environments/environment';
import {
  Pagination,
  PaginationService,
} from '../shared/pagination/pagination.service';
import { handleError } from '../shared/handle-errors';
import { NotifierService } from 'angular-notifier';
import { Tags } from '../shared/tags/tag.model';

@Injectable({ providedIn: 'root' })
export class PostService {
  postListChanged = new Subject<PostItem[]>();
  posts: PostItem[] = [];
  searchResultsChanged = new Subject<PostItem[]>();
  searchResult: PostItem[] = [];
  searchKeyword: string = '';
  searchKeywordChanged = new Subject<string>();

  private currentTags = new BehaviorSubject<Tags[]>([]);

  private currentChosenTags = new BehaviorSubject<Tags[]>([]);

  constructor(
    private http: HttpClient,
    private paginationService: PaginationService,
    private notifierService: NotifierService
  ) {}

  getPostList(page: number, limit: number) {
    const queryParams = { page: page, limit: limit };
    this.http
      .get<resDataDTO>(environment.baseUrl + 'posts', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap(
          (res) => {
            this.posts = res.data;
            this.paginationService.pagination = res.data.pagination;
            this.paginationService.paginationChanged.next(res.pagination);
            this.postListChanged.next([...this.posts]);
          },
          (errMsg) => {
            this.notifierService.notify('error', errMsg);
          }
        )
      )
      .subscribe();

    return this.posts.slice();
  }

  getPostItem(postId: string) {
    console.log('On getting post detail with postId: ' + postId);
    let queryParams = new HttpParams().append('postId', postId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/get-post', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  createPost(form: any, images: FileList, selectedTags: any) {
    let body = new FormData();
    body.append('_title', form.title);
    body.append('_desc', form.desc);
    body.append('_content', form.content);
    body.append('_street', form.street);
    body.append('_district', form.district);
    body.append('_area', form.area);
    body.append('_price', form.renting_price);
    body.append('_electricPrice', form.electric);
    body.append('_waterPrice', form.water_price);
    body.append('_services', form.services);
    body.append('_ultilities', form.utilities);
    const numberOfImages = images.length;
    for (let i = 0; i < numberOfImages; i++) {
      const reader = new FileReader();
      reader.readAsDataURL(images[i]);
      body.append('_images', images[i]);
      // console.log(
      //   '🚀 ~ file: post.service.ts:85 ~ PostService ~ createPost ~ images[i]:',
      //   images[i]
      // );
    }
    if (selectedTags) {
      for (let tag of selectedTags) {
        body.append('_tags', tag._id);
      }
    }

    return this.http
      .post<resDataDTO>(environment.baseUrl + 'posts/create-post', body)
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Created post successfully...', res.data);
          }
        })
      );
  }

  updatePost(
    form: any,
    images: FileList,
    deletedImageIndexes: number[],
    selectedTags: any,
    postId: string
  ) {
    let body = new FormData();
    body.append('_title', form.title);
    body.append('_desc', form.desc);
    body.append('_content', form.content);
    body.append('_address', form.address);
    body.append('_area', form.area.toString());
    body.append('_price', form.renting_price.toString());
    body.append('_electricPrice', form.electric.toString());
    body.append('_waterPrice', form.water_price.toString());
    body.append('_services', form.services);
    body.append('_ultilities', form.ultilities);
    body.append('_street', form.street);
    body.append('_district', form.district);
    body.append('_city', form.city);

    if (images) {
      const numberOfImages = images.length;
      for (let i = 0; i < numberOfImages; i++) {
        const reader = new FileReader();
        reader.readAsDataURL(images[i]);
        body.append('_images', images[i]);
      }
    }

    if (selectedTags) {
      for (let tag of selectedTags) {
        body.append('_tags', tag._id);
      }
    }

    body.append('_deleteImages', deletedImageIndexes.toString());

    return this.http
      .patch<resDataDTO>(
        environment.baseUrl + 'posts/update-post/' + postId,
        body
      )
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Updated post successfully...', res.data);
          }
        })
      );
  }

  getPostsHistory(status: number, page: number, limit: number) {
    console.log('Geting posts history...');
    let queryParams = new HttpParams()
      .append('status', status)
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/history-post', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  getPostInspector(status: number, page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('status', status)
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(
        environment.baseUrl + 'posts/inspector-get-post-status',
        {
          params: queryParams,
        }
      )
      .pipe(catchError(handleError));
  }

  getPostAdmin(status: number, page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('status', status)
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/admin-get-post-list', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  getReportPostList(page: number, limit: number) {
    let queryParams = new HttpParams()
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/get-report-post', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  getReportPostById(pId: any) {
    console.log('🚀 ~ PostService ~ getReportPostById ~ pId:', pId);
    let queryParams = new HttpParams().append('postId', pId);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/get-report-post-id', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  sensorPost(postId: string, status: number) {
    return this.http
      .patch<resDataDTO>(environment.baseUrl + 'posts/sensor-post/' + postId, {
        _status: status,
      })
      .pipe(catchError(handleError));
  }

  removePost(reportId: string) {
    return this.http
      .patch<resDataDTO>(
        environment.baseUrl + 'posts/sensor-post-reported/' + reportId,
        {}
      )
      .pipe(catchError(handleError));
  }

  getPostsHistoryOfAUser(uId: string, page: number, limit: number) {
    console.log('Geting posts history...');
    let queryParams = new HttpParams()
      .append('uId', uId)
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/view-post-user', {
        params: queryParams,
      })
      .pipe(catchError(handleError));
  }

  searchPostsByKeyword(keyword: string, page: number, limit: number) {
    console.log('On searching posts by keyword...', keyword);
    let queryParams = new HttpParams()
      .append('search', keyword)
      .append('page', page)
      .append('limit', limit);
    this.searchKeyword = keyword;
    this.searchKeywordChanged.next(this.searchKeyword);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/search-post', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          this.searchResult = res.data;
          this.searchResultsChanged.next([...this.searchResult]);
          this.paginationService.pagination = res.pagination;
          if (res.data) {
            console.log('Search results: ', res.data);
          }
        })
      );
  }

  updatePostStatus(postId: string, status: boolean) {
    console.log('On deactivating post has id: ', postId);
    return this.http
      .patch<resDataDTO>(
        environment.baseUrl + 'posts/update-post-status/' + postId,
        {
          _active: status,
        }
      )
      .pipe(catchError(handleError));
  }

  searchPostByTags(tags: [string], page: number, limit: number) {
    console.log('On searching posts by tags...');

    let queryParams = new HttpParams()
      .append('tags', tags.join())
      .append('page', page)
      .append('limit', limit);
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/search-post-tags', {
        params: queryParams,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Search results: ', res.data);
          }
        })
      );
  }

  setCurrentTags(updatedTags: Tags[]) {
    this.currentTags.next(updatedTags);
  }

  getCurrentTags = this.currentTags.asObservable();

  setCurrentChosenTags(updatedChosenTags: Tags[]) {
    this.currentChosenTags.next(updatedChosenTags);
  }

  getCurrentChosenTags = this.currentChosenTags.asObservable();

  getAllTags() {
    return this.http
      .get<resDataDTO>(environment.baseUrl + 'posts/get-tags')
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            this.setCurrentTags(res.data);
          }
        })
      );
  }

  createTag(tag: string) {
    return this.http
      .post<resDataDTO>(environment.baseUrl + 'posts/create-tag', {
        _tag: tag,
      })
      .pipe(
        catchError(handleError),
        tap((res) => {
          if (res.data) {
            console.log('Created tag successfully...', res.data);
          }
        })
      );
  }
}
