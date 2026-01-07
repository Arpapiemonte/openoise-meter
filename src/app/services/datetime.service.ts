import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import {  
  addDays,
  differenceInDays, 
  differenceInHours, 
  differenceInMinutes,
  differenceInMilliseconds, 
  format, 
  fromUnixTime,
  getHours, 
  setDefaultOptions,
  subDays, 
} from 'date-fns';
import { it, enUS, fr, es, de, Locale } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class DatetimeService {
  private localeSubject = new BehaviorSubject<Locale>(it);
  locale$ = this.localeSubject.asObservable();

  public instances: DateWrapper[] = []; // Lista degli oggetti creati

  constructor(
  ) {
    this.setLocale(it); // Imposta italiano come default

    // Quando cambia la lingua, aggiorna tutte le date
    this.locale$.subscribe(locale => {
      console.log("locale$.subscribe", locale)
      this.setLocale(locale);
      this.instances.forEach(instance => {
        // console.log("instance", instance)
        instance.updateProperties()
      });
    });
  }

  // Cambia lingua globalmente
  setLanguage(lang: string) {
    console.log("setLanguage", lang)
    const locales: { [key: string]: Locale } = { it, en: enUS, fr, es, de };
    this.localeSubject.next(locales[lang] || it);
    this.setLocale(locales[lang]);
  }

  // Imposta il locale di default in date-fns
  private setLocale(locale: Locale) {
    // console.log("setLocale", locale)
    setDefaultOptions({ locale });
  }

  // Restituisce la lingua attuale
  getCurrentLocale(): Locale {
    return this.localeSubject.value;
  }

  // Crea e registra un'istanza di DateWrapper
  newDate(input: any = ""): DateWrapper {
    var date: any
    if (typeof input === 'string') {
      if (input == "") {
        date = new Date()
      } else {
        date = new Date(input)
      }
    } else if (typeof input === 'number' && !isNaN(input)) {
      date = fromUnixTime(input)
    } else if (input instanceof Date && !isNaN(input.getTime())) {
      date = input
    }

    const wrapper = new DateWrapper(date, this);
    this.instances.push(wrapper);
    return wrapper;
  }

  diffInDays(date1: any, date2: any) {
    return differenceInDays(date1, date2)
  }

  diffInHours(date1: any, date2: any) {
    return differenceInHours(date1, date2)
  }

  diffInMinutes(date1: any, date2: any) {
    return differenceInMinutes(date1, date2)
  }

  diffInMilliseconds(date1: any, date2: any) {
    return differenceInMilliseconds(date1, date2)
  }

}



// Classe interna DateWrapper
export class DateWrapper {
  public format_yyyyMMdd: any;
  public format_yyyy_MM_dd: any;
  public format_ddMMyyyy: any;
  public format_EEEEddMMyyyy: any;
  public format_EEEddMMyyyy: any;
  public format_EEEEddMM: any;
  public format_EEEddMM: any;
  public format_EEEddMMM: any;
  public format_ddMM: any;
  public format_MMdd: any;
  public format_ddMMMM: any;

  constructor(
    private date: Date,
    private datetimeService: DatetimeService
  ) {
    this.updateProperties();
  }

  updateProperties() {
    // console.log("updateProperties")
    this.format_yyyyMMdd = format(this.date, 'yyyy/MM/dd')
    this.format_yyyy_MM_dd = format(this.date, 'yyyy-MM-dd')
    this.format_ddMMyyyy = format(this.date, 'dd/MM/yyyy')
    this.format_EEEEddMMyyyy = this.capitalizeFirstLetter(format(this.date, 'EEEE dd/MM/yyyy'))
    this.format_EEEddMMyyyy = this.capitalizeFirstLetter(format(this.date, 'EEE dd/MM/yyyy'))
    this.format_EEEEddMM = this.capitalizeFirstLetter(format(this.date, 'EEEE dd/MM'))
    this.format_EEEddMM = this.capitalizeFirstLetter(format(this.date, 'EEE dd/MM'))
    this.format_EEEddMMM = this.capitalizeFirstLetter(format(this.date, 'EEE dd MMM'))
    this.format_ddMM = format(this.date, 'dd/MM');
    this.format_MMdd = format(this.date, 'MM/dd');
    this.format_ddMMMM = format(this.date, 'dd MMMM');
  }

  format(stringFormat: string) {
    return format(this.date, stringFormat);
  }

  addDays(days: number): DateWrapper {
    const wrapper = new DateWrapper(addDays(this.date, days), this.datetimeService);
    this.datetimeService.instances.push(wrapper)
    return wrapper;
  }

  subtractDays(days: number): DateWrapper {
    const wrapper = new DateWrapper(subDays(this.date, days), this.datetimeService);
    this.datetimeService.instances.push(wrapper)
    return wrapper;
  }

  getHours() {
    return getHours(this.date)
  }

  capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

}
