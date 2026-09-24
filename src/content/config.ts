import { defineCollection, z } from 'astro:content';

// حسب SRS.md — One tech: نوع محتوى مركّب (شرح/مراجعة/أداة_AI) بحقول اختيارية حسب النوع
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishDate: z.date(),
    type: z.enum(['شرح', 'مراجعة', 'أداة_AI']),
    category: z.enum(['ذكاء_اصطناعي', 'أتمتة', 'هواتف', 'تطبيقات']),
    // خاص بنوع "أداة_AI" فقط:
    toolUrl: z.string().url().optional(),
    pricing: z.enum(['مجاني', 'مدفوع', 'مجاني_جزئيًا']).optional(),
    // خاص بنوع "مراجعة" فقط:
    editorRating: z.number().min(1).max(5).optional(),
    sources: z.array(z.string()).min(1),
    reviewedBy: z.string(),
    reviewedAt: z.date().optional(),
    aiGenerated: z.boolean().default(false),
    excerpt: z.string().max(160),
  }),
});

export const collections = { articles };
