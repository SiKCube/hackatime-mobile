import AsyncStorage from "@react-native-async-storage/async-storage"

export type STORE_KEYS_TYPE = "usermetadata" | "notis" | "theme"

export const STORE_KEYS = {
  usermetadata: "usermetadata",
  notis: "notis",
  theme: "theme"
}

export async function storeData(key: STORE_KEYS_TYPE, data: string) {
  await AsyncStorage.setItem(key, data)
}

export async function getStoredData(key: STORE_KEYS_TYPE) {
  const result = await AsyncStorage.getItem(key)

  return result
}

export async function killAllStoredData() {
  const all =  await AsyncStorage.getAllKeys()

  all.forEach(async (key) => {
    await AsyncStorage.removeItem(key)
  })
}
