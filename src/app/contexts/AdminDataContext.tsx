import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Article {
  id: string;
  title: string;
  content: string;
  coverImgUrl?: string;
  magazineId: string;
  publishedAt?: string;
  isActive?: boolean;
  isPublished?: boolean;
  [key: string]: any;
}

interface Magazine {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  publishedAt?: string;
  isActive?: boolean;
  isPublished?: boolean;
  [key: string]: any;
}

interface AdminDataContextType {
  articles: Article[];
  magazines: Magazine[];
  loading: boolean;
  
  // Article methods
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Article) => void;
  deleteArticle: (id: string) => void;
  fetchArticles: () => Promise<void>;
  
  // Magazine methods
  addMagazine: (magazine: Magazine) => void;
  updateMagazine: (id: string, magazine: Magazine) => void;
  deleteMagazine: (id: string) => void;
  fetchMagazines: () => Promise<void>;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

export function AdminDataProvider({ children }: { children: ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [magazines, setMagazines] = useState<Magazine[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch articles from API
  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles');
      if (res.ok) {
        const data = await res.json();
        setArticles(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch articles', err);
    }
  };

  // Fetch magazines from API
  const fetchMagazines = async () => {
    try {
      const res = await fetch('/api/magazines');
      if (res.ok) {
        const data = await res.json();
        setMagazines(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Failed to fetch magazines', err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchArticles(), fetchMagazines()]);
    };
    loadData();
  }, []);

  // Article methods
  const addArticle = (article: Article) => {
    setArticles((prev) => [article, ...prev]);
  };

  const updateArticle = (id: string, article: Article) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? article : a)));
  };

  const deleteArticle = (id: string) => {
    setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, isActive: false } : a)));
  };

  // Magazine methods
  const addMagazine = (magazine: Magazine) => {
    setMagazines((prev) => [magazine, ...prev]);
  };

  const updateMagazine = (id: string, magazine: Magazine) => {
    setMagazines((prev) => prev.map((m) => (m.id === id ? magazine : m)));
  };

  const deleteMagazine = (id: string) => {
    setMagazines((prev) => prev.map((m) => (m.id === id ? { ...m, isActive: false } : m)));
  };

  const value: AdminDataContextType = {
    articles,
    magazines,
    loading,
    addArticle,
    updateArticle,
    deleteArticle,
    fetchArticles,
    addMagazine,
    updateMagazine,
    deleteMagazine,
    fetchMagazines,
  };

  return (
    <AdminDataContext.Provider value={value}>
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error('useAdminData must be used within AdminDataProvider');
  }
  return context;
}
