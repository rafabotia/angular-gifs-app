import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interface';

@Injectable({providedIn: 'root'})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagHistory: string[] = [];
  private apiKey: string = 'iYIdRm4woV7a5TRIdNlb9Sz7NJrusnm7';
  private serviceUrl = 'http://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient) {
    this.loadLocalStorage();

    if (this._tagHistory.length === 0) return;
    this.searchTag( this._tagHistory[0] );

    console.log("Gifs Service Ready");
   }

  get tagHistory() {
    return [...this._tagHistory];
  }


  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if ( this._tagHistory.includes(tag) ) {
      this._tagHistory = this._tagHistory.filter( (oldTag) => oldTag !== tag );
    }

    this._tagHistory.unshift( tag );
    this._tagHistory = this.tagHistory.splice(0,10);

    this.saveLocalStorage();

  }

  private saveLocalStorage(): void {
    localStorage.setItem('history',JSON.stringify(this._tagHistory));
  }

  private loadLocalStorage(): void {
    if ( !localStorage.getItem('history') ) return;

    this._tagHistory = JSON.parse( localStorage.getItem('history')! );
  }

  // async searchTag( tag: string ):Promise<void> {

  //   if ( tag.length === 0 ) return;
  //   this.organizeHistory(tag);

  //   const resp = await fetch('http://api.giphy.com/v1/gifs/search?api_key=iYIdRm4woV7a5TRIdNlb9Sz7NJrusnm7&q=valorant&limit=10');

  //   const data = await resp.json();
  //   console.log(data);

  // }

  searchTag( tag: string ):void {

    if ( tag.length === 0 ) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey )
      .set('limit', '10' )
      .set('q', tag )

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
      .subscribe( resp => {

        this.gifList = resp.data;
        // console.log( { gifs: this.gifList });

      });

  }
}
