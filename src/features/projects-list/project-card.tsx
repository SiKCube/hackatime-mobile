import { THEME } from "@/components/theme";
import StyledButton from "@/components/ui/button";
import StyledLinkButton from "@/components/ui/button-link";
import StyledCard from "@/components/ui/card";
import StyledText from "@/components/ui/text";
import { Ionicons } from "@expo/vector-icons";
import { Linking, View } from "react-native";
import { gethoursAndMinutes } from "../stats/get-stats";

export interface Project {
  name: string;
  total_seconds: number;
  languages: string[];
  repo_url: string | null;
  archived: boolean;
  last_heartbeat: Date
}

export default function ProjectCard({ name, archived, languages, total_seconds, repo_url, last_heartbeat }: Project) {
  return (
    <StyledCard>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 5, flexWrap: "wrap" }}>
        <StyledText size={20} weight="bold">{name}</StyledText>
        <StyledText size={20} weight="bold" type="primary">{gethoursAndMinutes(total_seconds)}</StyledText>
      </View>
      {
        archived ?
          <Ionicons name="archive" size={20} />
          :
          null
      }
      <View style={{ flexDirection: "row", justifyContent: "flex-start", gap: 3, alignItems: "center" }}>
        <Ionicons name="time" size={20} color={THEME.primary} />
        <StyledText size={13} type="seconday">
          Last heartbeat:
          <StyledText type="primary" size={13}> {gethoursAndMinutes((Date.now() - last_heartbeat.getTime()) / 1000)} </StyledText>
          ago
        </StyledText>
      </View>
      <StyledText size={13} type="seconday">
        {languages.join(", ")}
      </StyledText>
      <View style={{ flexDirection: "row", gap: 5, justifyContent: "flex-end" }}>
        {
          repo_url ?
            <StyledButton
              onClick={() => Linking.openURL(repo_url)}
              type="secondary"
            >
              <Ionicons name="logo-github" size={20} />
            </StyledButton>
            :
            null
        }
        <StyledLinkButton
          type="primary"
          href={{
            pathname: "/in-app/projects/[projectId]",
            params: {
              projectId: name
            }
          }}
        >
          <Ionicons name="information-circle" size={20} />
        </StyledLinkButton>
      </View>
    </StyledCard>
  )
}