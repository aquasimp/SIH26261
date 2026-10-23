'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { TRANSLATIONS, Language } from './i18n';
import {
  MOCK_APPLICATIONS,
  InstitutionalApplication,
  INITIAL_AUDIT_BLOCKS,
  AuditBlock,
} from './mock-data';
import { computeAuditBlockHash } from './crypto-utils';
import { toast } from 'sonner';

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

// --- Global Filter & Reactive Application/Audit Store ---
export interface GlobalFilters {
  academicYear: string;
  region: string;
  institutionType: string;
  applicationCategory: string;
  scrutinyStatus: string;
  searchQuery: string;
}

export interface AppStoreContextType {
  filters: GlobalFilters;
  setFilters: React.Dispatch<React.SetStateAction<GlobalFilters>>;
  resetFilters: () => void;
  resetDemoState: () => void;
  applications: InstitutionalApplication[];
  setApplications: React.Dispatch<React.SetStateAction<InstitutionalApplication[]>>;
  filteredApplications: InstitutionalApplication[];
  selectedAppId: string;
  setSelectedAppId: (id: string) => void;
  auditLogs: AuditBlock[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditBlock[]>>;
  updateApplicationStatus: (
    id: string,
    status: InstitutionalApplication['scrutinyStatus'],
    officerNote?: string
  ) => void;
  // Officer Action Methods with Closed-Loop State Mutation & SHA-256 Audit Chaining
  approveApplicationEoA: (appId: string, officerNote?: string) => Promise<AuditBlock | null>;
  issueDeficiencyNotice: (
    appId: string,
    deadlineDays?: number,
    officerNote?: string
  ) => Promise<AuditBlock | null>;
  escalateToStandingHearingCommittee: (appId: string, reason?: string) => Promise<AuditBlock | null>;
}

const defaultFilters: GlobalFilters = {
  academicYear: '2026-27',
  region: 'All Regions (8)',
  institutionType: 'All Types',
  applicationCategory: 'All Categories',
  scrutinyStatus: 'All Statuses',
  searchQuery: '',
};

const AppStoreContext = createContext<AppStoreContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [filters, setFilters] = useState<GlobalFilters>(defaultFilters);
  const [applications, setApplications] = useState<InstitutionalApplication[]>(MOCK_APPLICATIONS);
  const [selectedAppId, setSelectedAppId] = useState<string>('AICTE-2026-NW-0842');
  const [auditLogs, setAuditLogs] = useState<AuditBlock[]>(INITIAL_AUDIT_BLOCKS);

