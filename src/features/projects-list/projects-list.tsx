import LoadingSkeleton from "@/components/loading-skeleton";
import StyledText from "@/components/ui/text";
import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useAuthCtx } from "../auth-ctx/auth-ctx-provider";
import { gethoursAndMinutes } from "../stats/get-stats";
import { useTheme } from "../theme/context/theme-ctx-provider";
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
  const { themeData } = useTheme()

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

  useEffect(() => {
    if (user && userApikey) {
      getProjectList(user.username, userApikey)
    }
  }, [])

  return (
    <View
      style={{ gap: 20, flexDirection: "column", padding: 20 }}
    >
      <View>
        <StyledText size={20} weight="bold"><StyledText weight="bold" size={20} type="primary">Your</StyledText> Projects</StyledText>
        <StyledText>{error}</StyledText>
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
      </View>
      {
        !loading && projectsList ?
          <FlatList
            refreshControl={<RefreshControl refreshing={loading}
              onRefresh={() => {
                if (user && userApikey) {
                  getProjectList(user.username, userApikey)
                }
              }}
              colors={[themeData.primary]}
              progressBackgroundColor={themeData.darkless}
              progressViewOffset={-10}
            />}
            refreshing={loading}
            data={projectsList}
            keyExtractor={(_, i) => i.toString()}
            renderItem={prj =>
              <ProjectCard
                name={prj.item.name}
                archived={prj.item.archived}
                languages={prj.item.languages}
                repo_url={prj.item.repo_url}
                total_seconds={prj.item.total_seconds}
                last_heartbeat={prj.item.last_heartbeat}
              />
            }
            ItemSeparatorComponent={<View style={{ height: 20 }} />}
            getItemLayout={(data, index) => (
              { length: 100, offset: 100 * index, index }
            )}
            initialScrollIndex={0}
            initialNumToRender={3}
          />
          :
          Array.from({ length: 3 }, (_, i) => i).map((v) => <LoadingSkeleton
            height={150}
            key={v}
          />)
      }
    </View>
  )
}