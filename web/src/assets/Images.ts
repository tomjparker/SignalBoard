// URL import (normal)
// import eclipseUrl from '@/img/eclipse.svg';

// export function Logos() {
//   return (
//     <div className="stack">
//     //   <Eclipse className="w-8 h-8 text-blue-600" aria-hidden />
//       <img src={eclipseUrl} alt="Eclipse" width={32} height={32} />
//     </div>
//   );
// }

import { ReactComponent as Eclipse } from '@/img/eclipse.svg';
// (Optional) also keep the URL import if you want both:
// import eclipseUrl from '@/img/eclipse.svg';

export function Logos() {
  return (
    <div className="stack">
      <Eclipse> className="w-8 h-8 text-blue-600" aria-hidden />
    </div>
  );
}
