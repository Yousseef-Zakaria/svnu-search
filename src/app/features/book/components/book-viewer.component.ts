// book-viewer.component.ts
import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../services/book.service';
import { BookDetails, BookPage } from '../models/book.models';

@Component({
  selector: 'app-book-viewer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink],
  template: `
    <main class="min-h-screen bg-slate-50 p-4 md:p-8 mt-10 dir-rtl font-sans text-slate-800" dir="rtl">
      <div class="mx-auto max-w-4xl">

        <!-- Header -->
        <header class="mb-6 flex flex-col gap-4 rounded-2xl bg-white/70 p-4 backdrop-blur-md shadow-sm border border-slate-200/60 md:flex-row md:items-center md:justify-between">
          <div class="flex items-center gap-4">
            <button
              routerLink="/search"
              class="flex cursor-pointer shrink-0 items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition-colors border border-slate-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label="العودة لنتائج البحث">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="h-5 w-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
              رجوع
            </button>

            @if (bookDetails()) {
              <h1 class="text-lg font-bold text-slate-800 line-clamp-1">
                {{ bookDetails()?.title }}
              </h1>
            }
          </div>

          <!-- Document Metadata Tags -->
          @if (bookDetails()) {
            <div class="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-600" aria-label="معلومات المستند">
              <span class="rounded-md bg-orange-100 px-2.5 py-1 text-orange-800 border border-orange-200">
                المادة: {{ bookDetails()?.course }}
              </span>
              <span class="rounded-md bg-blue-50 px-2.5 py-1 text-blue-700 border border-blue-100">
                القسم: {{ bookDetails()?.department  }}
              </span>
              <span class="rounded-md bg-slate-100 px-2.5 py-1 text-slate-700 border border-slate-200">
                الفرقة: {{ bookDetails()?.academic_year }} | ترم: {{ bookDetails()?.semester }}
              </span>
            </div>
          }
        </header>

        <!-- Loading State -->
        @if (isLoading()) {
          <div class="flex h-96 items-center justify-center rounded-2xl bg-white shadow-sm border border-slate-100" role="status" aria-live="polite">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-orange-600"></div>
            <span class="sr-only">جاري تحميل المستند...</span>
          </div>
        }
        <!-- Error State -->
        @else if (error()) {
          <div class="rounded-2xl bg-red-50 p-8 text-center border border-red-100" role="alert">
            <h2 class="mb-2 text-xl font-semibold text-red-800">عذراً، حدث خطأ</h2>
            <p class="text-red-600">{{ error() }}</p>
          </div>
        }
        <!-- Content State -->
        @else if (currentPage()) {
          <article class="relative min-h-[60vh] rounded-2xl bg-white p-6 md:p-12 shadow-sm border border-slate-100 leading-relaxed text-slate-700 md:text-lg">
            <!-- Page Info Indicator -->
            <div class="absolute top-6 left-6 flex flex-col items-end gap-1 text-xs font-medium text-slate-400" aria-hidden="true">
              <span>صفحة {{ currentPageIndex() + 1 }}</span>
              <span class="text-[10px] text-slate-300">{{ currentPage()?.tokens_count }} كلمة</span>
            </div>

            <div dir="ltr" class="whitespace-pre-wrap wrap-break-word mt-6 font-medium">
              {{ currentPage()?.content }}
            </div>
          </article>

          <!-- Pagination Controls -->
          <nav class="mt-6 flex items-center justify-between rounded-2xl bg-white/70 p-4 backdrop-blur-md shadow-sm border border-slate-200/60" aria-label="تصفح صفحات الكتاب">
            <button
              [disabled]="!hasPrevPage()"
              (click)="goToPrevPage()"
              class="rounded-xl cursor-pointer bg-slate-100 px-6 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500"
              aria-label="الصفحة السابقة">
              السابق
            </button>

            <span class="text-sm font-medium text-slate-500" aria-live="polite">
              {{ currentPageIndex() + 1 }} / {{ totalPages() }}
            </span>

            <button
              [disabled]="!hasNextPage()"
              (click)="goToNextPage()"
              class="rounded-xl cursor-pointer bg-orange-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-600/20 transition-all hover:bg-orange-700 hover:shadow-orange-700/30 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label="الصفحة التالية">
              التالي
            </button>
          </nav>
        } @else {
          <div class="rounded-2xl bg-white p-8 text-center shadow-sm border border-slate-100">
            <p class="text-slate-500">لم يتم العثور على محتوى لهذا المستند.</p>
          </div>
        }
      </div>
    </main>
  `
})
export class BookViewerComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly bookService = inject(BookService);

  // --- State Signals ---
  bookDetails = signal<BookDetails | null>(null);
  currentPageIndex = signal<number>(0);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // --- Derived State (Computed) ---
  pages = computed(() => this.bookDetails()?.pages ?? []);

  currentPage = computed<BookPage | null>(() => {
    const currentPages = this.pages();
    const index = this.currentPageIndex();
    return currentPages.length > 0 ? currentPages[index] : null;
  });

  // Use the total_pages property from the API, or fallback to the array length
  totalPages = computed(() => this.bookDetails()?.total_pages ?? this.pages().length);

  hasNextPage = computed(() => this.currentPageIndex() < this.totalPages() - 1);
  hasPrevPage = computed(() => this.currentPageIndex() > 0);

  ngOnInit(): void {
    const fileId = this.route.snapshot.paramMap.get('fileId');
    if (fileId) {
      this.fetchBookData(fileId);
    } else {
      this.error.set('معرف المستند غير موجود');
      this.isLoading.set(false);
    }
  }

  private fetchBookData(fileId: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.bookService.getBookDetails(fileId).subscribe({
      next: (data) => {
        this.bookDetails.set(data);
        this.currentPageIndex.set(0);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching book details:', err);
        this.error.set('تعذر تحميل بيانات المستند. يرجى المحاولة مرة أخرى لاحقاً.');
        this.isLoading.set(false);
      }
    });
  }

  // --- Actions ---
  goToNextPage(): void {
    if (this.hasNextPage()) {
      this.currentPageIndex.update(index => index + 1);
      this.scrollToTop();
    }
  }

  goToPrevPage(): void {
    if (this.hasPrevPage()) {
      this.currentPageIndex.update(index => index - 1);
      this.scrollToTop();
    }
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
