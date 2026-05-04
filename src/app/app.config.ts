import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { PreloadAllModules, provideRouter, withComponentInputBinding, withInMemoryScrolling, withPreloading, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { HttpClient, provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      // Enables smooth transitions between the Hero page and Search page
      withViewTransitions(),

      // Preloads lazy-loaded modules in the background after initial load
      withPreloading(PreloadAllModules),

      // Allows you to bind URL query params directly to @Input() if you want to refactor later
      withComponentInputBinding(),

      // Ensures the page scrolls back to top when navigating to /search
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled',
      })
    ),
    provideHttpClient(withFetch())
  ]
};
