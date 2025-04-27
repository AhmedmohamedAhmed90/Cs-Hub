<<<<<<< HEAD
import { ApplicationConfig } from '@angular/core';
=======
import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
>>>>>>> 245fdfc50bc13183d5b30f360cba8c44c74fe1aa
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
<<<<<<< HEAD

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient()
=======
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    importProvidersFrom(HttpClientModule)
>>>>>>> 245fdfc50bc13183d5b30f360cba8c44c74fe1aa
  ]
};
