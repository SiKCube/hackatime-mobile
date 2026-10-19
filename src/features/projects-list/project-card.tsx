import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Button, Linking, Text, View } from "react-native";
import { gethoursAndMinutes } from "../get-stats";

export interface Project {
  name: string;
  total_seconds: number;
  languages: string[];
  repo_url: string | null;
  archived: boolean;
}

export default function ProjectCard({ name, archived, languages, total_seconds, repo_url }: Project) {
  return (
    <View style={{ borderColor: "blue", borderWidth: 2, borderRadius: 10, padding: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap" }}>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{name}</Text>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>{gethoursAndMinutes(total_seconds)}</Text>
      </View>
      {
        archived ?
          <Ionicons name="archive" size={20} />
          :
          null
      }
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 3, width: 200 }}>
        {languages.map((leng) =>
          <Text style={{ fontSize: 10 }} >{leng}</Text>
        )}
      </View>
      <View style={{ flexDirection: "row", gap: 5 }}>
        {
          repo_url ?
            <Button onPress={() => Linking.openURL(repo_url)} title="View repo" />
            :
            null
        }
        <Link href={{
          pathname: "/in-app/projects/[projectId]",
          params: { projectId: name }
        }} >
          Details
        </Link>
      </View>
    </View>
  )
}