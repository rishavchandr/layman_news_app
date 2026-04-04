import { NEWS_API_KEY } from '@env';

const API_KEY = NEWS_API_KEY || '';
const BASE_URL = 'https://newsdata.io/api/1/latest';
const REQUEST_TIMEOUT = 8000;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000; 

const FREE_TIER_LIMIT = 200;

const usageTracker = {
  count: 0,
  date: new Date().toDateString(),

  isExhausted(): boolean {
    this._resetIfNewDay();
    return this.count >= FREE_TIER_LIMIT;
  },

  increment() {
    this._resetIfNewDay();
    this.count++;
    console.log(`[NewsService] Daily requests: ${this.count}/${FREE_TIER_LIMIT}`);
  },

  _resetIfNewDay() {
    const today = new Date().toDateString();
    if (this.date !== today) {
      this.count = 0;
      this.date = today;
    }
  },
};

export interface NewsArticle {
  article_id: string;
  title: string;
  description: string;
  image_url: string;
  link: string;
  source_name: string;
  pubDate: string;
  category: string[];
}

const pendingRequests = new Map<string, Promise<NewsArticle[]>>();

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithTimeout = async (url: string): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    return res;
  } catch (err: any) {
    clearTimeout(timer);
    if (err.name === 'AbortError') throw new Error('Request timed out. Check your connection.');
    throw err;
  }
};

const attemptFetch = async (url: string): Promise<NewsArticle[]> => {
  if (usageTracker.isExhausted()) {
    throw new Error('QUOTA_EXHAUSTED');
  }

  usageTracker.increment();

  const res = await fetchWithTimeout(url);
  const data = await res.json();

  if (data.status === 'error') {
    const msg: string = data.results?.message ?? data.message ?? 'API error';

    const isQuotaError =
      msg.toLowerCase().includes('quota') ||
      msg.toLowerCase().includes('limit') ||
      msg.toLowerCase().includes('apikey') ||
      msg.toLowerCase().includes('unauthorized');

    throw new Error(isQuotaError ? `QUOTA_EXHAUSTED: ${msg}` : msg);
  }

  return (data.results ?? []) as NewsArticle[];
};

const fetchNews = (key: string, url: string): Promise<NewsArticle[]> => {
  if (pendingRequests.has(key)) return pendingRequests.get(key)!;

  const request = (async (): Promise<NewsArticle[]> => {
    let lastError: Error = new Error('Unknown error');

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`[NewsService] "${key}" — attempt ${attempt}/${MAX_RETRIES}`);
        const articles = await attemptFetch(url);

        if (articles.length > 0) {
          console.log(`[NewsService] "${key}" — success on attempt ${attempt}`);
          return articles;
        }

        lastError = new Error('No articles returned from API');
        console.warn(`[NewsService] "${key}" — empty on attempt ${attempt}`);
      } catch (err: any) {
        lastError = err;

        if (err.message?.startsWith('QUOTA_EXHAUSTED')) {
          console.error(`[NewsService] "${key}" — quota exhausted, aborting`);
          throw new Error(
            'Daily request limit reached (200/day on free plan). Resets at midnight.'
          );
        }

        console.warn(`[NewsService] "${key}" — attempt ${attempt} failed:`, err.message);
      }

      if (attempt < MAX_RETRIES) {
        const backoff = RETRY_DELAY_MS * attempt;
        console.log(`[NewsService] "${key}" — retrying in ${backoff}ms...`);
        await delay(backoff);
      }
    }

    console.error(`[NewsService] "${key}" — all ${MAX_RETRIES} attempts failed`);
    throw lastError;
  })();

  pendingRequests.set(key, request);
  request.finally(() => pendingRequests.delete(key));
  return request;
};

export const fetchFeaturedNews = (): Promise<NewsArticle[]> =>
  fetchNews(
    'featured',
    `${BASE_URL}?apikey=${API_KEY}&category=technology,business&language=en&image=1`
  );

export const fetchTodaysPicks = (): Promise<NewsArticle[]> =>
  fetchNews(
    'todaysPicks',
    `${BASE_URL}?apikey=${API_KEY}&q=startup,funding&language=en&image=1`
  );

export const searchArticles = (query: string): Promise<NewsArticle[]> => {
  if (!query.trim()) return Promise.resolve([]);
  const encodedQuery = encodeURIComponent(query.trim());
  return fetchNews(
    `search:${encodedQuery}`,
    `${BASE_URL}?apikey=${API_KEY}&q=${encodedQuery}&language=en&image=1`
  );
};

export const getUsageInfo = () => ({
  used: usageTracker.count,
  limit: FREE_TIER_LIMIT,
  remaining: Math.max(0, FREE_TIER_LIMIT - usageTracker.count),
  isExhausted: usageTracker.isExhausted(),
});