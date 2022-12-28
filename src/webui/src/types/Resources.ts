import { Tag } from './Tag';

export type SupportedResourceTypes = 'ALL' | 'SA' | 'FA' | 'APS' | 'PG'; // OR others as support is added

export type Resource = {
  index: number;
  visible: boolean;
  name: string;
  tags: Tag[];
};

export type StorageAccount = Resource;

export type Application = Resource & {
  platform: string;
  skuName: string;
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
