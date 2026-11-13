'use client';

import { useState, useEffect } from 'react';
import { DEFAULT_SITE_CONTENT, getStoredContent } from '../lib/siteContent';
import api from '../lib/api';

export function useSiteContent() {
  const [content, setContent] = useState(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Initial load from local storage cache
    const initial = getStoredContent();
    setContent(initial);
    setLoading(false);

    // 2. Fetch latest from API if online
    async function fetchFromApi() {
      try {
        const res = await api.admin.getContent();
        if (res && res.success && res.content) {
          setContent(res.content);
        }
      } catch (e) {
        // use local fallback
      }
    }
    fetchFromApi();

    // 3. Listen to live storage & custom event updates
    const handleUpdate = (e) => {
      if (e.detail) {
        setContent(e.detail);
      } else {
        setContent(getStoredContent());
      }
    };

    window.addEventListener('earthglaze:content-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('earthglaze:content-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const getSection = (pageKey, sectionKey) => {
    return content?.[pageKey]?.[sectionKey] || DEFAULT_SITE_CONTENT?.[pageKey]?.[sectionKey] || {};
  };

  return { content, loading, getSection };
}
