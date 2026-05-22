import { unstable_cache } from 'next/cache';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Внутренняя функция без кэша, которая делает сам запрос
async function doTranslation(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim() || targetLang === 'uk') return text;
  
  try {
    await delay(60); 

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=uk&tl=${targetLang}&dt=t&q=${encodeURIComponent(text.trim())}`;
    
    const res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      },
      next: { revalidate: 86400 } 
    });

    if (!res.ok) {
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
}

// Экспортируем обертку с ПРАВИЛЬНЫМ динамическим ключом кэша
export const translateString = (text: string, targetLang: string) => {
  return unstable_cache(
    () => doTranslation(text, targetLang),
    [`trans-${Buffer.from(text).toString('base64')}-${targetLang}`], // <--- Теперь ключ уникален для каждой строки и языка!
    { revalidate: 86400 }
  )();
};

// Переводим ПОЛНОСТЬЮ все строковые характеристики товара для фильтра
export async function translateProduct<T extends Record<string, any>>(product: T, locale: string): Promise<T> {
  if (locale === 'uk' || !product) return product;

  const name = product.name ? await translateString(product.name, locale) : product.name;
  const title = product.title ? await translateString(product.title, locale) : product.title;
  const description = product.description ? await translateString(product.description, locale) : product.description;
  const category = product.category ? await translateString(product.category, locale) : product.category;
  
  // Допереводим то, что идет в фильтры:
  const subcategory = product.subcategory ? await translateString(product.subcategory, locale) : product.subcategory;
  const color = product.color ? await translateString(product.color, locale) : product.color;
  const density = product.density ? await translateString(product.density, locale) : product.density;
  const weight = product.weight ? await translateString(product.weight, locale) : product.weight;
  const size = product.size ? await translateString(product.size, locale) : product.size;

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
    subcategory,
    color,
    density,
    weight,
    size,
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