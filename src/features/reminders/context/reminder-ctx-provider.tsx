import { createContext, useContext } from "react"
import { Noti } from "./types"
import { useReminderLogic } from "./useReminderLogic"

interface ReminderContextType {
  permission: boolean
  notis: Noti[],
  createWeeklyNoti: ({
    hour, min, projects, weekdays
  }: Omit<Noti, "groupid" | "notisids">) => Promise<void>,
  killAllNotis: () => void,
  askPermission: () => void,
  deleteNotiGroup: (groupid: string) => void,
  printAllNotis: () => void
}

const ReminderContext = createContext<ReminderContextType>({
  permission: false,
  notis: [],
  createWeeklyNoti: async () => { },
  killAllNotis: () => { },
  askPermission: () => { },
  deleteNotiGroup: () => { },
  printAllNotis: () => { }
})

export default function ReminderProvider({ children }: { children: React.ReactNode }) {
  const {
    notis,
    permission,
    createWeeklyNoti,
    killAllNotis,
    askPermission,
    deleteNotiGroup,
    printAllNotis
  } = useReminderLogic()

  return (
    <ReminderContext.Provider value={{
      notis, permission,
      createWeeklyNoti, askPermission,
      killAllNotis, deleteNotiGroup, printAllNotis
    }}>
      {children}
    </ReminderContext.Provider>
  )
}

export const useReminders = () => useContext(ReminderContext)
