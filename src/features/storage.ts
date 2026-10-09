import AsyncStorage from "@react-native-async-storage/async-storage"
import { STORE_KEYS, STORE_KEYS_TYPE } from "../../consts"

export async function storeData(key: STORE_KEYS_TYPE, data: string) {
  await AsyncStorage.setItem(key, data)
}

export async function getStoredData(key: STORE_KEYS_TYPE) {
  const result = await AsyncStorage.getItem(key)

  return result
}

export async function killAllStoredData() {
  STORE_KEYS.forEach(async (key) => {
    await AsyncStorage.removeItem(key)
  })
}
