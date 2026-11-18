export interface MainReqLeaderboard {
  period: string;
  start_date: string;
  date_range: string;
  generated_at: string;
  entries: Entries[];
}

export interface Entries {
  rank: number;
  user: User;
  total_seconds: number;
}

export interface User {
  id: number;
  username: string;
  avatar_url: string;
}
