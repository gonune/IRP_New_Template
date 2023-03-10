export type Tag = {
  name: string;
  value: string;
};

export type ResourceTagGroups = {
  [index: string]: {
    comesFromExisting: boolean;
    tagList: Tag[];
  };
};

export const emptyTag = {
  name: '',
  value: ''
};
