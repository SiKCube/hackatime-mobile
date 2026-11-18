import LoadingSkeleton from "@/components/loading-skeleton";
import StyledCard from "@/components/ui/card";
import StyledInput from "@/components/ui/input";
import OptionBtn from "@/components/ui/option-btn";
import StyledText from "@/components/ui/text";
import axios from "axios";
import { useEffect, useState } from "react";
import { FlatList, RefreshControl, View } from "react-native";
import { useTheme } from "../theme/context/theme-ctx-provider";
import BoardItem from "./board-item";
import { MainReqLeaderboard } from "./types";

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let timeAgo = "";
  if (diffInSeconds < 60) {
    timeAgo = `just now`;
  } else if (diffInSeconds < 3600) {
    timeAgo = `${Math.floor(diffInSeconds / 60)} minutes ago`;
  } else {
    timeAgo = `${Math.floor(diffInSeconds / 3600)} hours ago`;
  }

  return timeAgo;
}

export default function Board() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [leaderboard, setLeaderboard] = useState<MainReqLeaderboard | null>(null)

  const [period, setPeriod] = useState<"daily" | "weekly">("daily")

  const [search, setSearch] = useState<string>("")

  const [timeAgo, setTimeAgo] = useState<string>("")

  const { themeData } = useTheme()

  const getLeadboard = async (type: "daily" | "weekly") => {
    try {
      setLoading(true)

      const { data }: { data: MainReqLeaderboard | undefined } = await axios.request({
        method: "GET",
        url: `https://hackatime.hackclub.com/api/v1/leaderboard/${type}`,
      })

      if (!data) throw new Error("No data received")

      setLeaderboard(data)
      setLoading(false)
    } catch (error) {
      setError("Failed to fetch leaderboard")
      setLoading(false)
    }
  }

  useEffect(() => {
    getLeadboard(period)
  }, [])
  useEffect(() => {
    setSearch("")
    getLeadboard(period)
  }, [period])

  useEffect(() => {
    if (leaderboard?.generated_at) {
      setTimeAgo(getTimeAgo(leaderboard.generated_at))

      const intervalId = setInterval(() => {
        setTimeAgo(getTimeAgo(leaderboard.generated_at))
      }, 60000)

      return () => {
        clearInterval(intervalId)
      }
    }
  }, [leaderboard?.generated_at, period])

  return (
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <StyledText weight="bold" size={20}>Leaderbaord</StyledText>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <OptionBtn
            text="Daily"
            icon="sunny"
            onClick={() => setPeriod("daily")}
            disable={loading}
            selected={period}
            selectedKey="daily"
          />
          <OptionBtn
            text="Weekly"
            icon="calendar"
            onClick={() => setPeriod("weekly")}
            disable={loading}
            selected={period}
            selectedKey="weekly"
          />
        </View>
      </View>
      {
        loading ?
          <View style={{ gap: 10 }}>
            <LoadingSkeleton height={50} />
            {Array.from({ length: 8 }).map((_, index) => (
              <LoadingSkeleton key={index} height={70} />
            ))}
          </View>
          :
          error ?
            <StyledText type="error">{error}</StyledText>
            :
            leaderboard?.entries ? (
              <FlatList
                ListHeaderComponent={
                  <View style={{ marginBottom: 10, gap: 5 }}>
                    <StyledInput
                      placeholder="Search"
                      keyboardType="default"
                      change={search}
                      setChange={setSearch}
                      width={300}
                    />
                    {leaderboard?.generated_at &&
                      <StyledText size={13} type="seconday">
                        Updated {timeAgo}
                      </StyledText>}
                  </View>
                }
                refreshControl={
                  <RefreshControl refreshing={loading}
                    onRefresh={() => {
                      getLeadboard(period)
                    }}
                    colors={[themeData.primary]}
                    progressBackgroundColor={themeData.darkless}
                    progressViewOffset={-10}
                  />

                }
                refreshing={loading}
                data={leaderboard.entries.filter((entry) => entry.user.username.toLowerCase().includes(search.toLowerCase()))}
                keyExtractor={item => item.user.id.toString()}
                renderItem={({ item }) => (
                  <BoardItem
                    rank={item.rank}
                    user={item.user}
                    total_seconds={item.total_seconds}
                  />
                )}
                ItemSeparatorComponent={<View style={{ height: 10 }} />}
                getItemLayout={(data, index) => (
                  { length: 70, offset: 70 * index, index }
                )}
                initialScrollIndex={0}
                initialNumToRender={10}
              />
            ) : (
              <StyledCard>
                <StyledText type="error">No data available</StyledText >
              </StyledCard >
            )
      }
    </>
  )
}