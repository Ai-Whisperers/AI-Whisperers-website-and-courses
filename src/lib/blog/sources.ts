import { BlogSource } from './types'

export const AI_NEWS_SOURCES: BlogSource[] = [
  {
    id: 'openai-blog',
    name: 'OpenAI Blog',
    url: 'https://openai.com/blog',
    rssUrl: 'https://openai.com/blog/rss.xml',
    description: 'Official blog from OpenAI with the latest AI research and product updates',
    logo: '/images/sources/openai-logo.png',
    isActive: true
  },
  {
    id: 'anthropic-blog',
    name: 'Anthropic Blog',
    url: 'https://www.anthropic.com/news',
    description: 'Anthropic\'s research and safety updates for AI development',
    logo: '/images/sources/anthropic-logo.png',
    isActive: true
  },
  {
    id: 'deepmind-blog',
    name: 'DeepMind Blog',
    url: 'https://deepmind.com/blog',
    description: 'Latest research and breakthroughs from Google DeepMind',
    logo: '/images/sources/deepmind-logo.png',
    isActive: true
  },
  {
    id: 'ai-research',
    name: 'AI Research',
    url: 'https://ai.googleblog.com',
    rssUrl: 'https://ai.googleblog.com/feeds/posts/default',
    description: 'Google AI research blog with cutting-edge AI developments',
    logo: '/images/sources/google-ai-logo.png',
    isActive: true
  },
  {
    id: 'arxiv-ai',
    name: 'arXiv AI Papers',
    url: 'https://arxiv.org/list/cs.AI/recent',
    description: 'Latest AI research papers from arXiv preprint server',
    logo: '/images/sources/arxiv-logo.png',
    isActive: true
  },
  {
    id: 'venturebeat-ai',
    name: 'VentureBeat AI',
    url: 'https://venturebeat.com/ai/',
    rssUrl: 'https://venturebeat.com/ai/feed/',
    description: 'AI business news and industry analysis',
    logo: '/images/sources/venturebeat-logo.png',
    isActive: true
  },
  {
    id: 'techcrunch-ai',
    name: 'TechCrunch AI',
    url: 'https://techcrunch.com/category/artificial-intelligence/',
    rssUrl: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    description: 'AI startup news and funding announcements',
    logo: '/images/sources/techcrunch-logo.png',
    isActive: true
  },
  {
    id: 'mit-ai',
    name: 'MIT Technology Review AI',
    url: 'https://www.technologyreview.com/topic/artificial-intelligence/',
    description: 'In-depth AI analysis and future predictions',
    logo: '/images/sources/mit-logo.png',
    isActive: true
  },
  {
    id: 'towards-data-science',
    name: 'Towards Data Science',
    url: 'https://towardsdatascience.com',
    rssUrl: 'https://towardsdatascience.com/feed',
    description: 'Medium publication with practical AI and ML tutorials',
    logo: '/images/sources/tds-logo.png',
    isActive: true
  },
  {
    id: 'ai-news',
    name: 'AI News',
    url: 'https://artificialintelligence-news.com',
    rssUrl: 'https://artificialintelligence-news.com/feed/',
    description: 'Comprehensive AI industry news and analysis',
    logo: '/images/sources/ai-news-logo.png',
    isActive: true
  }
]

// Curated YouTube channels and podcasts (for future integration)
export const AI_VIDEO_SOURCES = [
  {
    id: 'wes-roth',
    name: 'Wes Roth',
    url: 'https://www.youtube.com/@WesRoth',
    description: 'AI news, reviews, and tutorials with business focus',
    platform: 'YouTube'
  },
  {
    id: 'ai-street-talk',
    name: 'AI Street Talk',
    url: 'https://www.youtube.com/@AiStreetTalk',
    description: 'Deep technical discussions with AI researchers',
    platform: 'YouTube'
  },
  {
    id: 'two-minute-papers',
    name: 'Two Minute Papers',
    url: 'https://www.youtube.com/@TwoMinutePapers',
    description: 'Quick summaries of latest AI research papers',
    platform: 'YouTube'
  },
  {
    id: 'lex-fridman',
    name: 'Lex Fridman Podcast',
    url: 'https://www.youtube.com/@lexfridman',
    description: 'Long-form conversations with AI leaders',
    platform: 'YouTube'
  }
]