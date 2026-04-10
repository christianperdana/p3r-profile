export interface OptionValue {
  name: string;
  rotation: number;
  zIndex: number;
  offsetX: number;
  offsetY: number;
  description: string;
  /** Extra copy shown when this section is selected */
  detail?: string;
  /** Optional link (e.g. GitHub, email, CV) */
  link?: { label: string; href: string };
}
