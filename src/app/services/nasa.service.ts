import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';

export interface NasaApod {
  title: string;
  explanation: string;
  url: string;
  date: string;
  media_type: string;
  hdurl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NasaService {
  private readonly NASA_API_URL = 'https://api.nasa.gov/planetary/apod';
  private readonly API_KEY = 'DEMO_KEY';
  
  private cachedData: NasaApod | null = null;
  private cacheDate: string | null = null;

  constructor(private http: HttpClient) {}

  getAstronomyPictureOfTheDay(): Observable<NasaApod | null> {
    const today = new Date().toISOString().split('T')[0];
    
    if (this.cachedData && this.cacheDate === today) {
      console.log('Používám cached NASA data');
      return of(this.cachedData);
    }

    console.log('Stahuji nová NASA data...');
    return this.http.get<NasaApod>(`${this.NASA_API_URL}?api_key=${this.API_KEY}`)
      .pipe(
        tap(data => {
          this.cachedData = data;
          this.cacheDate = today;
          console.log('NASA data úspěšně stažena:', data.title);
        }),
        catchError(error => {
          console.error('Chyba při stahování NASA dat:', error);
          return of({
            title: 'Vesmírný fakt:',
            explanation: 'Právě teď nemůžeme získat data z NASA API. Zkus to později!',
            url: '',
            date: today,
            media_type: 'image'
          } as NasaApod);
        })
      );
  }
}