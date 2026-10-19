import axios from "axios";
import { useEffect, useState } from "react";
import { ScrollView, Text, TextInput, View,  } from "react-native";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { gethoursAndMinutes } from "../get-stats";
import ProjectCard, { Project } from "./project-card";

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
            total_seconds: prj.total_seconds
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
        <Text style={{ fontSize: 25 }}>Projects</Text>
        <Text>{error}</Text>
        {/* <TextInput placeholder="Search" /> */}
      </View>
      {
        !loading && projectsList ?
          <Text>
            You've spent
            <Text style={{ fontWeight: "bold" }}> {getSpentTime(projectsList)} </Text>
            coding across active projects
          </Text>
          :
          null
      }
      {
        loading ?
          <Text>Loading...</Text>
          :
          projectsList ?
            projectsList.map((prj, index) => {
              return (
                <ProjectCard
                  key={index}
                  name={prj.name}
                  archived={prj.archived}
                  languages={prj.languages}
                  repo_url={prj.repo_url}
                  total_seconds={prj.total_seconds}
                />
              )
            })
            :
            <Text>No projects</Text>
      }
      <View style={{ height: 150 }} />
    </ScrollView>
  )
}