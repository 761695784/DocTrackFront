// import { ApplicationConfig, isDevMode } from '@angular/core';
// import { provideRouter } from '@angular/router';
// import { provideHttpClient, withFetch } from '@angular/common/http';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
// import { routes } from './app.routes';
// import { provideServiceWorker } from '@angular/service-worker';

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(withFetch()), // Activation du Fetch API
//     provideAnimationsAsync() // Animations asynchrones
//     ,
//     provideServiceWorker('ngsw-worker.js', {
//         enabled: !isDevMode(),
//         registrationStrategy: 'registerWhenStable:30000'
//     })
// ]
// };

import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

// Import des fonctions Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA33hvQIPjukBW3j8TQG10l6vBqJt8OZOg",
  authDomain: "doctrack-3c10c.firebaseapp.com",
  projectId: "doctrack-3c10c",
  storageBucket: "doctrack-3c10c.firebasestorage.app",
  messagingSenderId: "884441074397",
  appId: "1:884441074397:web:716c49f654f790ad63e934",
  measurementId: "G-19M6VJD6S7"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()), // Activation du Fetch API
    provideAnimationsAsync(), // Animations asynchrones
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),

    // Configuration de Firebase
    provideFirebaseApp(() => initializeApp(firebaseConfig)), // Initialisation de Firebase
    provideAuth(() => getAuth()), // Initialisation de Firebase Auth
    provideAnalytics(() => getAnalytics()), // Initialisation de Firebase Analytics
  ]
};