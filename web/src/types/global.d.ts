/// <reference types="vite-plugin-svgr/client" />

import 'react';

declare module "*.svg" {
  import * as React from "react";
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >;
  const src: string;
  export default src;
}

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
  type Issue = {
  id: string;
  title: string;
  description?: string | null;
  status?: string;
  priority?: number;
  createdAt?: string;
  updatedAt?: string;
  boardId?: string;
  };
  type Board = {
  id: string;
  name: string;
  slug: string;
  createdAt?: string;
  updatedAt?: string;
  };
}



// Mark the file as a module so TS doesn’t complain
export {};