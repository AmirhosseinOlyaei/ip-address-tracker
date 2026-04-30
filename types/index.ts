export interface IpGeoData {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  zip: string;
  lat: number;
  lon: number;
  timezone: string;
  isp: string;
  query: string;
}

export interface HistoryEntry {
  id: string;
  query: string;
  data: IpGeoData;
  timestamp: number;
}

export type AppStatus = 'idle' | 'loading' | 'success' | 'error';

export interface AppError {
  code: 'NETWORK' | 'INVALID_QUERY' | 'RATE_LIMIT' | 'NOT_FOUND' | 'UNKNOWN';
  message: string;
}

export interface IpTrackerState {
  current: IpGeoData | null;
  history: HistoryEntry[];
  status: AppStatus;
  error: AppError | null;
}

export type IpTrackerAction =
  | { type: 'LOOKUP_START' }
  | { type: 'LOOKUP_SUCCESS'; payload: IpGeoData }
  | { type: 'LOOKUP_ERROR'; payload: AppError }
  | { type: 'LOAD_HISTORY'; payload: HistoryEntry[] }
  | { type: 'ADD_HISTORY'; payload: HistoryEntry }
  | { type: 'CLEAR_HISTORY' };
