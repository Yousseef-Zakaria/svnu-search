import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal,
  viewChild,
} from '@angular/core';

interface Stat {
  value: number;
  display: string;
  label: string;
  suffix: string;
  icon: string;
}

@Component({
  selector: 'app-hero-stats',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      #statsContainer
      class="flex flex-wrap items-center justify-center gap-0"
      dir="rtl"
      role="list"
      aria-label="إحصائيات المحتوى"
    >
      @for (stat of stats(); track stat.label; let last = $last) {
        <div
          class="flex flex-col items-center px-6 sm:px-8 py-2"
          role="listitem"
          [attr.aria-label]="stat.display + ' ' + stat.label"
        >
          <div class="flex items-baseline gap-1">
            <span
              class="text-2xl sm:text-3xl font-black text-amber-600 tabular-nums leading-none"
              [attr.data-target]="stat.value"
            >{{ stat.display }}</span>
            <span class="text-sm font-bold text-amber-500">{{ stat.suffix }}</span>
          </div>
          <span class="text-[12px] text-slate-400 font-medium mt-1">{{ stat.label }}</span>
        </div>

        @if (!last) {
          <div class="w-px h-8 bg-amber-100" aria-hidden="true"></div>
        }
      }
    </div>
  `,
})
export class HeroStatsComponent implements AfterViewInit {
  readonly statsContainer = viewChild<ElementRef<HTMLElement>>('statsContainer');

  readonly stats = signal<Stat[]>([
    { value: 1200, display: '١٢٠٠', label: 'محاضرة',        suffix: '+', icon: '🎓' },
    { value: 500,  display: '٥٠٠',  label: 'كتاب أكاديمي', suffix: '+', icon: '📖' },
    { value: 340,  display: '٣٤٠',  label: 'وثيقة ومرجع',  suffix: '+', icon: '📄' },
    { value: 48,   display: '٤٨',   label: 'مقرر دراسي',   suffix: '+', icon: '📚' },
  ]);

  private toArabicNumerals(n: number): string {
    const arabicDigits = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    return String(n).replace(/[0-9]/g, d => arabicDigits[+d]);
  }

  ngAfterViewInit(): void {
    const el = this.statsContainer()?.nativeElement;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.runCountUp();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
  }

  private runCountUp(): void {
    const duration = 1600;
    const steps = 60;
    const interval = duration / steps;

    this.stats().forEach((stat, i) => {
      let current = 0;
      const increment = stat.value / steps;
      const delay = i * 80;

      setTimeout(() => {
        const timer = setInterval(() => {
          current = Math.min(current + increment, stat.value);
          const rounded = Math.round(current);

          this.stats.update(list =>
            list.map((s, idx) =>
              idx === i ? { ...s, display: this.toArabicNumerals(rounded) } : s
            )
          );

          if (rounded >= stat.value) clearInterval(timer);
        }, interval);
      }, delay);
    });
  }
}