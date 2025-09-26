import pl from '../pl.json';
import en from '../en.json';

export function getTranslation(cfg) {
  const lang = (cfg.lang || 'pl').toLowerCase();
  if (lang === 'en') return en;
  return pl;
}
