export interface CompanyExample {
  company: string;
  description: string;
}

export interface BusinessModel {
  /** Exact key matching Name in 60BM-list-full.csv, MainBM/СмежнаяBM in RelatedBM.csv, and BM1..BM5 in Industries.csv */
  name: string;
  rusName: string;
  shortDescription: string;
  fullDescriptionRu: string;
  fullDescriptionEn: string;
  number: number;
  link: string;
  title: string;
  coOccurrenceTitle: string;
  relatedNames: string[];
  industries: string[];
  examples: CompanyExample[];
}

export interface Industry {
  id: string;
  name: string;
  modelNames: string[];
}

export type TabId = 'home' | 'models' | 'industries';

export type RouteView =
  | { tab: 'home' }
  | { tab: 'models'; modelName?: string }
  | { tab: 'industries'; industryName?: string; modelName?: string };
