import { Component, OnInit } from '@angular/core';
import {PaymentServiceService} from '../payment-service.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentMethods: PaymentMethod[];
  selectedMethod: PaymentMethod;
  amount = 5;
  currency = 'USD';
  cvvValue;
  expMonthValue;
  expYearValue;

  wrongMonthDate = false;
  wrongYearDate = false;
  wrongDate = false;
  nameReg = false;
  numberReg = false;
  wrongCVV = false;

  successfullyPayment = false;
  deniedPayment = false;

  constructor(private paymentService: PaymentServiceService) {
  }

  ngOnInit() {
    this.changeCountry('UA');
  }

  chooseMethod( method: PaymentMethod) {
    this.selectedMethod = method;
  }

  changeCountry(countryCode) {
    console.log(countryCode);
    this.paymentService.getPaymentMethods(countryCode).subscribe((value: []) => {
      this.paymentMethods = value;
      console.log(this.paymentMethods);
      this.selectedMethod = this.paymentMethods[0];
    });
  }

  buttonClick(payForm) {
    const successfullyPayment = 0.5 > Math.random();
    if (successfullyPayment) {
      this.successfullyPayment = true;
      setTimeout(() => {
        this.successfullyPayment = false;
      }, 2000);
    } else {
      this.deniedPayment = true;
      setTimeout(() => {
        this.deniedPayment = false;
      }, 2000);
    }
  }

  cvvCheck() {
    if (this.cvvValue) {
      if (this.cvvValue.toString().length > 3) {
        this.cvvValue = this.cvvValue.toString().slice(0, 3);
        console.log(this.cvvValue);
      } else {
        this.wrongCVV = this.cvvValue.toString().length < 3;
      }
    }
  }

  expMonthCheck() {
    if (this.expMonthValue) {
      if (this.expMonthValue.toString().match(/[^0-9]/)) {
        this.expMonthValue = '';
      }
      (this.expMonthValue < 1
        || this.expMonthValue > 12
        || this.expMonthValue.toString().length !== 2) ? this.wrongMonthDate = true : this.wrongMonthDate = false;

      if (this.expYearValue && this.expMonthValue) {
        if (this.expYearValue.toString().length === 2 && this.expMonthValue.toString().length === 2) {
          this.checkData();
        }
      }
    }
  }

  expYearCheck() {
    if (this.expYearValue) {
      if (this.expYearValue.toString().match(/[^0-9]/)) {
        this.expYearValue = '';
      }
      this.expYearValue.toString().length !== 2 ? this.wrongYearDate = true : this.wrongYearDate = false;

      if (this.expYearValue && this.expMonthValue) {
        if (this.expYearValue.toString().length === 2 && this.expMonthValue.toString().length === 2) {
          this.checkData();
        }
      }

    }
  }

 private checkData() {
    const dateNow = Date.now();
    const cardDate = new Date(+`20${this.expYearValue}`, this.expMonthValue);
    this.wrongDate = dateNow > cardDate.getTime() ;
  }

  cardHolderName(name) {
    name.match(/^[\s]|\s$|[^A-Za-z\s]/) ? this.nameReg = true : this.nameReg = false;
  }

  cardNumberInput(number) {
    number.toString().length === 16 ? (this.numberReg = this.luhnAlgorithm(number)) : this.numberReg = true;
    console.log(this.numberReg);
  }

 private luhnAlgorithm(digits) {
    let sum = 0;

    for (let i = 0; i < digits.length; i++) {
      let cardNum = +digits[i];

      if ((digits.length - i) % 2 === 0) {
        cardNum = cardNum * 2;

        if (cardNum > 9) {
          cardNum = cardNum - 9;
        }
      }

      sum += cardNum;
    }

    return sum % 10 === 0;
  }
}
