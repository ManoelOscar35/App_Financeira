import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private storeRegisterRevenues = new BehaviorSubject<boolean>(false);
  private storeRegisterDebts = new BehaviorSubject<boolean>(false);
  private storeMonth = new BehaviorSubject<string>('');
  private searchRevenuesByMonth = new BehaviorSubject<boolean>(false);
  private searchDebtsByMonth = new BehaviorSubject<boolean>(false);
  private debtsPrev = new BehaviorSubject<boolean>(false);
  private debtsNext = new BehaviorSubject<boolean>(false);
  private revenuesPrev = new BehaviorSubject<boolean>(false);
  private revenuesNext = new BehaviorSubject<boolean>(false);
  private balanceRevenuesTotal = new BehaviorSubject<any>(null);
  private balanceDebtsTotal = new BehaviorSubject<any>(null);
  private revenuesTotal = new BehaviorSubject<any>(null);
  private debtsTotal = new BehaviorSubject<any>(null);
  private balanceTotal = new BehaviorSubject<boolean>(false);


  constructor() { }

  setStoreMonth(value: string) {
    this.storeMonth.next(value);
  }

  getStoreMonth() {
    return this.storeMonth.asObservable();
  }

  setStoreRevenues(value: boolean) {
    this.storeRegisterRevenues.next(value);
  }

  getStoreRevenues(): Observable<boolean> {
    return this.storeRegisterRevenues.asObservable();
  }

  setStoreDebts(value: boolean) {
    this.storeRegisterDebts.next(value);
  }

  getStoreDebts(): Observable<boolean> {
    return this.storeRegisterDebts.asObservable();
  }

  setSearchRevenuesByMonth(valor: boolean) {
    this.searchRevenuesByMonth.next(valor);
  }

  getSearchRevenuesByMonth() {
    return this.searchRevenuesByMonth.asObservable();
  }

  setSearchDebtsByMonth(valor: boolean) {
    this.searchDebtsByMonth.next(valor);
  }

  getSearchDebtsByMonth() {
    return this.searchDebtsByMonth.asObservable();
  }

  setDebtsPrev(value: boolean) {
    this.debtsPrev.next(value);
  }

  getDebtsPrev() {
    return this.debtsPrev.asObservable();
  }

  setDebtsNext(value: boolean) {
    this.debtsNext.next(value);
  }

  getDebtsNext() {
    return this.debtsNext.asObservable();
  }

  setRevenuesPrev(value: boolean) {
    this.revenuesPrev.next(value);
  }

  getRevenuesPrev() {
    return this.revenuesPrev.asObservable();
  }

  setRevenuesNext(value: boolean) {
    this.revenuesNext.next(value);
  }

  getRevenuesNext() {
    return this.revenuesNext.asObservable();
  }

  setBalanceRevenuesTotal(value: any) {
    this.balanceRevenuesTotal.next(value);
  }

  getBalanceRevenuesTotal() {
    return this.balanceRevenuesTotal.asObservable();
  }

  setBalanceDebtsTotal(value: any) {
    this.balanceDebtsTotal.next(value);
  }

  getBalanceDebtsTotal() {
    return this.balanceDebtsTotal.asObservable();
  }

  setRevenuesTotal(value: any) {
    this.revenuesTotal.next(value)
  }

  getRevenuesTotal() {
    return this.revenuesTotal.asObservable();
  }

  setDebtsTotal(value: any) {
    this.debtsTotal.next(value)
  }

  getDebtsTotal() {
    return this.debtsTotal.asObservable();
  }

  setBalanceTotal(value: boolean) {
    this.balanceTotal.next(value)
  }

  getBalanceTotal() {
    return this.balanceTotal.asObservable()
  }
}
