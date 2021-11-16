import CryptoJS from 'crypto-js'
import config from './config'

export const getQueryValue = (name: string) => {
  let url = window.location.href + ''
  name = name.replace(/[\[\]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

// ---------------------- crypto ------------------------------------------
export const encrypt = (data: any) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), process.env.REACT_APP_CRYPTO_KEY || '1234567890').toString()
export const decrypt = (ciphertext: string) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, process.env.REACT_APP_CRYPTO_KEY || '1234567890')
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
}

// ---------------------- local storage --------------------------------------------------------------
export const setStorageItem = (key: string, data: any) => {
  localStorage.setItem(config.appID + '_' + key, encrypt(JSON.stringify(data)))
}

export const getStorageItem = (key: string, defaultVal: any) => {
  try {
    return JSON.parse(
      decrypt(localStorage.getItem(config.appID + '_' + key) as string)
    )
  } catch (e) {
    return defaultVal || false
  }
}

export const deleteStorageItem = (key: string) => {
  localStorage.removeItem(config.appID + '_' + key)
}
