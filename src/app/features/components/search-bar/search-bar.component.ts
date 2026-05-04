import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  computed,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
  template: `
<div class="w-full flex flex-col items-center gap-3" dir="rtl">

  <!-- Main search box (Converted to a form) -->
  <form
    (ngSubmit)="onEnter()"
    role="search"
    class="relative w-full flex items-center gap-2 bg-white rounded-2xl px-4 py-2
           border transition-all duration-300"
    [class]="focused()
      ? 'border-amber-400 shadow-[0_0_0_4px_rgba(251,191,36,0.12),0_4px_32px_rgba(201,168,76,0.14)]'
      : 'border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:border-amber-300/60'"
  >

    <!-- Search icon -->
    <span
      class="shrink-0 transition-colors duration-200"
      [class]="focused() ? 'text-amber-500' : 'text-slate-300'"
      aria-hidden="true"
    >
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </span>

    <!-- Input -->
    <input
      #searchInput
      type="search"
      [value]="query()"
      [placeholder]="currentPlaceholder()"
      class="flex-1 bg-transparent border-none outline-none text-right text-[15px]
             font-medium text-slate-800 placeholder:text-slate-400
             placeholder:font-light min-w-0"
      dir="rtl"
      autocomplete="off"
      autocorrect="off"
      spellcheck="false"
      aria-label="حقل البحث"
      (focus)="focused.set(true)"
      (blur)="onBlur()"
      (input)="onInput($event)"
      (search)="$event.stopPropagation()"
    />

    <!-- Clear button -->
    @if (query().length > 0) {
      <button
        type="button"
        class="shrink-0 w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200
               flex items-center justify-center transition-colors duration-150"
        (click)="clearQuery()"
        aria-label="مسح النص"
      >
        <svg class="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    }

    <!-- Divider -->
    <span class="w-px h-7 bg-slate-100 shrink-0" aria-hidden="true"></span>

    <!-- Search button -->
    <button
      type="submit"
      class="shrink-0 cursor-pointer flex items-center gap-2 bg-linear-to-l from-amber-600 to-amber-500
             hover:from-amber-700 hover:to-amber-600 text-white font-bold text-[14px]
             px-5 py-3 rounded-xl transition-all duration-200 active:scale-95
             shadow-md shadow-amber-200 whitespace-nowrap"
      aria-label="بحث"
    >
      بحث
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
    </button>
  </form>

  <!-- Suggestions row -->
  @if (focused() && query().length === 0) {
    <div
      class="flex flex-wrap items-center justify-center gap-2 animate-fade-in"
      role="listbox"
      aria-label="اقتراحات البحث"
    >
      <span class="text-[12px] text-slate-400 font-medium ml-1">مقترحات:</span>
      @for (s of suggestions(); track s) {
        <button
          type="button"
          role="option"
          aria-selected="false"
          class="text-[12px] font-semibold text-slate-600 bg-slate-50 hover:bg-amber-50
                 hover:text-amber-700 border border-slate-200 hover:border-amber-200
                 rounded-full px-3 py-1.5 transition-all duration-150"
          (click)="selectSuggestion(s)"
        >{{ s }}</button>
      }
    </div>
  }

  <!-- Upload hint -->
  <div class="flex items-center gap-2 text-[13px] text-slate-400">
    <span>أو</span>
    <button
      type="button"
      class="inline-flex items-center gap-1.5 font-semibold text-amber-700 cursor-pointer
             bg-amber-50 hover:bg-amber-100 border border-dashed border-amber-300
             hover:border-amber-500 rounded-xl px-4 py-1.5 transition-all duration-200
             active:scale-95"
      (click)="uploadFile.emit()"
      aria-label="رفع ملف PDF للبحث داخله"
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
      </svg>
      ارفع ملف PDF
    </button>
    <span>للبحث داخله</span>
  </div>

</div>
  `,
  styles: [`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(-6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in { animation: fadeIn 0.2s ease both; }
  `],
})
export class SearchBarComponent implements OnInit , OnDestroy{
  readonly query = input.required<string>();
  readonly queryChange = output<string>();
  readonly search = output<string>();
  readonly uploadFile = output<void>();

  readonly focused = signal(false);

  readonly suggestions = signal([
    'خوارزميات',
    'قواعد البيانات',
    'ذكاء اصطناعي',
    'شبكات حاسوب',
    'برمجة Python',
    'هياكل البيانات',
  ]);

  readonly placeholders = signal([
    'ابحث عن محاضرة، كتاب، أو مادة دراسية...',
    'مثال: خوارزميات الفرز والبحث...',
    'مثال: تعلم الآلة للمبتدئين...',
    'مثال: قواعد البيانات العلائقية...',
  ]);

  readonly placeholderIndex = signal(0);
  readonly currentPlaceholder = computed(() => this.placeholders()[this.placeholderIndex()]);

  private placeholderInterval: ReturnType<typeof setInterval> | null = null;

  onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.queryChange.emit(val);
  }

  onBlur(): void {
    setTimeout(() => this.focused.set(false), 150);
  }

  onEnter(): void {
    if (this.query().trim()) {
      this.search.emit(this.query().trim());
    }
  }

  clearQuery(): void {
    this.queryChange.emit('');
  }

  selectSuggestion(s: string): void {
    this.queryChange.emit(s);
    this.search.emit(s);
  }

  ngOnInit(): void {
    this.placeholderInterval = setInterval(() => {
      // Safely cycle through the array indices using modulo
      this.placeholderIndex.update(i => (i + 1) % this.placeholders().length);
    }, 3500); // Changes every 3.5 seconds
  }

  // 2. Clear the interval when destroyed to prevent memory leaks
  ngOnDestroy(): void {
    if (this.placeholderInterval) {
      clearInterval(this.placeholderInterval);
    }
  }
}
