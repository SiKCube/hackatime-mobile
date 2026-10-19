import ProjectsList from "@/features/projects-list/projects-list";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Projects() {
  return (
    <SafeAreaView edges={["top", "right", "left"]}>
      <ProjectsList />
    </SafeAreaView>
  )
}