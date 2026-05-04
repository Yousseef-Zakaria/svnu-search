import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-animated-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="inline-flex items-center gap-2.5 bg-white border border-amber-200/80
             rounded-full px-4 py-2 shadow-sm shadow-amber-100/60"
      role="status"
      [attr.aria-label]="text()"
    >
      <!-- Live dot -->
      <span class="relative flex w-2.5 h-2.5 flex-shrink-0" aria-hidden="true">
        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span class="relative inline-flex rounded-full w-2.5 h-2.5 bg-amber-500"></span>
      </span>

      <!-- Scrolling text for long labels, static for short -->
      <span class="text-[12px] font-bold text-amber-700 tracking-wide whitespace-nowrap">
        {{ text() }}
      </span>

      <!-- Sparkle icon -->
      <svg
        class="w-3.5 h-3.5 text-amber-400 flex-shrink-0"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z"/>
      </svg>
    </div>
  `,
})
export class AnimatedBadgeComponent {
  readonly text = input.required<string>();
}