import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

type FilterKey = 'all' | 'lectures' | 'books' | 'pdfs';

interface FilterChip {
  key: FilterKey;
  label: string;
  emoji: string;
  count: string;
}

@Component({
  selector: 'app-filter-chips',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-wrap items-center justify-center gap-2"
      role="group"
      aria-label="تصفية نوع المحتوى"
      dir="rtl"
    >
      <span class="text-[12px] font-semibold text-slate-400 ml-1" aria-hidden="true">تصفح:</span>

      @for (chip of chips(); track chip.key) {
        <button
          type="button"
          [attr.aria-pressed]="activeFilter() === chip.key"
          [attr.aria-label]="chip.label + ' — ' + chip.count"
          class="inline-flex items-center gap-2 rounded-full text-[13px] font-bold
                 px-4 py-2 border transition-all duration-200 active:scale-95 select-none"
          [class]="activeFilter() === chip.key
            ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-200'
            : 'bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50'"
          (click)="filterChange.emit(chip.key)"
        >
          <span class="text-[15px] leading-none" aria-hidden="true">{{ chip.emoji }}</span>
          {{ chip.label }}
          <span
            class="text-[11px] font-bold px-1.5 py-0.5 rounded-full leading-none"
            [class]="activeFilter() === chip.key
              ? 'bg-white/25 text-white'
              : 'bg-slate-100 text-slate-500'"
          >{{ chip.count }}</span>
        </button>
      }
    </div>
  `,
})
export class FilterChipsComponent {
  readonly activeFilter = input.required<FilterKey>();
  readonly filterChange = output<FilterKey>();

  readonly chips = signal<FilterChip[]>([
    { key: 'all',      label: 'الكل',      emoji: '🗂️', count: '٢٠٤٠+' },
    { key: 'lectures', label: 'محاضرات',   emoji: '🎓', count: '١٢٠٠' },
    { key: 'books',    label: 'كتب',       emoji: '📖', count: '٥٠٠'  },
    { key: 'pdfs',     label: 'وثائق PDF', emoji: '📄', count: '٣٤٠'  },
  ]);
}