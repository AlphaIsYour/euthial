declare module "*.css";
declare module "react-dom/server.edge" {
  import type { ReactElement } from "react";
  export function renderToStaticMarkup(element: ReactElement): string;
  export function renderToString(element: ReactElement): string;
}
