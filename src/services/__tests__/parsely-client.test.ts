import { jest } from '@jest/globals';

// Mock config — must be registered before importing the module under test
jest.unstable_mockModule('../../config/index.js', () => ({
  config: {
    parsely: {
      apiKey: 'test-key',
      apiSecret: 'test-secret',
      baseUrl: 'https://api.parse.ly/v2',
    },
    server: {
      port: 3000,
    },
  },
}));

// Dynamic import after mock registration
const { ParselyClient } = await import('../parsely-client.js');

// Mock fetch
global.fetch = jest.fn() as typeof global.fetch;

describe('ParselyClient', () => {
  let client: InstanceType<typeof ParselyClient>;

  beforeEach(() => {
    client = new ParselyClient();
    jest.clearAllMocks();
  });

  describe('getAnalytics', () => {
    it('should fetch analytics data for posts', async () => {
      const mockResponse = {
        data: [
          { title: 'Test Post', url: 'https://example.com/post', hits: 100, visitors: 50 },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.getAnalytics('posts', { days: 7, limit: 10 });

      expect(result.data).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('analytics/posts')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('apikey=test-key')
      );
    });

    it('should handle API errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        text: async () => 'Unauthorized',
      });

      await expect(client.getAnalytics('posts')).rejects.toThrow(
        'Parse.ly API error (401): Unauthorized'
      );
    });
  });

  describe('getReferrers', () => {
    it('should fetch referrer data', async () => {
      const mockResponse = {
        data: [
          { name: 'google.com', type: 'search', hits: 200, visitors: 100 },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.getReferrers('search');

      expect(result.data).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('referrers/search')
      );
    });
  });

  describe('search', () => {
    it('should search content', async () => {
      const mockResponse = {
        data: [
          { title: 'Search Result', url: 'https://example.com/result' },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.search('test query', { limit: 5 });

      expect(result.data).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('search')
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('q=test+query')
      );
    });
  });

  describe('getShares', () => {
    it('should fetch shares data', async () => {
      const mockResponse = {
        data: [
          { title: 'Viral Post', url: 'https://example.com/viral', shares: { total: 500 } },
        ],
      };

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await client.getShares({ days: 30 });

      expect(result.data).toEqual(mockResponse.data);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('shares/posts')
      );
    });
  });
});
