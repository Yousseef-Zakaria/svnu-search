// Strict type checking requires explicit interfaces
export interface SearchFilter {
  readonly id: string;
  readonly label: string;
}

export interface Statistic {
  readonly id: string;
  readonly value: string;
  readonly label: string;
}

export interface MaterialCategory {
  readonly id: string;
  readonly title: string;
  readonly count: number;
  readonly icon: string; // Emoji representation for simplicity in this example
  readonly colorClass: string; // Tailwinds classes for context (bg, text, border)
}

export interface TrendingSearch {
  readonly id: string;
  readonly term: string;
  readonly resultsCount: number;
  readonly type: string;
}