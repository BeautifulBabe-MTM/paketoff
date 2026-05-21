import { unstable_cache } from 'next/cache';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const translateString = unstable_cache(
  async (text: string, targetLang: string): Promise<string> => {
    // Если строка пустая, состоит из пробелов или язык украинский — не переводим
    if (!text || !text.trim() || targetLang === 'uk') return text;
    
    try {
      await delay(60); // Чуть увеличим паузу, чтобы не спамить

      // Альтернативный endpoint Гугла, который стабильнее жрёт текстовые строки
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=uk&tl=${targetLang}&dt=t&q=${encodeURIComponent(text.trim())}`;
      
      const res = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
        headers: {
          // Имитируем чистый запрос от старого браузера, это обходит блок 500
          'Accept': '*/*',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        },
        next: { revalidate: 86400 } // Дополнительное кэширование на уровне fetch
      });

      if (!res.ok) {
        // Если опять 500 или 403 — выводим в консоль, но сайт не вешаем
        console.warn(`[Google API Error] Статус: ${res.status}. Текст: "${text.slice(0, 15)}..."`);
        return text;
      }

      const json = await res.json();
      
      if (json && json[0] && json[0][0] && json[0][0][0]) {
        return json[0][0][0];
      }
      
      return text;
    } catch (e) {
      console.warn(`[Fetch Catch] Ошибка для "${text.slice(0, 15)}...":`, e instanceof Error ? e.message : e);
      return text;
    }
  },
  ['string-translations-cache'],
  { revalidate: 86400 }
);

// Логика перевода товара (остаётся без изменений)
export async function translateProduct<T extends Record<string, any>>(product: T, locale: string): Promise<T> {
  if (locale === 'uk' || !product) return product;

  const name = product.name ? await translateString(product.name, locale) : product.name;
  const title = product.title ? await translateString(product.title, locale) : product.title;
  const description = product.description ? await translateString(product.description, locale) : product.description;
  const category = product.category ? await translateString(product.category, locale) : product.category;
  
  const tags: string[] = [];
  if (product.tags && Array.isArray(product.tags)) {
    for (const tag of product.tags) {
      const translatedTag = await translateString(tag, locale);
      tags.push(translatedTag);
    }
  }

  return {
    ...product,
    name,
    title,
    description,
    category,
    tags: product.tags ? tags : product.tags
  };
}

export async function translateProductsList<T extends Record<string, any>>(products: T[], locale: string): Promise<T[]> {
  if (locale === 'uk' || !products || !products.length) return products;
  
  const translatedList: T[] = [];
  for (const item of products) {
    const translatedItem = await translateProduct(item, locale);
    translatedList.push(translatedItem);
  }
  return translatedList;
}