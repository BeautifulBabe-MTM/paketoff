import { unstable_cache } from 'next/cache';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Внутренняя функция без кэша (запрос к Google API)
async function doTranslation(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim() || targetLang === 'uk') return text;
  
  try {
    await delay(65); // Небольшой зазор, чтобы не ловить 429 от Гугла

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=uk&tl=${targetLang}&dt=t&q=${encodeURIComponent(text.trim())}`;
    
    const res = await fetch(url, {
      method: 'GET',
      signal: AbortSignal.timeout(4000), // Понизили таймаут до 4 сек, чтобы страница не висела вечно, если Гугл затупит
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      next: { revalidate: 86400 } 
    });

    if (!res.ok) {
      console.warn(`⚠️ [Google API Error] Статус: ${res.status}. Текст: "${text.slice(0, 15)}..."`);
      return text;
    }

    const json = await res.json();
    if (json && json[0] && json[0][0] && json[0][0][0]) {
      return json[0][0][0];
    }
    return text;
  } catch (e) {
    console.warn(`⚠️ [Fetch Catch] Ошибка для "${text.slice(0, 15)}...":`, e instanceof Error ? e.message : e);
    return text;
  }
}

// Экспорт обертки с уникальным кэшем
export const translateString = (text: string, targetLang: string) => {
  return unstable_cache(
    () => doTranslation(text, targetLang),
    [`trans-${Buffer.from(text).toString('base64')}-${targetLang}`],
    { revalidate: 86400 }
  )();
};

// =========================================================================
// ЖЁСТКАЯ ПАРАЛЛЕЛИЗАЦИЯ ТУТ:
// =========================================================================

export async function translateProduct<T extends Record<string, any>>(product: T, locale: string): Promise<T> {
  if (locale === 'uk' || !product) return product;

  // Стреляем ВСЕМИ запросами по характеристикам товара ОДНОВРЕМЕННО
  const [name, title, description, category, subcategory, color, density, weight, size] = await Promise.all([
    product.name ? translateString(product.name, locale) : Promise.resolve(product.name),
    product.title ? translateString(product.title, locale) : Promise.resolve(product.title),
    product.description ? translateString(product.description, locale) : Promise.resolve(product.description),
    product.category ? translateString(product.category, locale) : Promise.resolve(product.category),
    product.subcategory ? translateString(product.subcategory, locale) : Promise.resolve(product.subcategory),
    product.color ? translateString(product.color, locale) : Promise.resolve(product.color),
    product.density ? translateString(product.density, locale) : Promise.resolve(product.density),
    product.weight ? translateString(product.weight, locale) : Promise.resolve(product.weight),
    product.size ? translateString(product.size, locale) : Promise.resolve(product.size),
  ]);

  // Параллельно переводим массив тегов
  let tags = product.tags;
  if (product.tags && Array.isArray(product.tags) && product.tags.length > 0) {
    tags = await Promise.all(product.tags.map(tag => translateString(tag, locale)));
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
    tags
  };
}

export async function translateProductsList<T extends Record<string, any>>(products: T[], locale: string): Promise<T[]> {
  if (locale === 'uk' || !products || !products.length) return products;
  
  const batchSize = 15; // Переводим по 15 товаров за один залп
  const translatedList: T[] = [];

  console.log(`🚀 Начинаем параллельный перевод ${products.length} товаров пачками по ${batchSize}...`);

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    
    // Запускаем перевод 15 товаров параллельно
    const translatedBatch = await Promise.all(
      batch.map(item => translateProduct(item, locale))
    );
    
    translatedList.push(...translatedBatch);
    
    // Если это не последняя пачка, делаем микро-паузу, чтобы пощадить лимиты Гугла
    if (i + batchSize < products.length) {
      await delay(80);
    }
  }

  console.log(`✅ Все товары успешно обработаны!`);
  return translatedList;
}