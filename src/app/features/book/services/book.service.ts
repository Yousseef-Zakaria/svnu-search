import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BookDetails, BookPage } from '../models/book.models';
import { environment } from '../../../config/env';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly BASE_URL = environment.apiUrl; // Replace with your actual FastAPI/Node.js endpoint
  private readonly apiUrl = `${this.BASE_URL}/api/books`; // Replace with your actual FastAPI/Node.js endpoint

  /**
   * Fetches all pages for a given file_id, sorted by page_number.
   */
  getBookPages(fileId: string): Observable<BookDetails> {
    return this.http.get<BookDetails>(`${this.apiUrl}/${fileId}/pages`);
  }

  getBookDetails(fileId: string): Observable<BookDetails> {
    return this.http.get<BookDetails>(`${this.apiUrl}/${fileId}`);
  }
}
