// import { ChangeDetectionStrategy, Component, inject, OnInit, DestroyRef } from '@angular/core';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// import { ActivatedRoute } from '@angular/router';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { NgOptimizedImage } from '@angular/common';
// import { Router } from '@angular/router';
// import { Search } from './services/search';

// @Component({
//   selector: 'app-search-page',
//   standalone: true,
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   imports: [ReactiveFormsModule],
//   template: `
//     <div class="min-h-screen bg-[#FAFAF8] font-cairo pt-24 pb-12 px-4 sm:px-6 lg:px-8" dir="rtl">
//       <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

//         <!-- ── SIDEBAR FILTERS ── -->
//         <aside class="w-full lg:w-72 shrink-0">
//           <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
//             <h2 class="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">تصفية النتائج</h2>

//             <form [formGroup]="filterForm" class="flex flex-col gap-5">

//               <!-- Query -->
//               <div class="flex flex-col gap-2">
//                 <label for="query" class="text-sm font-semibold text-slate-700">كلمة البحث</label>
//                 <input
//                   id="query"
//                   type="text"
//                   formControlName="q"
//                   class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
//                   placeholder="ابحث هنا..."
//                 >
//               </div>

//               <!-- Department -->
//               <div class="flex flex-col gap-2">
//                 <label for="department" class="text-sm font-semibold text-slate-700">القسم</label>
//                 <select
//                   id="department"
//                   formControlName="department"
//                   class="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
//                 >
//                   <option [ngValue]="null">جميع الأقسام</option>
//                   <option value="الذكاء الاصطناعي">الذكاء الاصطناعي</option>
//                   <option value="علوم الحاسب">علوم الحاسب</option>
//                   <option value="تكنولوجيا المعلومات">تكنولوجيا المعلومات</option>
//                 </select>
//               </div>

//               <!-- Academic Year -->
//               <div class="flex flex-col gap-2">
//                 <label for="academicYear" class="text-sm font-semibold text-slate-700">الفرقة الدراسية</label>
//                 <select
//                   id="academicYear"
//                   formControlName="academicYear"
//                   class="w-full cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none"
//                 >
//                   <option [ngValue]="null">جميع الفرق</option>
//                   <option [value]="1">الفرقة الأولى</option>
//                   <option [value]="2">الفرقة الثانية</option>
//                   <option [value]="3">الفرقة الثالثة</option>
//                   <option [value]="4">الفرقة الرابعة</option>
//                 </select>
//               </div>

//               <!-- Course -->
//               <div class="flex flex-col gap-2">
//                 <label for="course" class="text-sm font-semibold text-slate-700">المادة</label>
//                 <input
//                   id="course"
//                   type="text"
//                   formControlName="course"
//                   class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
//                   placeholder="اسم المادة..."
//                 >
//               </div>

//             </form>
//           </div>
//         </aside>

//         <!-- ── RESULTS GRID ── -->
//         <main class="flex-1">
//           <!-- Results Header -->
//           <div class="mb-6 flex items-center justify-between" aria-live="polite">
//             <h1 class="text-2xl font-bold text-slate-900">نتائج البحث</h1>
//             <span class="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
//               تم العثور على {{ searchService.totalFound() }} نتائج
//             </span>
//           </div>

//           <!-- Error State -->
//           @if (searchService.error()) {
//             <div class="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mb-6">
//               {{ searchService.error() }}
//             </div>
//           }

//           <!-- Loading State -->
//           @if (searchService.isLoading()) {
//             <div class="flex flex-col items-center justify-center py-20 text-slate-400">
//               <span class="relative flex h-10 w-10 mb-4">
//                 <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
//                 <span class="relative inline-flex rounded-full h-10 w-10 bg-amber-500"></span>
//               </span>
//               <p class="text-lg font-medium">جاري البحث ...</p>
//             </div>
//           }

//           <!-- Grid -->
//            @if (!searchService.isLoading() && searchService.results().length > 0) {
//           <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             @for (doc of searchService.results(); track doc.doc_id) {
//               <article class="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden flex flex-col transition-all duration-300">


//                 <!-- Content -->
//                 <div class="p-5 flex flex-col flex-1 gap-4">
//                   <div>
//                     <h3 class="text-lg font-bold text-slate-900 leading-tight mb-1">{{ doc.title }}</h3>
//                     <p class="text-sm text-slate-500 font-medium">{{ doc.snippet }}</p>
//                   </div>

