import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, catchError, map, filter, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../config/env';
export interface AcademicDocument {
  id: string;
  title: string;
  course: string;
  department: string;
  academicYear: number;
  fileId: string;
}

export interface SearchFilters {
  query: string;
  course: string | null;
  department: string | null;
  academicYear: number | null;
  semester: string | null;
}

// --- DTOs (Data Transfer Objects) ---
export interface SearchResultItem {
  doc_id: string;
  file_id: string;
  title: string;
  course: string;
  academic_year: string;
  semester: string;
  department: string;
  score: number;
  snippet: string;
}

export interface SearchApiResponse {
  status: string;
  query: string;
  results_found: number;
  data: SearchResultItem[];
}

@Injectable({
  providedIn: 'root',
})
export class Search {
  private readonly BASE_URL = environment.apiUrl;
  private readonly apiUrl = `${this.BASE_URL}/api/v1/search/`;
  private readonly http = inject(HttpClient);

  // FIX #2: Add an equality function. This prevents the signal from emitting
  // and triggering a new API call if the search term hasn't actually changed.
  readonly searchParams = signal<{ q: string; limit: number }>(
    { q: '', limit: 5 },
    { equal: (a, b) => a.q === b.q && a.limit === b.limit }
  );

  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly activeFilters = signal<SearchFilters>({
    query: '',
    course: null,
    department: null,
    academicYear: null,
    semester: null // Fixed typo
  });

  updateFilters(partialFilters: Partial<SearchFilters>): void {
    this.activeFilters.update(current => ({ ...current, ...partialFilters }));
  }

  // API Call Pipeline
  private readonly searchResults$ = toObservable(this.searchParams).pipe(
    filter(params => !!params.q.trim()),
    tap(() => {
      this.isLoading.set(true);
      this.error.set(null);
    }),
    switchMap(params => {
      const httpParams = new HttpParams()
        .set('q', params.q)
        .set('limit', params.limit);

      return this.http.get<SearchApiResponse>(this.apiUrl, { params: httpParams }).pipe(
        catchError(err => {
          this.error.set('حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة لاحقاً.');
          return of({ status: 'error', query: params.q, results_found: 0, data: [] } as SearchApiResponse);
        })
      );
    }),
    tap(() => this.isLoading.set(false))
  );

  readonly response = toSignal(this.searchResults$, {
    initialValue: { status: 'idle', query: '', results_found: 0, data: [] } as SearchApiResponse
  });

  // FIX #1: Apply the client-side filters directly to the API response data!
  readonly results = computed(() => {
    const apiDocs = this.response().data;
    const filters = this.activeFilters();

    return apiDocs.filter(doc => {
      // Note: Ensure your backend actually includes 'course', 'department', 'academicYear', and 'semester' in the returned data objects!
      const matchCourse = !filters.course || doc.course === filters.course;
      const matchDept = !filters.department || doc.department === filters.department;
      const matchYear = !filters.academicYear || String(doc.academic_year) === String(filters.academicYear);
      const matchSemester = !filters.semester || String(doc.semester) === filters.semester;

      return matchCourse && matchDept && matchYear && matchSemester;
    });
  });

  // Update total found to reflect the dynamically filtered array length
  readonly totalFound = computed(() => this.results().length);

  executeSearch(q: string, limit: number = 10): void {
    this.searchParams.set({ q, limit });
  }
}
