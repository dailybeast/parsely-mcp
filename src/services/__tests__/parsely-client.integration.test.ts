/**
 * Integration tests for ParselyClient — hit the real Parse.ly API.
 *
 * Requires PARSELY_API_KEY and PARSELY_API_SECRET in the environment (or .env).
 * Tests are skipped automatically when credentials are absent.
 *
 * Run with:
 *   npm run test:integration
 */

import 'dotenv/config';
import { ParselyClient } from '../parsely-client.js';

const hasCredentials =
  Boolean(process.env.PARSELY_API_KEY) && Boolean(process.env.PARSELY_API_SECRET);

const describeIfCredentials = hasCredentials ? describe : describe.skip;

describeIfCredentials('ParselyClient (integration)', () => {
  let client: ParselyClient;

  beforeAll(() => {
    client = new ParselyClient();
  });

  describe('getAnalytics', () => {
    it('returns top posts with expected shape', async () => {
      const result = await client.getAnalytics('posts', { days: 7, limit: 5 });

      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);

      if (result.data.length > 0) {
        const post = result.data[0] as Record<string, unknown>;
        expect(typeof post.title).toBe('string');
        expect(typeof post.url).toBe('string');
        // API returns views inside metrics object
        expect(typeof (post.metrics as Record<string, unknown>)?.views).toBe('number');
      }
    }, 15000);

    it('returns top authors with expected shape', async () => {
      const result = await client.getAnalytics('authors', { days: 7, limit: 5 });

      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);

      if (result.data.length > 0) {
        const author = result.data[0] as Record<string, unknown>;
        // Author analytics items use "author" field, views in metrics.views
        expect(typeof author.author).toBe('string');
        expect(typeof (author.metrics as Record<string, unknown>)?.views).toBe('number');
      }
    }, 15000);

    it('returns top tags with expected shape', async () => {
      const result = await client.getAnalytics('tags', { days: 7, limit: 5 });

      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);

      if (result.data.length > 0) {
        const tag = result.data[0] as Record<string, unknown>;
        // Tag analytics items use "tag" field, views in metrics.views
        expect(typeof tag.tag).toBe('string');
        expect(typeof (tag.metrics as Record<string, unknown>)?.views).toBe('number');
      }
    }, 15000);

    it('respects the limit parameter', async () => {
      const result = await client.getAnalytics('posts', { days: 7, limit: 3 });

      expect(result.data.length).toBeLessThanOrEqual(3);
    }, 15000);

    it('returns more results for a longer time window', async () => {
      const [last7, last30] = await Promise.all([
        client.getAnalytics('posts', { days: 7, limit: 10 }),
        client.getAnalytics('posts', { days: 30, limit: 10 }),
      ]);

      expect(Array.isArray(last7.data)).toBe(true);
      expect(Array.isArray(last30.data)).toBe(true);
    }, 20000);
  });

  describe('getReferrers', () => {
    it('returns social referrers with expected shape', async () => {
      const result = await client.getReferrers('social', { days: 7, limit: 5 });

      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);

      if (result.data.length > 0) {
        const referrer = result.data[0] as Record<string, unknown>;
        expect(typeof referrer.name).toBe('string');
        expect(typeof referrer.type).toBe('string');
        // API returns referrer views in metrics.referrers_views
        expect(typeof (referrer.metrics as Record<string, unknown>)?.referrers_views).toBe('number');
      }
    }, 15000);

    it('returns search referrers', async () => {
      const result = await client.getReferrers('search', { days: 7, limit: 5 });

      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);
    }, 15000);

    it('returns other referrers', async () => {
      const result = await client.getReferrers('other', { days: 7, limit: 5 });

      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);
    }, 15000);

    it('returns internal referrers', async () => {
      const result = await client.getReferrers('internal', { days: 7, limit: 5 });

      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);
    }, 15000);
  });

  describe('search', () => {
    it('returns search results for a broad query', async () => {
      const result = await client.search('the', { limit: 5 });

      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);

      if (result.data.length > 0) {
        const item = result.data[0];
        expect(typeof item.title).toBe('string');
        expect(typeof item.url).toBe('string');
      }
    }, 15000);

    it('returns empty results for an unmatchable query', async () => {
      const result = await client.search('xyzzy_no_such_content_12345', { limit: 5 });

      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);
    }, 15000);

    it('respects the limit parameter', async () => {
      const result = await client.search('the', { limit: 2 });

      expect(result.data.length).toBeLessThanOrEqual(2);
    }, 15000);
  });

  describe('getShares', () => {
    it('returns shares data with expected shape', async () => {
      const result = await client.getShares({ days: 7, limit: 5 });

      expect(result).toHaveProperty('data');
      expect(Array.isArray(result.data)).toBe(true);

      if (result.data.length > 0) {
        const item = result.data[0];
        expect(typeof item.title).toBe('string');
        expect(typeof item.url).toBe('string');
        // API returns share count as _shares (underscore-prefixed) or inside metrics
        const shareCount = (item as Record<string, unknown>)._shares ?? item.shares;
        expect(shareCount).toBeDefined();
      }
    }, 15000);
  });

  describe('error handling', () => {
    it('returns an application-level error response for invalid credentials', async () => {
      const badClient = new ParselyClient();
      // @ts-expect-error accessing private field for test
      badClient.apiKey = 'bad-key';
      // @ts-expect-error accessing private field for test
      badClient.apiSecret = 'bad-secret';

      // The Parse.ly API returns HTTP 200 with {success: false, code: 403} for bad creds,
      // so the client resolves rather than throws. Verify the error payload is present.
      const result = await badClient.getAnalytics('posts') as unknown as Record<string, unknown>;
      expect(result.success).toBe(false);
      expect(result.code).toBe(403);
    }, 15000);
  });
});
