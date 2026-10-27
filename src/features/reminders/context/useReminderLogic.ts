import {
  cancelAllScheduledNotificationsAsync,
  cancelScheduledNotificationAsync,
  getAllScheduledNotificationsAsync,
  requestPermissionsAsync,
  SchedulableTriggerInputTypes,
  scheduleNotificationAsync
} from "expo-notifications";
import { useEffect, useState } from "react";
import { STORE_KEYS } from "../../../../consts";
import { getStoredData, storeData } from "../../storage";
import type { Noti } from "./types";

export function useReminderLogic() {
  const [permission, setPermission] = useState<boolean>(false)
  const [notis, setNotis] = useState<Noti[]>([])

  const askPermission = async () => {
    const permission = await requestPermissionsAsync()

    if (permission.granted) {
      setPermission(true)
    }
  }

  const createWeeklyNoti = async ({
    hour, min, projects, weekdays
  }: Omit<Noti, "groupid" | "notisids">): Promise<void> => {
    if (permission && weekdays.length > 0) {
      const groupid = String(Math.random()).split(".")[1]
      let notisids: string[] = []

      // schedule per weekday
      await Promise.all(weekdays.map(async (weekday): Promise<void> => {
        const id = await scheduleNotificationAsync({
          content: {
            title: `Time to code for ${hour}h`,
            body: `This counts for ${projects.length > 0 ? `this projects: ${projects.join(", ")}` : "All projects"}`,
            data: {
              groupid: groupid,
            }
          },
          trigger: {
            type: SchedulableTriggerInputTypes.WEEKLY,
            weekday: weekday,
            hour: hour,
            minute: min,
          }
        })

        notisids.push(id)
      }))

      setNotis([
        ...notis, {
          weekdays: weekdays,
          projects: projects,
          hour: hour,
          min: min,
          groupid: groupid,
          notisids: notisids
        }
      ])
    }
  }

  const deleteNotiGroup = async (groupid: string) => {
    if (permission) {
      const notisGroup = notis.find((noti) => noti.groupid === groupid)

      if (!notisGroup) return

      await Promise.all(notisGroup.notisids.map(async (id): Promise<void> => {
        await cancelScheduledNotificationAsync(id)
      }))

      const otherNotis = notis.filter((noti) => noti.groupid !== groupid)

      setNotis(otherNotis)
    }
  }

  const printAllNotis = async () => {
    const notis = await getAllScheduledNotificationsAsync()
    const storedNotis = await getStoredData(STORE_KEYS.notis)
    console.log(storedNotis)

    notis.map((noti, i) => {
      console.log(`${i}: ${JSON.stringify(noti)}`)
    })
  }

  const killAllNotis = async () => {
    if (permission) {
      await cancelAllScheduledNotificationsAsync()
      await storeData(STORE_KEYS.notis, "[]")
      setNotis([])
    }
  }

  const storeNotiState = async () => {
    await storeData(STORE_KEYS.notis, JSON.stringify(notis))
  }

  useEffect(() => {
    (async () => {
      const storednotis = await getStoredData(STORE_KEYS.notis)
      const permission = await requestPermissionsAsync()

      setPermission(permission.granted)
      setNotis(storednotis ? JSON.parse(storednotis) : [])
    })()
  }, [])

  useEffect(() => {
    storeNotiState()
  }, [notis])

  return {
    askPermission, createWeeklyNoti, killAllNotis, deleteNotiGroup, printAllNotis,
    notis, permission
  }
}