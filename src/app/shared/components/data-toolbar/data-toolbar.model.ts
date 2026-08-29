export interface ToolbarOption {
  value: string;
  labelKey: string;
}

export interface ToolbarFilter {
  key: string;
  labelKey: string;
  options: ToolbarOption[];
}
