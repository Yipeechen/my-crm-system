export default class SourceAPI {

  API_URL = process.env.API_URL as string;
  X_API_KEY = process.env.X_API_KEY as string;

  async getPolicyholderDetail (code: string) {
    const uri = `${this.API_URL}/api/policyholders`
    const result = await fetch(`${uri}?code=${code}`, {
      method: 'GET',
      headers: {
        'x-api-key': this.X_API_KEY
      }
    }).then(res => res.json())

    return [result]
  }

}
