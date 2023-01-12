import { Tag } from './Tag';

export type SupportedResourceTypes = 'ALL' | 'SA' | 'FA' | 'APS' | 'PG';

export type Resource = {
  index: number;
  comesFromExisting: boolean;
  visible: boolean;
  name: string;
  tags: Tag[];
};

export type StorageAccount = Resource;

export const supportedApplicationSkus = [
  'B1',
  'B2',
  'B3',
  'S1',
  'S2',
  'S3',
  'P1V2',
  'P2V2',
  'P3V2',
  'P1V3',
  'P2V3',
  'P3V3'
] as const;
export type SupportedApplicationSku = typeof supportedApplicationSkus[number];
export const isASupportedApplicationSku = (
  x: any
): x is SupportedApplicationSku => supportedApplicationSkus.includes(x);

export const supportedPlatforms = [
  'DotNet 7',
  'DotNet 6',
  'Node 18',
  'Node 16',
  'Python 3.9',
  'Python 3.8'
] as const;
export type SupportedPlatform = typeof supportedPlatforms[number];
export const isASupportedPlatform = (x: any): x is SupportedPlatform =>
  supportedPlatforms.includes(x);

export type Application = Resource & {
  platform: SupportedPlatform;
  skuName: SupportedApplicationSku;
  appInsights: boolean;
};

export type DatabaseFirewallRule = {
  name: string;
  startIpAddress: string;
  endIpAddress: string;
};

export type Database = Resource & {
  databaseNames: {
    [index: string]: string;
  };
  firewallRules: {
    [index: string]: DatabaseFirewallRule;
  };
};
