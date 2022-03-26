import "twin.macro";
import { CSSInterpolation } from "@emotion/serialize";
import { css as cssImport } from "@emotion/react";
import styledImport from "@emotion/styled";

declare module "twin.macro" {
  export const styled: typeof styledImport;
  export const css: typeof cssImport;
}

declare module "react" {
  interface HTMLAttributes<T> extends DOMAttributes<T> {
    css?: CSSInterpolation;
    tw?: string;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface SVGProps<T> extends SVGProps<SVGSVGElement> {
    css?: CSSInterpolation;
    tw?: string;
  }
}
