'use client';

import React, { createContext, useContext, useState, useMemo } from 'react';
import { TRANSLATIONS, Language } from './i18n';
import { MOCK_APPLICATIONS, InstitutionalApplication, ForensicAnomaly } from './mock-data';

// --- Language Context ---
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS['en'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo(() => {
    return {
      language,
      setLanguage,
      t: TRANSLATIONS[language],
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
}

// --- Filter Context ---
export interface GlobalFilters {
  academicYear: string;
  region: string;
  institutionType: string;
  applicationCategory: string;
  scrutinyStatus: string;
  searchQuery: string;
}

interface FilterContextType {
  filters: GlobalFilters;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilters>>;
  resetFilters: () => void;
  applications: InstitutionalApplication[];
  filteredApplications: InstitutionalApplication[];
  updateApplicationStatus: (
    id: string,
    status: InstitutionalApplication['scrutinyStatus'],
    officerNote?: string
  ) => void;
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;
}

const defaultFilters: GlobalFilters = {
  academicYear: '2026-27',
  region: 'All Regions (8)',
  institutionType: 'All Types',
  applicationCategory: 'All Categories',
  scrutinyStatus: 'All Statuses',
  searchQuery: '',
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = useState<GlobalFilters>(defaultFilters);
  const [applications, setApplications] = useState<InstitutionalApplication[]>(MOCK_APPLICATIONS);
  const [selectedAppId, setSelectedAppId] = useState<string>('AICTE-2026-NW-0842');

  const resetFilters = () => setFilters(defaultFilters);

  const updateApplicationStatus = (
    id: string,
    status: InstitutionalApplication['scrutinyStatus'],
    officerNote?: string
  ) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === id) {
          return {
            ...app,
            scrutinyStatus: status,
            ...(officerNote !== undefined ? { officerNote } : {}),
          };
        }
        return app;
      })
    );
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Academic year
      if (filters.academicYear && filters.academicYear !== '2026-27' && app.academicYear !== filters.academicYear) {
        return false;
      }
      // Region
      if (filters.region !== 'All Regions (8)' && app.region !== filters.region) {
        return false;
      }
      // Institution Type
      if (filters.institutionType !== 'All Types' && app.institutionType !== filters.institutionType) {
        return false;
      }
      // Category
      if (filters.applicationCategory !== 'All Categories' && app.applicationCategory !== filters.applicationCategory) {
        return false;
      }
      // Status
      if (filters.scrutinyStatus !== 'All Statuses' && app.scrutinyStatus !== filters.scrutinyStatus) {
        return false;
      }
      // Search query (PID, Name, City, Trust, State)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchName = app.nameEn.toLowerCase().includes(q) || app.nameHi.includes(q);
        const matchPid = app.pid.toLowerCase().includes(q) || app.id.toLowerCase().includes(q);
        const matchTrust = app.trustName.toLowerCase().includes(q);
        const matchCity = app.city.toLowerCase().includes(q) || app.state.toLowerCase().includes(q);
        if (!matchName && !matchPid && !matchTrust && !matchCity) {
          return false;
        }
      }
      return true;
    });
  }, [applications, filters]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        resetFilters,
        applications,
        filteredApplications,
        updateApplicationStatus,
        selectedAppId,
        setSelectedAppId,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilters must be used within a FilterProvider');
  return context;
}
