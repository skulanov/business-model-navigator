import bmRaw from './csv/60BM-list-full.csv?raw';
import industriesRaw from './csv/Industries.csv?raw';
import relatedRaw from './csv/RelatedBM.csv?raw';
import { COMPANY_EXAMPLES } from './companyExamples';
import { parseSemicolonCsv } from './csvParser';
import type { BusinessModel, Industry } from './types';

function cleanQuotedLabel(value: string): string {
  // Some CSV fields like """Add-on"" co-occurances:" contain extra double quotes
  return value.replace(/^"+|"+$/g, '').replace(/""/g, '"').trim();
}

function buildDataset(): {
  businessModels: BusinessModel[];
  businessModelByName: Map<string, BusinessModel>;
  industries: Industry[];
  industryByName: Map<string, Industry>;
} {
  // 1. Parse RelatedBM.csv strictly preserving row order per MainBM
  const relatedRows = parseSemicolonCsv(relatedRaw).slice(1);
  const relatedMap = new Map<string, string[]>();
  for (const row of relatedRows) {
    const mainBm = (row[0] ?? '').trim();
    const relatedBm = (row[1] ?? '').trim();
    if (!mainBm || !relatedBm) continue;
    const list = relatedMap.get(mainBm) ?? [];
    list.push(relatedBm);
    relatedMap.set(mainBm, list);
  }

  // 2. Parse Industries.csv strictly preserving industry and column order (BM1..BM5)
  const industryRows = parseSemicolonCsv(industriesRaw).slice(1);
  const industries: Industry[] = [];
  const industriesByModel = new Map<string, string[]>();

  for (const row of industryRows) {
    const industryName = (row[0] ?? '').trim();
    if (!industryName) continue;
    const modelNames: string[] = [];
    for (let i = 1; i < row.length; i++) {
      const bmName = (row[i] ?? '').trim();
      if (bmName) {
        modelNames.push(bmName);
        const list = industriesByModel.get(bmName) ?? [];
        if (!list.includes(industryName)) {
          list.push(industryName);
        }
        industriesByModel.set(bmName, list);
      }
    }
    industries.push({
      id: industryName,
      name: industryName,
      modelNames,
    });
  }

  // 3. Parse 60BM-list-full.csv preserving order (1..60)
  const bmRows = parseSemicolonCsv(bmRaw).slice(1);
  const businessModels: BusinessModel[] = [];

  for (const row of bmRows) {
    const name = (row[0] ?? '').trim();
    if (!name) continue;

    const rusName = (row[1] ?? '').trim() || name;
    const shortDescription = cleanQuotedLabel(row[2] ?? '');
    const fullDescriptionRu = cleanQuotedLabel(row[3] ?? '');
    const fullDescriptionEn = cleanQuotedLabel(row[4] ?? '');
    const number = Number.parseInt((row[5] ?? '0').trim(), 10) || businessModels.length + 1;
    const link = (row[6] ?? '').trim();
    const title = (row[7] ?? '').trim() || `${number} ${name}`;
    const coOccurrenceTitle = cleanQuotedLabel(row[8] ?? `"${name}" co-occurances:`);

    businessModels.push({
      name,
      rusName,
      shortDescription,
      fullDescriptionRu,
      fullDescriptionEn,
      number,
      link,
      title,
      coOccurrenceTitle,
      relatedNames: relatedMap.get(name) ?? [],
      industries: industriesByModel.get(name) ?? [],
      examples: COMPANY_EXAMPLES[name] ?? [],
    });
  }

  const businessModelByName = new Map<string, BusinessModel>(
    businessModels.map((m) => [m.name, m])
  );
  const industryByName = new Map<string, Industry>(
    industries.map((ind) => [ind.name, ind])
  );

  return {
    businessModels,
    businessModelByName,
    industries,
    industryByName,
  };
}

const dataset = buildDataset();

export const BUSINESS_MODELS = dataset.businessModels;
export const BUSINESS_MODEL_BY_NAME = dataset.businessModelByName;
export const INDUSTRIES = dataset.industries;
export const INDUSTRY_BY_NAME = dataset.industryByName;

export function getRelatedModels(modelName: string): BusinessModel[] {
  const model = BUSINESS_MODEL_BY_NAME.get(modelName);
  if (!model) return [];
  return model.relatedNames
    .map((relatedName) => BUSINESS_MODEL_BY_NAME.get(relatedName))
    .filter((m): m is BusinessModel => Boolean(m));
}

export function getIndustryModels(industryName: string): BusinessModel[] {
  const industry = INDUSTRY_BY_NAME.get(industryName);
  if (!industry) return [];
  return industry.modelNames
    .map((modelName) => BUSINESS_MODEL_BY_NAME.get(modelName))
    .filter((m): m is BusinessModel => Boolean(m));
}
