import { Tag } from './Tag';

export type StorageAccount = {
  index: number;
  visible: boolean;
  name: string;
  tags: Tag[];
};
