import axios from "axios"

interface UserStatsParams {
  start_date?: string,
  end_date?: string,
  limit?: number,
  features: string[],
  filter_by_project: string[],
  filter_by_category: string[],
  total_seconds?: boolean,
  no_ia?: boolean,
}

export interface StatsRequest {
  data: Data;
  trust_factor: TrustFactor;
}

interface TrustFactor {
  trust_level: string;
  trust_value: number;
}

export interface Data {
  username: string;
  user_id: string;
  is_coding_activity_visible: boolean;
  is_other_usage_visible: boolean;
  status: string;
  start: string;
  end: string;
  range: string;
  human_readable_range: string;
  total_seconds: number;
  daily_average: number;
  human_readable_total: string;
  human_readable_daily_average: string;
  languages?: Languages[];
  projects?: Projects[];
  streak: number;
}

export interface Projects {
  name: string;
  total_seconds: number;
  text: string;
  hours: number;
  minutes: number;
  percent: number | number;
  digital: string;
}

interface Languages {
  name: string;
  total_seconds: number;
  text: string;
  hours: number;
  minutes: number;
  percent: number | number;
  digital: string;
  color: string;
}

export async function getStats(username: string, apikey: string, params: UserStatsParams): Promise<StatsRequest> {
  const { data, status } = await axios.request({
    method: 'GET',
    url: `https://hackatime.hackclub.com/api/v1/users/${username}/stats`,
    params: {
      start_date: params.start_date ? params.start_date : "",
      end_date: params.end_date ? params.end_date : "",
      limit: params.limit ? params.limit : "",
      features: params.features.join(","),
      filter_by_project: params.filter_by_project.join(","),
      filter_by_category: params.filter_by_category.join(","),
      boundary_aware: 'false',
      total_seconds: params.total_seconds ? params.total_seconds : false,
      no_ai_coding: params.no_ia ? params.no_ia : false,
      test_param: 'false'
    },
    headers: {
      Authorization: `Bearer ${apikey}`
    }
  })

  if (status !== 200) {
    throw Error("Request fail")
  }

  if (!data.data || !data.trust_factor) throw Error("Data doesn't qualify")

  return data
}