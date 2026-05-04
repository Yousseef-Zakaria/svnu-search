import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    // Lazy load the Home/Hero component
    loadComponent: () =>
      import('./features/hero/hero.component').then((m) => m.HeroComponent),
    title: 'الرئيسية | محرك البحث الأكاديمي',
  },
  {
    path: 'search',
    // Lazy load the feature search page
    loadComponent: () =>
      import('./features/searchPage/searchPage.component').then((m) => m.SearchPageComponent),
    title: 'نتائج البحث | محرك البحث الأكاديمي',
  },
  {
    path: 'book/:fileId',
    loadComponent : () => import('./features/book/components/book-viewer.component').then (m => m.BookViewerComponent),
    title : 'عرض الكتاب'
  }
];
