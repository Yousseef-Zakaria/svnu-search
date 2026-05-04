import {
  ChangeDetectionStrategy,
  Component,
  computed,
  signal,
  AfterViewInit,
  ElementRef,
  viewChild,
  Inject,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { SearchBarComponent } from '../components/search-bar/search-bar.component';
import { HeroStatsComponent } from '../components/hero-stats/hero-stats.component';
import { AnimatedBadgeComponent } from '../components/animated-badge/animated-badge.component';
import { Router } from '@angular/router';
import { PdfUploadModalComponent } from "../upload/pdf-upload-modal.component";
import { DocumentService, UploadPdfRequest } from '../upload/services/Document-service';

@Component({
  selector: 'app-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SearchBarComponent,
    HeroStatsComponent,
    AnimatedBadgeComponent,
    PdfUploadModalComponent
],
  template: `
    <div class="min-h-screen bg-[#FAFAF8] overflow-x-hidden font-cairo" dir="rtl">
      <!-- ── HERO ── -->
      <main
        class="relative min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 overflow-hidden"
        aria-labelledby="hero-heading"
      >

        <!-- Background: dot grid -->
        <div
          class="pointer-events-none absolute inset-0 dot-grid opacity-40"
          aria-hidden="true"
        ></div>

        <!-- Background: gradient blobs -->
        <div
          class="pointer-events-none absolute -top-32 -right-32 w-120 h-120 rounded-full bg-amber-100/60 blur-[80px]"
          aria-hidden="true"
        ></div>
        <div
          class="pointer-events-none absolute -bottom-24 -left-24 w-90 h-90 rounded-full bg-sky-100/50 blur-[80px]"
          aria-hidden="true"
        ></div>
        <div
          class="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-75 rounded-full bg-amber-50/70 blur-[100px]"
          aria-hidden="true"
        ></div>

        <!-- Content -->
        <div class="relative z-10 w-full max-w-3xl flex flex-col items-center text-center gap-6">

          <!-- Animated badge -->
          <app-animated-badge
            text="محرك البحث الأكاديمي — كلية الحاسبات والذكاء الاصطناعي"
            class="animate-fade-up [animation-delay:0ms]"
          />

          <!-- University logo + name -->
          <div class="flex flex-col items-center gap-3 animate-fade-up [animation-delay:80ms]">
            <div
                class="relative w-30 h-30 rounded-full bg-white border-2 border-amber-400/60
                    flex items-center justify-center shadow-lg shadow-amber-100 overflow-hidden"
            >
                <!-- Outer ring pulse -->
                <span
                class="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-ping-slow"
                aria-hidden="true"
                ></span>

                <!-- University logo -->
                <img
                class="w-full h-full rounded-full object-cover relative z-10"
                src="https://tse4.mm.bing.net/th/id/OIP.QmUTjniLuHdtDI2MoiOZygHaHb?rs=1&pid=ImgDetMain&o=7&rm=3"
                alt="شعار جامعة قنا الاهلية"
                >
            </div>

            <div class="flex flex-col gap-0.5 text-center">
                <span class="text-[15px] font-bold text-slate-800 tracking-wide">جامعة قنا الاهلية</span>
                <span class="text-[13px] font-medium text-amber-700/90">كلية الحاسبات والذكاء الاصطناعي</span>
            </div>
            </div>

          <!-- Main heading -->
          <div class="animate-fade-up [animation-delay:160ms] flex flex-col items-center gap-2">
            <h1
              id="hero-heading"
              class="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900 tracking-tight"
            >
              ابحث في
              <span class="relative inline-block text-amber-600 mx-2">
                كل ما تحتاجه
                <svg
                  class="absolute -bottom-4 right-0 left-0 w-full"
                  viewBox="0 0 220 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M4 6 Q55 2 110 5 Q165 8 216 4"
                    stroke="#C9A84C"
                    stroke-width="3"
                    stroke-linecap="round"
                    fill="none"
                    class="underline-draw"
                  />
                </svg>
              </span>
            </h1>
            <h2 class="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900 tracking-tight">
              من مواد دراسية
            </h2>
          </div>

          <!-- Sub-heading -->
          <p class="text-base sm:text-lg text-slate-500 font-light max-w-lg leading-relaxed animate-fade-up [animation-delay:240ms]">
            اعثر فوراً على المحاضرات والكتب والوثائق الأكاديمية —
            <strong class="font-semibold text-slate-600">كل المعرفة في مكان واحد</strong>
          </p>

          <!-- Search bar -->
          <div class="w-full animate-fade-up [animation-delay:320ms]">
            <app-search-bar
              [query]="searchQuery()"
              (queryChange)="onQueryChange($event)"
              (search)="onSearch($event)"
              (uploadFile)="onUploadFile()"
            />
          </div>

          <!-- Filter chips -->
          <!-- <div class="animate-fade-up [animation-delay:400ms]">
            <app-filter-chips
              [activeFilter]="activeFilter()"
              (filterChange)="onFilterChange($event)"
            />
          </div> -->

          <!-- Stats -->
          <div class="animate-fade-up [animation-delay:480ms]">
            <app-hero-stats />
          </div>

        </div>

        <!-- Scroll indicator -->
        <div
          class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-40 animate-bounce-slow"
          aria-hidden="true"
        >
          <svg class="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
          <span class="text-xs font-semibold text-slate-400 tracking-widest">استكشف</span>
        </div>

      </main>
    </div>
    <!-- The PDF Upload Modal -->
    <!-- Bind the state and handle closing/submitting -->
    <app-pdf-upload-modal
      [isOpen]="isModalOpen()"
      [isUploading]="isUploading()"
      (close)="isModalOpen.set(false)"
      (upload)="handlePdfUpload($event)"
    />
    <!-- Toast Notification Overlay -->
    @if (toastMessage()) {
      <div
        class="fixed bottom-6 right-1/2 translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 rounded-2xl shadow-xl shadow-slate-200/50 animate-fade-up text-sm font-bold min-w-75 justify-center transition-all duration-300"
        [class]="toastMessage()?.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'"
      >
        @if (toastMessage()?.type === 'success') {
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        } @else {
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        {{ toastMessage()?.text }}
      </div>
    }
  `,
  styles: [`
    :host { display: block; }

    .dot-grid {
      background-image: radial-gradient(circle, rgba(201,168,76,0.22) 1.2px, transparent 1.2px);
      background-size: 28px 28px;
      mask-image: radial-gradient(ellipse 70% 70% at 50% 40%, black 0%, transparent 100%);
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    @keyframes pingSlow {
      75%, 100% { transform: scale(1.5); opacity: 0; }
    }

    @keyframes bounceSlow {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      50%       { transform: translateX(-50%) translateY(6px); }
    }

    .animate-fade-up {
      animation: fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    }

    .animate-ping-slow {
      animation: pingSlow 2.4s cubic-bezier(0,0,0.2,1) infinite;
    }

    .animate-bounce-slow {
      animation: bounceSlow 2.4s ease-in-out infinite;
    }

    /* SVG underline draw animation */
    .underline-draw {
      stroke-dasharray: 260;
      stroke-dashoffset: 260;
      animation: drawLine 1s 0.7s cubic-bezier(0.22,1,0.36,1) forwards;
    }

    @keyframes drawLine {
      to { stroke-dashoffset: 0; }
    }
  `],
})
export class HeroComponent {
  private cdr = inject(ChangeDetectorRef);

