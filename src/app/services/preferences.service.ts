import { Injectable } from '@angular/core';

import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class PreferencesService {

  constructor() {
    Preferences.migrate()
  }

  async keys() {
    const { keys } = await Preferences.keys();
    console.log('Got keys: ', keys);
  }

  async set(key: any, value: any) {
    if (typeof value === 'object') {
      // console.log("set2 value is an object")
      value = JSON.stringify(value)
    }
    // console.log("set2 string(value)",String(value))
    await Preferences.set({
      key: key,
      value: String(value)
    });
  }

  async get(key: any) {
    var result: any = await Preferences.get({ key: key });
    // console.log("get", key, result)
    // console.log("get result.value", key, result.value)
    try {
      // console.log("get TRY")
      // console.log("JSON.parse(result.value)",JSON.parse(result.value))
      return Promise.resolve(JSON.parse(result.value))
    } catch {
      // console.log("get CATCH")
      return Promise.resolve(result.value)
    }
  }

}
