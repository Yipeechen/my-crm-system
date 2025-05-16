import { RawNode } from '../utils/types';

export type AdaptedNode = {
  name: string;
  attributes: Omit<RawNode, 'name' | 'l' | 'r'> & { introducer_code: string };
  children: AdaptedNode[];
};