  // Client-side hydration from localStorage (aicte_sih26261_apps_v2 & aicte_sih26261_audit_v2)
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const storedApps = localStorage.getItem('aicte_sih26261_apps_v2');
        if (storedApps) {
          const parsed = JSON.parse(storedApps);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setApplications(parsed);
          }
        }
        const storedLogs = localStorage.getItem('aicte_sih26261_audit_v2');
        if (storedLogs) {
          const parsed = JSON.parse(storedLogs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setAuditLogs(parsed);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to hydrate state from localStorage:', err);
    } finally {
      setHasMounted(true);
    }
  }, []);

  // Persist mutated applications to localStorage
  useEffect(() => {
    if (!hasMounted) return;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('aicte_sih26261_apps_v2', JSON.stringify(applications));
      }
    } catch (err) {
      console.warn('Failed to persist applications to localStorage:', err);
    }
  }, [applications, hasMounted]);

  // Persist mutated auditLogs to localStorage
  useEffect(() => {
    if (!hasMounted) return;
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('aicte_sih26261_audit_v2', JSON.stringify(auditLogs));
      }
    } catch (err) {
      console.warn('Failed to persist auditLogs to localStorage:', err);
    }
  }, [auditLogs, hasMounted]);

  const resetFilters = useCallback(() => setFilters(defaultFilters), []);

  const resetDemoState = useCallback(() => {
    setApplications(MOCK_APPLICATIONS);
    setAuditLogs(INITIAL_AUDIT_BLOCKS);
    setFilters(defaultFilters);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aicte_sih26261_apps_v2');
        localStorage.removeItem('aicte_sih26261_audit_v2');
      }
    } catch (err) {
      console.warn('Failed to clear demo state from localStorage:', err);
    }
    toast.info('Demo state reset: Initial 6 flagship institutions & default audit ledger restored.', {
      duration: 4000,
    });
  }, []);

  const updateApplicationStatus = useCallback(
    (id: string, status: InstitutionalApplication['scrutinyStatus'], officerNote?: string) => {
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
    },
    []
  );

  /**
   * ACTION 1: Approve Extension of Approval (EoA)
   * Mutates scrutinyStatus to 'Auto-Pre-Cleared', clears fatal veto, creates SHA-256 block, prepends to auditLogs
   */
  const approveApplicationEoA = useCallback(
    async (appId: string, officerNote?: string): Promise<AuditBlock | null> => {
      const targetApp = applications.find((a) => a.id === appId);
      const appName = targetApp ? targetApp.nameEn : appId;
      const note =
        officerNote ||
        'Statutory approval for Extension of Approval (EoA 2026–27) granted by Regional Scrutiny Officer.';

      // 1. Mutate application in state
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === appId) {
            return {
              ...app,
              scrutinyStatus: 'Auto-Pre-Cleared',
              fatalGateTriggered: false,
              officerNote: note,
            };
          }
          return app;
        })
      );

      // 2. Compute SHA-256 cryptographic hash over (previousBlockHash + timestamp + appId + actionType + officerId)
      // Determine highest blockIndex and latest block hash
      const highestBlock = auditLogs.reduce(
        (max, b) => (b.blockIndex > max.blockIndex ? b : max),
        auditLogs[0] || { blockIndex: 0, currentHash: '0'.repeat(64) }
      );
      const previousHash = highestBlock.currentHash;
      const nextIndex = highestBlock.blockIndex + 1;
      const timestamp = new Date().toISOString();
      const actionType = 'OFFICER_SIGN_OFF';
      const officerId = 'Regional Scrutiny Officer (RO-04 Shri R.K. Verma)';

      const currentHash = await computeAuditBlockHash(
        previousHash,
        timestamp,
        appId,
        actionType,
        officerId
      );

      const newBlock: AuditBlock = {
        blockIndex: nextIndex,
        timestamp,
        eventType: actionType,
        applicationId: appId,
        targetArtifact: 'Extension of Approval (EoA) Grant Certificate #AICTE/UB/2026-EOA',
        actorOrModel: officerId,
        previousHash,
        currentHash,
        status: 'VERIFIED',
      };

      // 3. Prepend block into immutable audit log state
      setAuditLogs((prev) => [newBlock, ...prev]);

      // 4. Structured sonner toast with direct action button
      toast.success(`EoA 2026–27 Approved: ${appName}`, {
        description: `Cryptographic block #${nextIndex} verified. Hash: ${currentHash.slice(0, 16)}...`,
        duration: 5000,
        action: {
          label: 'View in SHA-256 Audit Ledger →',
          onClick: () => router.push('/audit-trail'),
        },
      });

      return newBlock;
    },
    [applications, auditLogs, router]
  );

  /**
   * ACTION 2: Issue 15-Day EVC Deficiency Notice
   * Mutates scrutinyStatus to 'Deficiency Issued', creates SHA-256 block, prepends to auditLogs
   */
  const issueDeficiencyNotice = useCallback(
    async (
      appId: string,
      deadlineDays: number = 15,
      officerNote?: string
    ): Promise<AuditBlock | null> => {
      const targetApp = applications.find((a) => a.id === appId);
      const appName = targetApp ? targetApp.nameEn : appId;
      const note =
        officerNote ||
        `Deficiency notice issued with ${deadlineDays}-day statutory EVC rectification period under APH Chapter VII.`;

      // 1. Mutate application in state
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === appId) {
            return {
              ...app,
              scrutinyStatus: 'Deficiency Issued',
              officerNote: note,
            };
          }
          return app;
        })
      );

      // 2. Compute SHA-256 cryptographic hash over (previousBlockHash + timestamp + appId + actionType + officerId)
      const highestBlock = auditLogs.reduce(
        (max, b) => (b.blockIndex > max.blockIndex ? b : max),
        auditLogs[0] || { blockIndex: 0, currentHash: '0'.repeat(64) }
      );
      const previousHash = highestBlock.currentHash;
      const nextIndex = highestBlock.blockIndex + 1;
      const timestamp = new Date().toISOString();
      const actionType = 'DEFICIENCY_DISPATCH';
      const officerId = 'AICTE Dispatch Gateway (DPI v4.2)';

      const currentHash = await computeAuditBlockHash(
        previousHash,
        timestamp,
        appId,
        actionType,
        officerId
      );

      const newBlock: AuditBlock = {
        blockIndex: nextIndex,
        timestamp,
        eventType: actionType,
        applicationId: appId,
        targetArtifact: `Form-A: ${deadlineDays}-Day EVC Rectification Notice #AICTE/DEF/${appId}`,
        actorOrModel: officerId,
        previousHash,
        currentHash,
        status: 'VALID',
      };

      // 3. Prepend into audit log
      setAuditLogs((prev) => [newBlock, ...prev]);

      // 4. Structured sonner toast with direct action button
      toast.warning(`Deficiency Notice Dispatched: ${appName}`, {
        description: `${deadlineDays}-day statutory rectification clock started. Block #${nextIndex} committed.`,
        duration: 5000,
        action: {
          label: 'Open Bilingual Notice →',
          onClick: () => router.push(`/deficiencies?appId=${appId}`),
        },
      });

      return newBlock;
    },
    [applications, auditLogs, router]
  );

  /**
   * ACTION 3: Escalate to Standing Hearing Committee (SHC)
   * Mutates scrutinyStatus to 'Fatal Fraud Alert', sets fatalGateTriggered = true, creates SHA-256 block, prepends to auditLogs
   */
  const escalateToStandingHearingCommittee = useCallback(
    async (appId: string, reason?: string): Promise<AuditBlock | null> => {
      const targetApp = applications.find((a) => a.id === appId);
      const appName = targetApp ? targetApp.nameEn : appId;
      const note =
        reason ||
        'Fatal fraud flag confirmed via TruFor & API Setu. Hearing summons drafted under APH Chapter VIII.';

      // 1. Mutate application in state
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === appId) {
            return {
              ...app,
              scrutinyStatus: 'Fatal Fraud Alert',
              fatalGateTriggered: true,
              officerNote: note,
            };
          }
          return app;
        })
      );

      // 2. Compute SHA-256 cryptographic hash over (previousBlockHash + timestamp + appId + actionType + officerId)
      const highestBlock = auditLogs.reduce(
        (max, b) => (b.blockIndex > max.blockIndex ? b : max),
        auditLogs[0] || { blockIndex: 0, currentHash: '0'.repeat(64) }
      );
      const previousHash = highestBlock.currentHash;
      const nextIndex = highestBlock.blockIndex + 1;
      const timestamp = new Date().toISOString();
      const actionType = 'OFFICER_SIGN_OFF';
      const officerId = 'Regional Scrutiny Officer (RO-04 Shri R.K. Verma)';

      const currentHash = await computeAuditBlockHash(
        previousHash,
        timestamp,
        appId,
        actionType,
        officerId
      );

      const newBlock: AuditBlock = {
        blockIndex: nextIndex,
        timestamp,
        eventType: actionType,
        applicationId: appId,
        targetArtifact: `Form-B: Standing Hearing Committee Show-Cause Order #AICTE/SHC/${appId}`,
        actorOrModel: officerId,
        previousHash,
        currentHash,
        status: 'VERIFIED',
      };

      // 3. Prepend into audit log
      setAuditLogs((prev) => [newBlock, ...prev]);

      // 4. Structured sonner toast with direct action button
      toast.error(`Escalated to Standing Hearing Committee: ${appName}`, {
        description: `Hearing order drafted under APH Chapter VIII. Block #${nextIndex} committed.`,
        duration: 6000,
        action: {
          label: 'Open Bilingual Notice →',
          onClick: () => router.push(`/deficiencies?appId=${appId}`),
        },
      });

      return newBlock;
    },
    [applications, auditLogs, router]
  );

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Academic year
      if (
        filters.academicYear &&
        filters.academicYear !== '2026-27' &&
        app.academicYear !== filters.academicYear
      ) {
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
      if (
        filters.applicationCategory !== 'All Categories' &&
        app.applicationCategory !== filters.applicationCategory
      ) {
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

  const value: AppStoreContextType = {
    filters,
    setFilters,
    resetFilters,
    resetDemoState,
    applications,
    setApplications,
    filteredApplications,
    selectedAppId,
    setSelectedAppId,
    auditLogs,
    setAuditLogs,
    updateApplicationStatus,
    approveApplicationEoA,
    issueDeficiencyNotice,
    escalateToStandingHearingCommittee,
  };

  return <AppStoreContext.Provider value={value}>{children}</AppStoreContext.Provider>;
}

export function useFilters(): AppStoreContextType {
  const context = useContext(AppStoreContext);
  if (!context) throw new Error('useFilters must be used within a FilterProvider');
  return context;
}

export function useAppStore(): AppStoreContextType {
  return useFilters();
}
