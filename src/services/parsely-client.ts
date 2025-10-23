import { config } from '../config/index.js';
import type {
  ParselyAnalyticsResponse,
  ParselyReferrersResponse,
  ParselySearchResponse,
  ParselySharesResponse,
  ParselyAnalyticsParams,
  ParselyReferrersParams,
  ParselySearchParams,
} from '../types/parsely.js';

export class ParselyClient {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.parsely.apiKey;
    this.apiSecret = config.parsely.apiSecret;
    this.baseUrl = config.parsely.baseUrl;
  }

  private buildQueryString(params: Record<string, string | number | undefined>): string {
    const queryParams = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        queryParams.append(key, String(value));
      }
    }
    return queryParams.toString();
  }

  private async request<T>(endpoint: string, params: Record<string, string | number | undefined>): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}?${this.buildQueryString(params)}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Parse.ly API error (${response.status}): ${errorText}`);
    }

    return response.json() as Promise<T>;
  }

  async getAnalytics(
    aspect: 'posts' | 'authors' | 'tags',
    params: Partial<Omit<ParselyAnalyticsParams, 'apikey' | 'secret'>> = {}
  ): Promise<ParselyAnalyticsResponse> {
    const fullParams: ParselyAnalyticsParams = {
      apikey: this.apiKey,
      secret: this.apiSecret,
      days: params.days || 7,
      limit: params.limit || 10,
      ...params,
    };

    return this.request<ParselyAnalyticsResponse>(`analytics/${aspect}`, fullParams);
  }

  async getReferrers(
    params: Partial<Omit<ParselyReferrersParams, 'apikey' | 'secret'>> = {}
  ): Promise<ParselyReferrersResponse> {
    const fullParams: ParselyReferrersParams = {
      apikey: this.apiKey,
      secret: this.apiSecret,
      days: params.days || 7,
      limit: params.limit || 10,
      ...params,
    };

    return this.request<ParselyReferrersResponse>('referrers/posts', fullParams);
  }

  async search(
    query: string,
    params: Partial<Omit<ParselySearchParams, 'apikey' | 'secret' | 'q'>> = {}
  ): Promise<ParselySearchResponse> {
    const fullParams: ParselySearchParams = {
      apikey: this.apiKey,
      secret: this.apiSecret,
      q: query,
      limit: params.limit || 10,
      ...params,
    };

    return this.request<ParselySearchResponse>('search', fullParams);
  }

  async getShares(
    params: Partial<Omit<ParselyAnalyticsParams, 'apikey' | 'secret'>> = {}
  ): Promise<ParselySharesResponse> {
    const fullParams: ParselyAnalyticsParams = {
      apikey: this.apiKey,
      secret: this.apiSecret,
      days: params.days || 7,
      limit: params.limit || 10,
      ...params,
    };

    return this.request<ParselySharesResponse>('shares/posts', fullParams);
  }
}
