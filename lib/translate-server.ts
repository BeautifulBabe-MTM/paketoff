import { unstable_cache } from 'next/cache';

// 1. Глубокий кэшируемый перевод одной строки с защитой от сбоев API
export const translateString = unstable_cache(
  async (text: string, targetLang: string): Promise<string> => {
    if (!text || targetLang === 'uk') return text;
    
    try {
      const res = await fetch(
        `https://lingva.ml/api/v1/uk/${targetLang}/${encodeURIComponent(text)}`,
        {
          signal: AbortSignal.timeout(3000) // Таймаут 3 секунды
        }
      );

      if (!res.ok) {
        console.warn(`[Lingva API] Ошибка сервера: ${res.status}. Фолбэк на оригинал.`);
        return text;
      }

      const json = await res.json();
      return json.translation || text;
    } catch (e) {
      console.error(`[Translate Error] Ошибка перевода для "${text.slice(0, 20)}...":`, e);
      return text;
    }
  },
  ['string-translations-cache'],
  { revalidate: 86400 } // Кэш на 24 часа
);

// 2. Универсальный переводчик одиночного объекта (товара)
export async function translateProduct<T extends Record<string, any>>(product: T, locale: string): Promise<T> {
  if (locale === 'uk' || !product) return product;

  const name = product.name ? await translateString(product.name, locale) : product.name;
  const title = product.title ? await translateString(product.title, locale) : product.title;
  const description = product.description ? await translateString(product.description, locale) : product.description;
  const category = product.category ? await translateString(product.category, locale) : product.category;
  
  const tags = product.tags && Array.isArray(product.tags)
    ? await Promise.all(product.tags.map((tag: string) => translateString(tag, locale)))
    : product.tags;

  return {
    ...product,
    name,
    title,
    description,
    category,
    tags
  };
}

// 3. Переводчик МАССИВОВ (вот то, что потерялось)
export async function translateProductsList<T extends Record<string, any>>(products: T[], locale: string): Promise<T[]> {
  if (locale === 'uk' || !products || !products.length) return products;
  return Promise.all(products.map(item => translateProduct(item, locale)));
}