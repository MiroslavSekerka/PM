import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { addIcons } from 'ionicons';
import { 
  flash, 
  fingerPrint, 
  time, 
  planet, 
  statsChart, 
  trendingUp, 
  handLeft, 
  pulse, 
  calendar, 
  layers, 
  settings, 
  refresh,
  sunny,
  radio,
  planetOutline,
  nuclear,
  arrowUp,
  checkmark
} from 'ionicons/icons';

addIcons({
  'flash': flash,
  'finger-print': fingerPrint,
  'time': time,
  'planet': planet,
  'stats-chart': statsChart,
  'trending-up': trendingUp,
  'hand-left': handLeft,
  'pulse': pulse,
  'calendar': calendar,
  'layers': layers,
  'settings': settings,
  'refresh': refresh,
  'sunny': sunny,
  'radio': radio,
  'planet-outline': planetOutline,
  'nuclear': nuclear,
  'arrow-up': arrowUp,
  'checkmark': checkmark
});


bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
  ],
});
