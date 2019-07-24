import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaymentServiceService {
  url = 'https://api.paymentwall.com/api/payment-systems/';
  key = 'key=6b8c305aebc93f4f9130cfa90267788e';
  countryCode = 'country_code=';

  constructor(private http: HttpClient) { }

  getPaymentMethods(countryCode) {
    const fullUrl = `${this.url}?${this.key}&${this.countryCode}${countryCode}`;
    return this.http.get(fullUrl);
  }

  getCountry() {
    return  this.http.get('https://ipinfo.io?token=104ede535d04f1');
  }
}
