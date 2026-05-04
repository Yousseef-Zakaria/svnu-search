import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, signal, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pdf-upload-modal',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <!-- Backdrop with blur -->
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 transition-opacity"
        role="dialog"
        aria-modal="true"
        dir="rtl"
        (click)="closeModal()"
      >
        <!-- Modal Content (stop propagation so clicking inside doesn't close) -->
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
          (click)="$event.stopPropagation()"
        >

          <!-- Header -->
          <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <h2 class="text-lg font-bold text-slate-800">رفع ملف PDF جديد</h2>
            <button
              (click)="closeModal()"
              class="w-8 cursor-pointer h-8 flex items-center justify-center rounded-full bg-slate-50 hover:bg-red-500 hover:text-white text-slate-500 transition-colors"
              aria-label="إغلاق"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 flex flex-col gap-5">

            <!-- Book Title -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Book Title -->
              <div class="flex flex-col gap-1.5">
                <label for="bookTitle" class="text-sm font-semibold text-slate-700">عنوان الكتاب</label>
                <input
                  id="bookTitle"
                  type="text"
                  [(ngModel)]="formData.title"
                  placeholder="أدخل عنوان الكتاب..."
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all"
                />
              </div>

              <!-- Course Name -->
              <div class="flex flex-col gap-1.5">
                <label for="courseName" class="text-sm font-semibold text-slate-700">المادة (المقرر)</label>
                <div class="relative">
                  <select
                    id="courseName"
                    [(ngModel)]="formData.course"
                    [disabled]="availableCourses().length === 0"
                    class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:bg-slate-100"
                  >
                    <option value="" disabled selected>
                      {{ availableCourses().length > 0 ? 'اختر المادة...' : 'اختر السنة والقسم والترم أولاً' }}
                    </option>

                    <!-- Loop through the filtered courses -->
                    @for (course of availableCourses(); track course) {
                      <option [value]="course">{{ course }}</option>
                    }
                  </select>

                  <!-- Custom Dropdown Arrow -->
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- Select Grid (Year, Dept, Semester) -->
            <!-- Select Grid (Year, Dept, Semester) -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Academic Year -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-slate-700">السنة الدراسية</label>
                <select
                  [(ngModel)]="formData.year"
                  (change)="onYearChange()"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>اختر السنة</option>
                  <option value="1">الفرقة الأولى</option>
                  <option value="2">الفرقة الثانية</option>
                  <option value="3">الفرقة الثالثة</option>
                  <option value="4">الفرقة الرابعة</option>
                </select>
              </div>

              <!-- Department -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-slate-700">القسم</label>
                <select
                  [(ngModel)]="formData.department"
                  (change)="onDependencyChange()"
                  [disabled]="formData.year === '1' || formData.year === '2' || !formData.year"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all appearance-none disabled:opacity-60 disabled:bg-slate-100 disabled:cursor-not-allowed cursor-pointer"
                >
                  @if (formData.year === '1' || formData.year === '2') {
                    <option value="general">شعبة عامة</option>
                  } @else {
                    <option value="" disabled selected>اختر القسم</option>
                    <option value="cs">علوم الحاسب</option>
                    <option value="ai">ذكاء اصطناعي</option>
                    <option value="it">تقنية المعلومات</option>
                  }
                </select>
              </div>

              <!-- Semester -->
              <div class="flex flex-col gap-1.5">
                <label class="text-sm font-semibold text-slate-700">الترم</label>
                <select
                  [(ngModel)]="formData.semester"
                  (change)="onDependencyChange()"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-400/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" disabled selected>اختر الترم</option>
                  <option value="1">الترم الأول</option>
                  <option value="2">الترم الثاني</option>
                  <option value="summer">صيفي</option>
                </select>
              </div>
            </div>

            <!-- File Upload Dropzone -->
            <div class="flex flex-col gap-1.5 mt-2">
              <label class="text-sm font-semibold text-slate-700">ملف الكتاب (PDF)</label>
              <div
                class="relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors bg-slate-50"
                [class]="selectedFile ? 'border-amber-400 bg-amber-50/30' : 'border-slate-200 hover:border-amber-300 hover:bg-slate-100/50'"
              >
                <input
                  type="file"
                  accept=".pdf"
                  (change)="onFileSelected($event)"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  aria-label="اختر ملف PDF"
                />

                @if (selectedFile) {
                  <!-- Selected File State -->
                  <div class="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mb-1">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="text-center">
                    <p class="text-sm font-bold text-slate-700 line-clamp-1" dir="ltr">{{ selectedFile.name }}</p>
                    <p class="text-xs text-slate-500 mt-1">{{ formatFileSize(selectedFile.size) }}</p>
                  </div>
                } @else {
                  <!-- Empty State -->
                  <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-1">
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                  </div>
                  <div class="text-center">
                    <p class="text-sm font-semibold text-slate-700">اسحب وأفلت الملف هنا أو <span class="text-amber-600">تصفح</span></p>
                    <p class="text-xs text-slate-400 mt-1">يدعم ملفات PDF فقط بحجم أقصى 50MB</p>
                  </div>
                }
              </div>
            </div>

          </div>

          <!-- Footer -->
          <div class="border-t border-slate-100 px-6 py-4 bg-slate-50 flex items-center justify-end gap-3">
            <button
              type="button"
              (click)="closeModal()"
              class="px-5 cursor-pointer py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
            >
              إلغاء
            </button>
            <button
              type="button"
              (click)="submitForm()"
              [disabled]="!isFormValid() || isUploading()"
              class="px-5 cursor-pointer py-2.5 text-sm font-bold text-white bg-linear-to-l from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 rounded-xl shadow-md shadow-amber-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center gap-2 min-w-30 justify-center"
            >
              @if (isUploading()) {
                <!-- Loading Spinner -->
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري الرفع...
              } @else {
                <!-- Default State -->
                رفع الملف
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              }
            </button>
          </div>

        </div>
      </div>
    }
  `
})
export class PdfUploadModalComponent {
  // Using an input signal for the open state (Angular 17+)
  isOpen = input<boolean>(false);
  isUploading = input<boolean>(false);

  @Output() close = new EventEmitter<void>();
  @Output() upload = new EventEmitter<any>();

  formData = {
    title: '',
    course: '',
    year: '',
    department: '',
    semester: ''
  };

  selectedFile: File | null = null;

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'application/pdf') {
        this.selectedFile = file;
        // Optionally auto-fill title from filename (removing .pdf extension)
        if (!this.formData.title) {
          this.formData.title = file.name.replace(/\.[^/.]+$/, "");
        }
      } else {
        alert('يرجى اختيار ملف PDF');
      }
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  isFormValid(): boolean {
    return !!(
      this.formData.title &&
      this.formData.year &&
      this.formData.department &&
      this.formData.semester &&
      this.selectedFile
    );
  }

  closeModal() {
    this.resetForm();
    this.close.emit();
  }

  submitForm() {
    if (this.isFormValid()) {
      this.upload.emit({
        ...this.formData,
        file: this.selectedFile
      });
    }
    this.resetForm()
  }

  resetForm() {
    this.formData = { title: '', year: '', department: '', semester: '' , course:''};
    this.selectedFile = null;
  }
  // change course depend on
  private readonly coursesDictionary: Record<string, string[]> = {
    // Year 1 - General
    '1_general_1': ["English 1" , "Math 0" , "Math 1" , "Introducion to CS" , "Scientefic thinking" , "Computer ethics" , "Electronics" , "History of computing"],
    '1_general_2': ["Computer law" , "Organizational moral" , "Technical writing" , "Introduction to programming" , "discrete structure" , "Probability & statistics" , "Math 2" , "Human rights"],
    '1_general_summer': ['تدريب صيفي 1'],

    // Year 2 - General
    '2_general_1': ["Probability & statistics 2" , "Object orinted programming" , "Networks 1" , "Operational research" , "Logic design" , "SPM"],
    '2_general_2': ["Web technology" , "Data structure 1" , "Data base" , "Modeling & simulation" , "Physics" , "Parallel programming"],

    // Year 3 - Departments
    // CS
    '3_cs_1': ["Artificial intelligence" , "Mobile application" , "Image processing" , "Algorithms"  , "Software engineering" , "Data structure 2"],
    '3_cs_2': ["Cryptography" , "Programming languages concepts" , "Computer graphics 1" , "Computer architecture" , "Visual programming"],
    //AI
    '3_ai_1': ["Algorithms" , "Operating sytem 1" , "Artificial intelligence" , "Probabilistic reasoning" , "Introduction to data science"],
    '3_ai_2': ["Computational intelligence" , "Linear integer programming" , "Data analysis" , "Information retrival" , "Data warehouse" , "Nerual network"],
    //IT
    '3_it_1': ["Algorithms" , "Data communication" , "Signals & systems" , "Micro controllers" , "Computer graphics 1" , "Operating system"],
    '3_it_2': ["Cryptography" , "Networks 2" , "Computer graphics 1" , "Computer architecture" , "Digital siganl processing" , "Pattern Recognition 1"],

    // Year 4 - Departments
    //CS
    '4_cs_1': ["Machine learning" , "Computation theory" , "Embedded system programming" , "Mobile programming" , "Knowldge discovery"],
    '4_cs_2': ["Compiler construction" , "Computer vision" , "Big data analysis" , "Natural language processing" , "Fuzzy computing"],
    //AI
    '4_ai_1': ["Semantic web & ontology" , "Machine learning" , "Expert systems" , "Data visualization" , "Artificial intelligence project management"],
    '4_ai_2': ["Fuzzy computing" , "Deep learning" , "Robotics" , "Internet of things" , "Evolutionary computing"],
    //IT
    '4_it_1': ["Information and computer network security" , "Internet programming and protocols" , "Embedded system programming" , "Cloud computing networks" , "Concurrency and parallel computing"],
    '4_it_2': ["Communication technology" , "Multimedia mining" , "Robotics" , "Digital video processing" , "Cyber security"],
  };

  // 2. Smart Handler for Year Selection
  onYearChange() {
    // If Year 1 or 2, force the department to 'general'
    if (this.formData.year === '1' || this.formData.year === '2') {
      this.formData.department = 'general';
    }
    // If Year 3 or 4 AND it was previously 'general', reset it so the user has to pick a real dept
    else if (this.formData.department === 'general') {
      this.formData.department = '';
    }

    // Trigger the course reset logic
    this.onDependencyChange();
  }

  // 3. Reset the selected course if any dependencies change
  onDependencyChange() {
    this.formData.course = '';
  }

  // 4. Retrieve available courses
  availableCourses(): string[] {
    const { year, department, semester } = this.formData;

    if (!year || !department || !semester) {
      return [];
    }

    const lookupKey = `${year}_${department}_${semester}`;
    return this.coursesDictionary[lookupKey] || ['مقرر عام 1', 'مقرر عام 2'];
  }
}