//                   <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
//                     <span class="text-xs text-slate-500">{{ doc.department }}</span>

//                     <button
//                       (click)="viewDocument(doc.file_id)"
//                       class="inline-flex cursor-pointer items-center justify-center bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
//                       aria-label="عرض المستند كامل"
//                     >
//                       عرض الكتاب
//                     </button>
//                   </div>
//                 </div>

//               </article>
//             }
//           </div>
//           }@else {
//             @if(!searchService.isLoading()){
//               <div class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
//                 <svg class="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
//                 </svg>
//                 <p class="text-lg font-medium">لم يتم العثور على نتائج تطابق بحثك.</p>
//               </div>
//               }
//             }
//         </main>

//       </div>
//     </div>
//   `
// })
// export class SearchPageComponent implements OnInit {
//   private readonly route = inject(ActivatedRoute);
//   private readonly fb = inject(FormBuilder);
//   private readonly destroyRef = inject(DestroyRef);
//   readonly searchService = inject(Search);
//   private readonly router = inject(Router);
//   readonly searchForm = this.fb.group({
//     q: [''],
//     limit: [5]
//   });

//   readonly filterForm = this.fb.group({
//       q: [''], // Changed from 'query' to 'q' to match URL and API
//       limit: [5],
//       course: [''],
//       department: [null as string | null],
//       academicYear: [null as number | null],
//   });

//   ngOnInit(): void {console.log("Entered search page");

//     const queryParams = this.route.snapshot.queryParams;

//     // 1. Setup Initial Values
//     const initialQuery = queryParams['q'] || '';
//     const initialLimit = queryParams['limit'] ? Number(queryParams['limit']) : 5;

//     this.filterForm.patchValue({
//       q: initialQuery,
//       limit: initialLimit
//     });

//     // 2. EXPLICITLY execute the search on initial load if there is a query!
//     if (initialQuery) {
//       console.log("Initial API execution for:", initialQuery);
//       this.searchService.executeSearch(initialQuery, initialLimit);
//     }

//     // 3. Listen to form changes going forward
//     this.filterForm.valueChanges
//       .pipe(takeUntilDestroyed(this.destroyRef))
//       .subscribe(values => {

//         // Update client-side filters (Course, Dept, Year)
//         this.searchService.updateFilters({
//           query: values.q || '',
//           course: values.course || null,
//           department: values.department || null,
//           academicYear: values.academicYear ? Number(values.academicYear) : null
//         });

//         // Trigger the actual API call when 'q' changes
//         if (values.q) {
//           console.log("Form changed, executing search:", values.q);
//           this.searchService.executeSearch(values.q, Number(values.limit));
//         }
//       });
//   }

//   viewDocument(url: string): void {
//     // Navigate to a document viewer route or open the PDF directly
//     this.router.navigate(['/book', url]);
//   }
// }

import { ChangeDetectionStrategy, Component, inject, OnInit, DestroyRef, computed } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Search } from './services/search';

