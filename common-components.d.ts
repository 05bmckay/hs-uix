import type { ReactNode } from "react";
import type {
  AutoTagOptions,
  AutoTagVariant,
  AutoStatusTagOptions,
  AutoStatusTagVariant,
} from "./utils";

export interface AutoTagProps extends AutoTagOptions {
  value?: unknown;
  tag?: unknown;
  children?: ReactNode;
  variant?: AutoTagVariant;
  onClick?: () => void;
  onDelete?: () => void;
  overlay?: unknown;
  inline?: boolean;
}

export interface AutoStatusTagProps extends AutoStatusTagOptions {
  value?: unknown;
  status?: unknown;
  children?: ReactNode;
  variant?: AutoStatusTagVariant;
  hollow?: boolean;
  onClick?: () => void;
  showRemoveIcon?: boolean;
  onRemoveClick?: () => void;
}

export interface SectionHeaderProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  gap?: string;
  titleAs?: string;
}

export interface KeyValueListItem {
  key?: string | number;
  label: ReactNode;
  value: ReactNode;
}

export interface KeyValueListProps {
  items?: KeyValueListItem[];
  direction?: "row" | "column";
  gap?: string;
}

export declare function AutoTag(props: AutoTagProps): ReactNode;
export declare function AutoStatusTag(props: AutoStatusTagProps): ReactNode;
export declare function SectionHeader(props: SectionHeaderProps): ReactNode;
export declare function KeyValueList(props: KeyValueListProps): ReactNode;
