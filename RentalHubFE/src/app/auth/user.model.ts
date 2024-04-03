export class User {
  constructor(
    public country: string,
    public email: string,
    public name: string,
    public phoneNumber: string,
    private accessToken: string,
    private expiredAccess: number
  ) {}

  getACToken() {
    return this.accessToken;
  }

  getExpiredAccess() {
    return this.expiredAccess;
  }

  // get RFToken() {
  //   if (!this._RFToken || Date.now() > this._RFExpiredTime) {
  //     return null;
  //   }
  //   return this._RFToken;
  // }
}
