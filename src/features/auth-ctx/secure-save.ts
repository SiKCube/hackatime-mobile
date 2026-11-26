import * as SecureStore from "expo-secure-store"

export type SECURE_KEYS_TYPE = "apikey" | "oauth-token"
const SECURES_KEYS: SECURE_KEYS_TYPE[] = [
  "apikey",
  "oauth-token",
]

export async function saveSecure(item: SECURE_KEYS_TYPE, secureValue: string, ) {
  try {
    await SecureStore.setItemAsync(item, secureValue)
  } catch (e) {
    throw Error("Upps... something bad when saving item: " + e)
  }
}
 
export async function killSecures() {
  try {
    SECURES_KEYS.forEach(async (KEY) => {
      await SecureStore.deleteItemAsync(KEY)
    })
  } catch (e) {
    throw Error("Can't delete keys")
  }
}

export async function getSecure(item: SECURE_KEYS_TYPE): Promise<string | null> {
  try {
    const secureValue = await SecureStore.getItemAsync(item)
  
    return secureValue
  } catch (e) {
    throw Error("Upps... something bad when getting stored item: " + e)
  }
}
