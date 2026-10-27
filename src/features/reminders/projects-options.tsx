import Alert from "@/components/alert";
import OptionBtn from "@/components/ui/option-btn";
import axios from "axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { View } from "react-native";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";

interface Props { 
  selectedProjects: string[]
  setSelectedProjects: Dispatch<SetStateAction<string[]>>
  disable: boolean
}

export default function ProjectsOptions({ selectedProjects, setSelectedProjects, disable }: Props) {
  const { user, userApikey } = useAuthCtx()
  const [projects, setProjects] = useState<string[]>([])

  useEffect(() => {
    const getprjnames = async (username: string, apikey: string) => {
      const { data } = await axios.request({
        method: "GET",
        url: `https://hackatime.hackclub.com/api/v1/users/${username}/projects`,
        headers: {
          Authorization: `Bearer ${apikey}`
        },
      })

      const prjList: string[] | undefined = data.projects

      if (!prjList) return

      setProjects(prjList)
    }

    if (user && userApikey) {
      getprjnames(user.username, userApikey)
    }
  }, [])

  return (
    <View style={{ flexDirection: "column", gap: 20, marginTop: 10 }}>
      {
        projects.length > 0 ?
          projects.map((prj, i) => {
            const r = selectedProjects.find((v) => v === prj)

            return (
              <OptionBtn
                key={i}
                text={prj}
                selectedKey={prj}
                selected={r ? r : "XD"}
                disable={disable}
                icon="code-slash"
                onClick={() => {
                  if (r) {
                    setSelectedProjects(selectedProjects.filter((v) => v !== prj))
                  } else {
                    setSelectedProjects([...selectedProjects, prj])
                  }
                }}
              />
            )
          })
          :
          <Alert msg={"No projects"} type="error" />
      }
    </View>
  )
}