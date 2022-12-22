export type Tag = {
  name: string;
  value: string;
};

export type ResourceTagGroups = {
  [index: string]: Tag[];
};

export const emptyTag = {
  name: '',
  value: ''
};
