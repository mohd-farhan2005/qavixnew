import React from 'react';
import { fetchFaqs, FaqsResponse } from '@/lib/blog-api';
import { HomeFaqSection } from './HomeFaqSection';
import { FAQS } from '@/content/faq';

const FALLBACK_FAQS: FaqsResponse = {
  success: true,
  total: FAQS.length,
  categories: [{ category: 'All', count: FAQS.length }],
  data: FAQS.map((faq, index) => ({
    id: index + 1,
    question: faq.question,
    answer: faq.answer,
    category: 'General',
    sort_order: index + 1,
    is_active: true,
  })),
  grouped: {},
};

export async function HomeFaqWrapper() {
  let faqData: FaqsResponse | null = null;
  try {
    faqData = await fetchFaqs();
  } catch {
    faqData = null;
  }

  const finalData =
    faqData && faqData.data && faqData.data.length > 0 ? faqData : FALLBACK_FAQS;

  return <HomeFaqSection initialData={finalData} />;
}

export default HomeFaqWrapper;
