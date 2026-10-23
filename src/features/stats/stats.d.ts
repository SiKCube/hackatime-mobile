export interface Projects {
  name: string;
  total_seconds: number;
  text: string;
  hours: number;
  minutes: number;
  percent: number | number;
  digital: string;
}

export interface Languages {
  name: string;
  total_seconds: number;
  text: string;
  hours: number;
  minutes: number;
  percent: number | number;
  digital: string;
  color: string;
}

export interface Stat {
  start_date: string
  end_date: string
  total_seconds: number
  daily_average: number
  human_readable_total: string
  human_readable_daily_average: string
  projects: Projects[]
  languages: Languages[]
}

export interface StatWithWeekNum extends Stat {
  weekNumber: number
}
