import 'react';

// Module augmentation — this extends React's built-in CSSProperties
declare module 'react' {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

// Global declarations — these are available everywhere
declare global {
  type Item = { id: string; label: string };
  type SetItems = React.Dispatch<React.SetStateAction<Item[]>>;
}

// Mark the file as a module so TS doesn’t complain
export {};