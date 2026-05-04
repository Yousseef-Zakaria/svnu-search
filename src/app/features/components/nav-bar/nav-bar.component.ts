// import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

// @Component({
//   selector: 'app-nav-bar',
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   template: `
//     <nav
//       class="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-4 sm:px-8
//              bg-white/80 backdrop-blur-xl border-b border-amber-100/80
//              shadow-[0_1px_20px_rgba(201,168,76,0.08)]"
//       aria-label="شريط التنقل الرئيسي"
//       dir="rtl"
//     >
//       <!-- Brand -->
//       <div class="flex items-center gap-3">

//         <div class="flex flex-col leading-tight">
//           <span class="text-[13px] font-bold text-slate-800">جامعة قنا الاهلية</span>
//           <span class="text-[11px] text-slate-400 font-medium">بحث أكاديمي</span>
//         </div>
//       </div>

//       <!-- Desktop links -->
//       <ul class="hidden sm:flex items-center gap-7 list-none" role="list">
//         @for (link of navLinks(); track link.label) {
//           <li>
//             <a
//               [href]="link.href"
//               class="text-[16px] font-semibold text-slate-500 hover:text-amber-600
//                      transition-colors duration-200 relative group"
//             >
//               {{ link.label }}
//               <span
//                 class="absolute -bottom-0.5 right-0 h-0.5 w-0 bg-amber-400 rounded-full
//                        group-hover:w-full transition-all duration-300"
//                 aria-hidden="true"
//               ></span>
//             </a>
//           </li>
//         }
//       </ul>



//       <!-- Mobile hamburger -->
//       <button
//         type="button"
//         class="sm:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-amber-50 transition-colors"
//         (click)="toggleMobile()"
//         [attr.aria-expanded]="mobileOpen()"
//         aria-label="فتح القائمة"
//         aria-controls="mobile-menu"
//       >
//         <span class="block w-5 h-0.5 bg-slate-600 rounded transition-all duration-200"
//               [style.transform]="mobileOpen() ? 'rotate(45deg) translate(3px, 3px)' : 'none'"></span>
//         <span class="block w-5 h-0.5 bg-slate-600 rounded transition-all duration-200"
//               [style.opacity]="mobileOpen() ? '0' : '1'"></span>
//         <span class="block w-5 h-0.5 bg-slate-600 rounded transition-all duration-200"
//               [style.transform]="mobileOpen() ? 'rotate(-45deg) translate(3px, -3px)' : 'none'"></span>
//       </button>
//     </nav>

//     <!-- Mobile menu -->
//     @if (mobileOpen()) {
//       <div
//         id="mobile-menu"
//         class="fixed top-16 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-amber-100
//                shadow-lg py-4 px-6 flex flex-col gap-3"
//         dir="rtl"
//         role="navigation"
//         aria-label="القائمة المحمولة"
//       >
//         @for (link of navLinks(); track link.label) {
//           <a
//             [href]="link.href"
//             class="text-[14px] font-semibold text-slate-700 hover:text-amber-600 py-2
//                    border-b border-slate-100 last:border-0 transition-colors"
//           >{{ link.label }}</a>
//         }
//       </div>
//     }
//   `,
// })
// export class NavBarComponent {
//   readonly mobileOpen = signal(false);

//   readonly navLinks = signal([
//     { label: 'الرئيسية', href: '#' },
//     { label: 'رفع ملف', href: '#' },
//   ]);

//   toggleMobile(): void {
//     this.mobileOpen.update(v => !v);
//   }
// }
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav
      class="fixed top-0 inset-x-0 z-50 h-16 flex items-center justify-between px-4 sm:px-8
             bg-white/80 backdrop-blur-xl border-b border-amber-100/80
             shadow-[0_1px_20px_rgba(201,168,76,0.08)]"
      aria-label="شريط التنقل الرئيسي"
      dir="rtl"
    >
      <!-- Brand -->
      <div class="flex items-center gap-3 cursor-pointer" routerLink="/">
        <div class="flex flex-col leading-tight">
          <span class="text-[13px] font-bold text-slate-800">جامعة قنا الاهلية</span>
          <span class="text-[11px] text-slate-400 font-medium">بحث أكاديمي</span>
        </div>
      </div>

      <!-- Desktop links -->
      <ul class="hidden sm:flex items-center gap-7 list-none" role="list">
        @for (link of navLinks(); track link.label) {
          <li>
            <a
              [routerLink]="link.href"
              routerLinkActive="!text-amber-600"
              [routerLinkActiveOptions]="{exact: link.href === '/'}"
              ariaCurrentWhenActive="page"
              class="text-[16px] font-semibold text-slate-500 hover:text-amber-600
                     transition-colors duration-200 relative group"
            >
              {{ link.label }}
              <!-- Active Indicator Line (Optional visual enhancement) -->
              <span
                class="absolute -bottom-0.5 right-0 h-0.5 w-0 bg-amber-400 rounded-full
                       group-hover:w-full transition-all duration-300"
                aria-hidden="true"
              ></span>
            </a>
          </li>
        }
      </ul>

      <!-- Mobile hamburger -->
      <button
        type="button"
        class="sm:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-amber-50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-amber-500"
        (click)="toggleMobile()"
        [attr.aria-expanded]="mobileOpen()"
        aria-label="فتح القائمة"
        aria-controls="mobile-menu"
      >
        <span class="block w-5 h-0.5 bg-slate-600 rounded transition-all duration-200"
              [style.transform]="mobileOpen() ? 'rotate(45deg) translate(3px, 3px)' : 'none'"></span>
        <span class="block w-5 h-0.5 bg-slate-600 rounded transition-all duration-200"
              [style.opacity]="mobileOpen() ? '0' : '1'"></span>
        <span class="block w-5 h-0.5 bg-slate-600 rounded transition-all duration-200"
              [style.transform]="mobileOpen() ? 'rotate(-45deg) translate(3px, -3px)' : 'none'"></span>
      </button>
    </nav>

    <!-- Mobile menu -->
    @if (mobileOpen()) {
      <div
        id="mobile-menu"
        class="fixed top-16 inset-x-0 z-40 bg-white/95 backdrop-blur-xl border-b border-amber-100
               shadow-lg py-4 px-6 flex flex-col gap-3"
        dir="rtl"
        role="navigation"
        aria-label="القائمة المحمولة"
      >
        @for (link of navLinks(); track link.label) {
          <a
            [routerLink]="link.href"
            routerLinkActive="!text-amber-600 bg-amber-50"
            [routerLinkActiveOptions]="{exact: link.href === '/'}"
            ariaCurrentWhenActive="page"
            (click)="mobileOpen.set(false)"
            class="text-[14px] font-semibold text-slate-700 hover:text-amber-600 hover:bg-amber-50 px-2 py-3 rounded-lg
                   border-b border-slate-100 last:border-0 transition-colors"
          >{{ link.label }}</a>
        }
      </div>
    }
  `,
})
export class NavBarComponent {
  readonly mobileOpen = signal(false);

  // Updated paths to match your routing
  readonly navLinks = signal([
    { label: 'الرئيسية', href: '/' },
    { label: 'رفع ملف', href: '/' },
  ]);

  toggleMobile(): void {
    this.mobileOpen.update(v => !v);
  }
}
