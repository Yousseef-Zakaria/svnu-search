import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../config/env';

// 1. Define the exact contract your backend expects
export interface UploadPdfRequest {
  file: File;
  title: string;
  course?: string | null;
  academic_year?: string | null;
  department?: string | null;
  semester?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private http = inject(HttpClient);
  private readonly BASE_URL : string = environment.apiUrl
  private readonly UPLOAD_ENDPOINT = `${this.BASE_URL}/api/v1/documents/upload/`;

  uploadPdf(payload: UploadPdfRequest): Observable<any> {
    const formData = new FormData();

    // 2. Append required fields
    formData.append('file', payload.file);
    formData.append('title', payload.title);

    // 3. Append optional fields safely
    // FormData turns everything into strings, so we only append if a value exists
    if (payload.course) {
      formData.append('course', payload.course);
    }
    if (payload.academic_year) {
      formData.append('academic_year', payload.academic_year);
    }
    if (payload.department) {
      formData.append('department', payload.department);
    }
    if (payload.semester) {
      formData.append('semester', payload.semester);
    }

    // 4. Send the POST request
    // Note: Do NOT manually set the 'Content-Type': 'multipart/form-data' header.
    // The browser will automatically set it and generate the correct boundary string for you.
    return this.http.post(this.UPLOAD_ENDPOINT, formData);
  }
}
