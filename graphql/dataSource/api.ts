import { RawNode } from "@/utils/types";

const MAX_DEPTH = 3;

export default class SourceAPI {

  API_URL = process.env.API_URL as string;
  X_API_KEY = process.env.X_API_KEY as string;

  async fetchNode(code: string): Promise<RawNode> {
    const uri = `${this.API_URL}/api/policyholders`
    const result = await fetch(`${uri}?code=${code}`, {
      method: 'GET',
      headers: {
        'x-api-key': this.X_API_KEY
      }
    }).then(res => res.json())

    return result;
  }

  async getPolicyholderDetail(code: string, depth: number = 1): Promise<RawNode> {
    const node = await this.fetchNode(code);

    if (depth >= MAX_DEPTH) return node;

    if (Array.isArray(node.l)) {
      const expandedL = await Promise.all(
        node.l.map(child => this.getPolicyholderDetail(child.code, depth + 1))
      );
      node.l = expandedL;
    }

    if (Array.isArray(node.r)) {
      const expandedR = await Promise.all(
        node.r.map(child => this.getPolicyholderDetail(child.code, depth + 1))
      );
      node.r = expandedR;
    }

    return node;
  }

}
