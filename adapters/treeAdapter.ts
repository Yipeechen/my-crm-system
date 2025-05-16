import { RawNode } from '../utils/types';
import { AdaptedNode } from './treeAdapter.type';

export const adaptToTree = (node: RawNode): AdaptedNode => {
  const children: AdaptedNode[] = [];

  if (Array.isArray(node?.l)) {
    node.l.forEach((child) => children.push(adaptToTree(child)));
  }

  if (Array.isArray(node?.r)) {
    node.r.forEach((child) => children.push(adaptToTree(child)));
  }


  return {
    name: node?.name,
    attributes: {
      code: node?.code,
      registration_date: node?.registration_date,
      introducer_code: node?.introducer_code ?? '',
    },
    children
  };
}