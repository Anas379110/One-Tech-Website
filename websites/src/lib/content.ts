import type { CollectionEntry } from 'astro:content';

const STALE_AFTER_DAYS = 30; // مؤكَّد من المستخدم — عتبة صارمة بسبب سرعة تغيّر أدوات AI

export function isPublished(entry: CollectionEntry<'articles'>): boolean {
  return entry.data.reviewedBy.trim() !== '';
}

export function sortByDateDesc(entries: CollectionEntry<'articles'>[]): CollectionEntry<'articles'>[] {
  return [...entries].sort((a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf());
}

/**
 * FR: تنبيه "قد تكون المعلومة قديمة" بعد تجاوز publishDate عتبة الأيام المحدَّدة.
 * منطق Build-time بحت — لا يحتاج تحديثًا لحظيًا بجهة العميل.
 */
export function isStale(entry: CollectionEntry<'articles'>, now: Date = new Date()): boolean {
  const ageMs = now.valueOf() - entry.data.publishDate.valueOf();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays > STALE_AFTER_DAYS;
}

export function relatedArticles(
  all: CollectionEntry<'articles'>[],
  current: CollectionEntry<'articles'>,
  limit = 3
): CollectionEntry<'articles'>[] {
  return all
    .filter((e) => isPublished(e) && e.data.category === current.data.category && e.slug !== current.slug)
    .slice(0, limit);
}
