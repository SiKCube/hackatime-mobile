import StyledText from "@/components/ui/text";
import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { gethoursAndMinutes } from "../stats/get-stats";
import ProjectCard, { Project } from "./project-card";
import LoadingSkeleton from "@/components/loading-skeleton";

interface ProjectsRequest {
  projects: ProjectsData[];
}

interface ProjectsData {
  name: string;
  total_seconds: number;
  languages: string[];
  repo_url: string | null;
  total_heartbeats: number;
  first_heartbeat: string;
  last_heartbeat: string;
  most_recent_heartbeat: string;
  archived: boolean;
}

const getSpentTime = (prjlist: Project[]) => {
  let r = 0

  prjlist.forEach((prj) => {
    r += prj.total_seconds
  })

  return gethoursAndMinutes(r)
}

export default function ProjectsList() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [projectsList, setprojectsList] = useState<Project[] | null>(null)

  const { user, userApikey } = useAuthCtx()

  useEffect(() => {
    const getProjectList = async (username: string, apikey: string) => {
      try {
        setLoading(true)
        setError(null)

        const { data }: { data?: ProjectsRequest } = await axios.request({
          method: 'GET',
          url: `https://hackatime.hackclub.com/api/v1/users/${username}/projects/details`,
          headers: {
            Authorization: `Bearer ${apikey}`
          }
        })

        if (!data) throw Error("Can't get projects")

        const prjlist = data.projects

        const r: Project[] = prjlist.map((prj): Project => {
          return {
            name: prj.name,
            archived: prj.archived,
            languages: prj.languages,
            repo_url: prj.repo_url,
            total_seconds: prj.total_seconds,
            last_heartbeat: new Date(prj.last_heartbeat),
          }
        })

        setprojectsList(r)
        setLoading(false)
      } catch (e) {
        setError(`${e}`)
        setLoading(false)
      }
    }

    if (user && userApikey) {
      getProjectList(user.username, userApikey)
    }
  }, [])

  return (
    <ScrollView contentContainerStyle={{ gap: 15, flexDirection: "column", margin: 15 }}>
      <View>
        <StyledText size={20} weight="bold">Projects</StyledText>
        <StyledText>{error}</StyledText>
      </View>
      {
        !loading && projectsList ?
          <StyledText>
            You've spent
            <StyledText weight="bold" type="primary"> {getSpentTime(projectsList)} </StyledText>
            coding across active projects
          </StyledText>
          :
          <LoadingSkeleton
            height={50}
          />
      }
      {
        !loading && projectsList ?
          projectsList.map((prj, index) => {
            return (
              <ProjectCard
                key={index}
                name={prj.name}
                archived={prj.archived}
                languages={prj.languages}
                repo_url={prj.repo_url}
                total_seconds={prj.total_seconds}
                last_heartbeat={prj.last_heartbeat}
              />
            )
          })
          :
          Array.from({ length: 3 }, (_, i) => i).map((v) => <LoadingSkeleton
            height={150}
            key={v}
          />)
}
      <View style={{ height: 150 }} />
    </ScrollView>
  )
}