  readonly searchQuery = signal('');
  readonly activeFilter = signal<'all' | 'lectures' | 'books' | 'pdfs'>('all');
  private readonly router = inject(Router);
  readonly placeholder = computed(() => {
    const map = {
      all: 'ابحث عن محاضرة، كتاب، أو مادة دراسية...',
      lectures: 'ابحث في المحاضرات...',
      books: 'ابحث في الكتب الأكاديمية...',
      pdfs: 'ابحث في وثائق PDF...',
    };
    return map[this.activeFilter()];
  });

  onQueryChange(q: string): void {
    this.searchQuery.set(q);
  }

  onUploadFile(): void {
    this.isModalOpen.set(true);
  }

  onFilterChange(filter: 'all' | 'lectures' | 'books' | 'pdfs'): void {
    this.activeFilter.set(filter);
  }

  onSearch(q: string): void {
    // Navigate to the feature search page with query parameters
    this.router.navigate(['/search'], {
      queryParams: {
        q,
        type: this.activeFilter() === 'all' ? null : this.activeFilter()
      }
    });
  }

  // PDF upload
  isModalOpen = signal(false);

  // deal with API
  private documentService = inject(DocumentService);

  isUploading = signal<boolean>(false); // Tracks HTTP request state
  toastMessage = signal<{type: 'success' | 'error', text: string} | null>(null);
  handlePdfUpload(modalData: any) {
    const apiPayload: UploadPdfRequest = {
      file: modalData.file,
      title: modalData.title,
      course: modalData.course,
      academic_year: modalData.year,
      department: modalData.department === 'general' ? null : modalData.department,
      semester: modalData.semester
    };

    this.isUploading.set(true);
    this.toastMessage.set(null);
    console.log("start sending request >>>");
    this.documentService.uploadPdf(apiPayload).subscribe({
      next: (response) => {
        // Update states
        console.log('API Success Block Hit!', response); // Debug log 2
        this.isUploading.set(false);
        this.isModalOpen.set(false); // This will close the modal
        this.showToast('success', 'تم رفع الملف بنجاح! شكراً لمساهمتك.');

        // 2. Force Angular to update the UI
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.log('API Fail Block Hit!!!!!!!!!', error); // Debug log 2
        console.error('Upload Error:', error);

        // Update states
        this.isUploading.set(false);
        this.showToast('error', 'حدث خطأ أثناء الرفع. يرجى المحاولة مرة أخرى.');

        // 2. Force Angular to update the UI
        this.cdr.markForCheck();
      }
    });
  }

  private showToast(type: 'success' | 'error', text: string) {
    this.toastMessage.set({ type, text });
    this.cdr.markForCheck(); // 3. Force UI update for the Toast

    setTimeout(() => {
      this.toastMessage.set(null);
      this.cdr.markForCheck(); // 4. Force UI update when Toast disappears
    }, 4000);
  }

}