@Component({
  selector: 'app-search-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  template: `
    <div class="min-h-screen bg-[#FAFAF8] font-cairo pt-24 pb-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div class="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

        <!-- ── SIDEBAR FILTERS ── -->
        <aside class="w-full lg:w-72 shrink-0">
          <div class="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
            <h2 class="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">تصفية النتائج</h2>

            <form [formGroup]="filterForm" class="flex flex-col gap-5">

              <!-- Query -->
              <div class="flex flex-col gap-1.5">
                <label for="query" class="text-sm font-semibold text-slate-700">كلمة البحث</label>
                <input
                  id="query"
                  type="search"
                  formControlName="q"
                  class="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition-colors"
                  placeholder="ابحث هنا..."
                >
              </div>

              <!-- Academic Year -->
              <div class="flex flex-col gap-1.5">
                <label for="academicYear" class="text-sm font-semibold text-slate-700">الفرقة الدراسية</label>
                <select
                  id="academicYear"
                  formControlName="academicYear"
                  (change)="onYearChange()"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">جميع الفرق</option>
                  <option value="1">الفرقة الأولى</option>
                  <option value="2">الفرقة الثانية</option>
                  <option value="3">الفرقة الثالثة</option>
                  <option value="4">الفرقة الرابعة</option>
                </select>
              </div>

              <!-- Department -->
              <div class="flex flex-col gap-1.5">
                <label for="department" class="text-sm font-semibold text-slate-700">القسم</label>
                <select
                  id="department"
                  formControlName="department"
                  (change)="onDependencyChange()"
                  [disabled]="formState().academicYear === '1' || formState().academicYear === '2'"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  @if (formState().academicYear === '1' || formState().academicYear === '2') {
                    <option value="general">شعبة عامة</option>
                  } @else {
                    <option value="">جميع الأقسام</option>
                    <option value="cs">علوم الحاسب</option>
                    <option value="ai">ذكاء اصطناعي</option>
                    <option value="it">تقنية المعلومات</option>
                  }
                </select>
              </div>

              <!-- Semester -->
              <div class="flex flex-col gap-1.5">
                <label for="semester" class="text-sm font-semibold text-slate-700">الترم</label>
                <select
                  id="semester"
                  formControlName="semester"
                  (change)="onDependencyChange()"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">جميع الأترام</option>
                  <option value="1">الترم الأول</option>
                  <option value="2">الترم الثاني</option>
                  <option value="summer">صيفي</option>
                </select>
              </div>

              <!-- Course (Cascading Select) -->
              <div class="flex flex-col gap-1.5">
                <label for="course" class="text-sm font-semibold text-slate-700">المادة</label>
                <select
                  id="course"
                  formControlName="course"
                  [disabled]="availableCourses().length === 0"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed"
                >
                  <option value="">جميع المواد</option>
                  @for (course of availableCourses(); track course) {
                    <option [value]="course">{{ course }}</option>
                  }
                </select>
              </div>

            </form>
          </div>
        </aside>

        <!-- ── RESULTS GRID ── -->
        <main class="flex-1">
          <!-- Results Header -->
          <div class="mb-6 flex items-center justify-between" aria-live="polite">
            <h1 class="text-2xl font-bold text-slate-900">نتائج البحث</h1>
            <span class="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
              تم العثور على {{ searchService.totalFound() }} نتائج
            </span>
          </div>

          <!-- Error State -->
          @if (searchService.error()) {
            <div class="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mb-6">
              {{ searchService.error() }}
            </div>
          }

          <!-- Loading State -->
          @if (searchService.isLoading()) {
            <div class="flex flex-col items-center justify-center py-20 text-slate-400">
              <span class="relative flex h-10 w-10 mb-4">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-10 w-10 bg-amber-500"></span>
              </span>
              <p class="text-lg font-medium">جاري البحث ...</p>
            </div>
          }

          <!-- Grid -->
          @if (!searchService.isLoading() && searchService.results().length > 0) {
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              @for (doc of searchService.results(); track doc.doc_id) {
                <article class="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-100 overflow-hidden flex flex-col transition-all duration-300">
                  <!-- Content -->
                  <div class="p-5 flex flex-col flex-1 gap-4">
                    <div>
                      <h3 class="text-lg font-bold text-slate-900 leading-tight mb-1">{{ doc.title }}</h3>
                      <p class="text-sm text-slate-500 font-medium">{{ doc.snippet }}</p>
                    </div>

                    <div class="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span class="text-xs text-slate-500">{{ doc.department }}</span>

                      <button
                        (click)="viewDocument(doc.file_id)"
                        class="inline-flex cursor-pointer items-center justify-center bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                        aria-label="عرض المستند كامل"
                      >
                        عرض الكتاب
                      </button>
                    </div>
                  </div>
                </article>
              }
            </div>
          } @else {
            @if(!searchService.isLoading()){
              <div class="col-span-full flex flex-col items-center justify-center py-20 text-slate-400">
                <svg class="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p class="text-lg font-medium">لم يتم العثور على نتائج تطابق بحثك.</p>
              </div>
            }
          }
        </main>

      </div>
    </div>
  `
})
export class SearchPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  readonly searchService = inject(Search);

  // Initialize form with string values to perfectly match dictionary keys
  readonly filterForm = this.fb.group({
    q: [''],
    limit: [5],
    course: [''],
    department: [''],
    academicYear: [''],
    semester: [''],
  });

  // Track entire form state strictly using Signals
  readonly formState = toSignal(this.filterForm.valueChanges, {
    initialValue: this.filterForm.getRawValue()
  });

  private readonly coursesDictionary: Record<string, string[]> = {
    '1_general_1': ["English 1" , "Math 0" , "Math 1" , "Introducion to CS" , "Scientefic thinking" , "Computer ethics" , "Electronics" , "History of computing"],
    '1_general_2': ["Computer law" , "Organizational moral" , "Technical writing" , "Introduction to programming" , "discrete structure" , "Probability & statistics" , "Math 2" , "Human rights"],
    '1_general_summer': ['تدريب صيفي 1'],
    '2_general_1': ["Probability & statistics 2" , "Object orinted programming" , "Networks 1" , "Operational research" , "Logic design" , "SPM"],
    '2_general_2': ["Web technology" , "Data structure 1" , "Data base" , "Modeling & simulation" , "Physics" , "Parallel programming"],
    '3_cs_1': ["Artificial intelligence" , "Mobile application" , "Image processing" , "Algorithms"  , "Software engineering" , "Data structure 2"],
    '3_cs_2': ["Cryptography" , "Programming languages concepts" , "Computer graphics 1" , "Computer architecture" , "Visual programming"],
    '3_ai_1': ["Algorithms" , "Operating sytem 1" , "Artificial intelligence" , "Probabilistic reasoning" , "Introduction to data science"],
    '3_ai_2': ["Computational intelligence" , "Linear integer programming" , "Data analysis" , "Information retrival" , "Data warehouse" , "Nerual network"],
    '3_it_1': ["Algorithms" , "Data communication" , "Signals & systems" , "Micro controllers" , "Computer graphics 1" , "Operating system"],
    '3_it_2': ["Cryptography" , "Networks 2" , "Computer graphics 1" , "Computer architecture" , "Digital siganl processing" , "Pattern Recognition 1"],
    '4_cs_1': ["Machine learning" , "Computation theory" , "Embedded system programming" , "Mobile programming" , "Knowldge discovery"],
    '4_cs_2': ["Compiler construction" , "Computer vision" , "Big data analysis" , "Natural language processing" , "Fuzzy computing"],
    '4_ai_1': ["Semantic web & ontology" , "Machine learning" , "Expert systems" , "Data visualization" , "Artificial intelligence project management"],
    '4_ai_2': ["Fuzzy computing" , "Deep learning" , "Robotics" , "Internet of things" , "Evolutionary computing"],
    '4_it_1': ["Information and computer network security" , "Internet programming and protocols" , "Embedded system programming" , "Cloud computing networks" , "Concurrency and parallel computing"],
    '4_it_2': ["Communication technology" , "Multimedia mining" , "Robotics" , "Digital video processing" , "Cyber security"],
  };

  // Dynamically compute available courses from the dictionary based on selected dropdowns
  readonly availableCourses = computed(() => {
    const state = this.formState();
    const { academicYear, department, semester } = state;

    if (!academicYear || !department || !semester) {
      return [];
    }

    const lookupKey = `${academicYear}_${department}_${semester}`;
    return this.coursesDictionary[lookupKey] || [];
  });

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;

    // 1. Setup Initial Values from URL parameters
    const initialQuery = queryParams['q'] || '';
    const initialLimit = queryParams['limit'] ? Number(queryParams['limit']) : 10;

    this.filterForm.patchValue({
      q: initialQuery,
      limit: initialLimit
    });

    // 2. EXPLICITLY execute the search on initial load if there is a query
    if (initialQuery) {
      this.searchService.executeSearch(initialQuery, initialLimit);
    }

    // 3. Listen to form changes going forward
    // Inside search-page.component.ts (ngOnInit)
    this.filterForm.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(values => {

        // We don't need the departmentMap anymore! values.department is already "ai", "cs", etc.
        // We only map the semester if your UI value ("1") needs to map to something specific,
        // but since it's missing from the DB right now, we will just pass it through.

        this.searchService.updateFilters({
          query: values.q || '',
          course: values.course || null,
          department: values.department || null, // Passes "ai", "cs", etc. directly
          academicYear: values.academicYear ? Number(values.academicYear) : null,
          semester: values.semester || null
        });

        if (values.q) {
          this.searchService.executeSearch(values.q, Number(values.limit));
        }
      });
  }

  // Smart logic: Auto-select or wipe dependent values on Year switch
  onYearChange(): void {
    const year = this.filterForm.get('academicYear')?.value;
    const currentDept = this.filterForm.get('department')?.value;

    if (year === '1' || year === '2') {
      this.filterForm.patchValue({ department: 'general', course: '' });
    } else if (currentDept === 'general') {
      this.filterForm.patchValue({ department: '', course: '' });
    } else {
      this.filterForm.patchValue({ course: '' });
    }
  }

  // Wipes course selection if department or semester are manipulated
  onDependencyChange(): void {
    this.filterForm.patchValue({ course: '' });
  }

  viewDocument(url: string): void {
    this.router.navigate(['/book', url]);
  }
}
