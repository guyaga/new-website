import portfolioData from '../data/portfolio.json';

export function getPortfolioItems() {
  return portfolioData;
}

export function getPortfolioBySlug(slug) {
  return portfolioData.find((item) => item.slug === slug) || null;
}

export function getAllPortfolioWithMedia() {
  return portfolioData;
}
