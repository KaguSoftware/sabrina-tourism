export interface FilterState {
  region: string;
  people: number;
  date: string;
}

export interface FilterBarProps {
  filters: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  onClear: () => void;
}
