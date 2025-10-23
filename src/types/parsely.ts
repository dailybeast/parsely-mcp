// Common types for Parse.ly API responses

export interface ParselyApiError {
  message: string;
  code?: string;
}

export interface ParselyAnalyticsItem {
  title: string;
  url: string;
  hits: number;
  visitors: number;
  avg_engaged_time?: number;
  [key: string]: unknown;
}

export interface ParselyAnalyticsResponse {
  data: ParselyAnalyticsItem[];
}

export interface ParselyPost {
  title: string;
  url: string;
  author?: string;
  section?: string;
  tags?: string[];
  pub_date?: string;
  thumb_url?: string;
  [key: string]: unknown;
}

export interface ParselyAuthor {
  name: string;
  hits: number;
  visitors: number;
  avg_engaged_time?: number;
  [key: string]: unknown;
}

export interface ParselyTag {
  name: string;
  hits: number;
  visitors: number;
  [key: string]: unknown;
}

export interface ParselyReferrer {
  name: string;
  type: string;
  hits: number;
  visitors: number;
  [key: string]: unknown;
}

export interface ParselyReferrersResponse {
  data: ParselyReferrer[];
}

export interface ParselySearchResult {
  title: string;
  url: string;
  pub_date?: string;
  author?: string;
  section?: string;
  thumb_url?: string;
  [key: string]: unknown;
}

export interface ParselySearchResponse {
  data: ParselySearchResult[];
}

export interface ParselySharesData {
  title: string;
  url: string;
  shares: {
    total: number;
    facebook?: number;
    twitter?: number;
    pinterest?: number;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

export interface ParselySharesResponse {
  data: ParselySharesData[];
}

// Request parameter types
export interface ParselyAnalyticsParams {
  apikey: string;
  secret: string;
  period_start?: string;
  period_end?: string;
  pub_date_start?: string;
  pub_date_end?: string;
  days?: number;
  limit?: number;
  page?: number;
  sort?: string;
  section?: string;
  domain?: string;
  tag?: string;
  [key: string]: string | number | undefined;
}

export interface ParselyReferrersParams {
  apikey: string;
  secret: string;
  period_start?: string;
  period_end?: string;
  pub_date_start?: string;
  pub_date_end?: string;
  days?: number;
  limit?: number;
  page?: number;
  section?: string;
  domain?: string;
  [key: string]: string | number | undefined;
}

export interface ParselySearchParams {
  apikey: string;
  secret: string;
  q: string;
  limit?: number;
  page?: number;
  sort?: string;
}
