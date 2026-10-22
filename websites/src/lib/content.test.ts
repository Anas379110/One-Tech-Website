import { describe, it, expect } from 'vitest';
import { isPublished, sortByDateDesc, isStale, relatedArticles } from './content';
import type { CollectionEntry } from 'astro:content';

function makeEntry(overrides: Partial<CollectionEntry<'articles'>['data']> & { slug?: string }) {
  const { slug = 'test-slug', ...data } = overrides;
  return {
    slug,
    data: {
      title: 'عنوان تجريبي',
      publishDate: new Date('2026-01-01'),
      type: 'شرح' as const,
      category: 'ذكاء_اصطناعي' as const,
      sources: ['مصدر تجريبي'],
      reviewedBy: '',
      aiGenerated: false,
      excerpt: 'ملخص',
      ...data,
    },
  } as unknown as CollectionEntry<'articles'>;
}

describe('isPublished', () => {
  it('يرفض بلا reviewedBy', () => {
    expect(isPublished(makeEntry({ reviewedBy: '' }))).toBe(false);
  });
  it('يقبل مع مراجع فعلي', () => {
    expect(isPublished(makeEntry({ reviewedBy: 'محرر' }))).toBe(true);
  });
});

describe('isStale — عتبة 30 يومًا المؤكَّدة', () => {
  it('مقال بعمر 10 أيام ليس قديمًا', () => {
    const now = new Date('2026-01-11');
    const entry = makeEntry({ publishDate: new Date('2026-01-01') });
    expect(isStale(entry, now)).toBe(false);
  });

  it('مقال بعمر 31 يومًا يُعتبر قديمًا', () => {
    const now = new Date('2026-02-01'); // 31 يومًا بعد 2026-01-01
    const entry = makeEntry({ publishDate: new Date('2026-01-01') });
    expect(isStale(entry, now)).toBe(true);
  });

  it('مقال بعمر 30 يومًا بالضبط ليس قديمًا بعد (> لا >=)', () => {
    const now = new Date('2026-01-31');
    const entry = makeEntry({ publishDate: new Date('2026-01-01') });
    expect(isStale(entry, now)).toBe(false);
  });
});

describe('sortByDateDesc', () => {
  it('الأحدث أولًا', () => {
    const old = makeEntry({ slug: 'old', publishDate: new Date('2025-01-01') });
    const recent = makeEntry({ slug: 'recent', publishDate: new Date('2026-06-01') });
    expect(sortByDateDesc([old, recent])[0].slug).toBe('recent');
  });
});

describe('relatedArticles', () => {
  it('يستبعد الحالي ويطابق نفس التصنيف', () => {
    const current = makeEntry({ slug: 'current', category: 'ذكاء_اصطناعي', reviewedBy: 'x' });
    const same = makeEntry({ slug: 'same', category: 'ذكاء_اصطناعي', reviewedBy: 'x' });
    const other = makeEntry({ slug: 'other', category: 'هواتف', reviewedBy: 'x' });
    const result = relatedArticles([current, same, other], current);
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('same');
  });
});
