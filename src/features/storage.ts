import AsyncStorage from "@react-native-async-storage/async-storage"

export async function storeData(key: string, data: string) {
  await AsyncStorage.setItem(key, data)
}

export async function getStoredData(key: string) {
  const result = await AsyncStorage.getItem(key)

  return result
}

export async function killAllStoredData() {
  const all =  await AsyncStorage.getAllKeys()

  all.forEach(async (key) => {
    await AsyncStorage.removeItem(key)
  })
}
