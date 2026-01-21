import { useState, useEffect, useCallback } from 'react';

interface Project {
    id: string;
    reference: string;
    name: string;
    description: string;
    type: string;
    priority: string;
    requirements: string[];
    colors: any;
    client: {
        name: string;
        email: string;
        phone?: string;
    };
    price: number;
    commission: number;
    estimatedTime: string;
    submittedAt: Date;
    status: string;
}

interface MyProject {
    id: string;
    reference: string;
    name: string;
    description: string;
    type: string;
    client: {
        name: string;
        email: string;
    };
    status: string;
    progress: number;
    price: number;
    commission: number;
    estimatedTime: number;
    startedAt: Date | null;
    completedAt: Date | null;
    deployUrl: string | null;
    previewUrl: string | null;
}

interface CoderStats {
    pendingProjects: number;
    buildingProjects: number;
    completedProjects: number;
    totalProjects: number;
    avgBuildTime: string;
    rating: number;
}

interface Earnings {
    total: number;
    pending: number;
    paid: number;
    thisMonth: number;
}

interface Coder {
    id: string;
    coderNumber: number;
    name: string;
    email: string;
    level: string;
    rating: number;
    status: string;
    specialty: string[];
}

// Get coder ID from localStorage or session
const getStoredCoderId = (): string | null => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('gnata-coder-id');
    }
    return null;
};

const setStoredCoderId = (id: string) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('gnata-coder-id', id);
    }
};

// Hook for fetching available projects
export function useAvailableProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/coder/projects');
            const data = await res.json();

            if (data.success) {
                setProjects(data.projects);
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const takeProject = useCallback(async (projectId: string) => {
        const coderId = getStoredCoderId();
        if (!coderId) {
            throw new Error('Not logged in');
        }

        const res = await fetch('/api/coder/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, coderId }),
        });

        const data = await res.json();
        if (!data.success) {
            throw new Error(data.error);
        }

        // Refresh projects list
        await fetchProjects();
        return data.project;
    }, [fetchProjects]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return { projects, loading, error, refetch: fetchProjects, takeProject };
}

// Hook for fetching coder's own projects
export function useMyProjects() {
    const [projects, setProjects] = useState<MyProject[]>([]);
    const [stats, setStats] = useState({
        building: 0,
        review: 0,
        completed: 0,
        totalCommission: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProjects = useCallback(async (status?: string) => {
        const coderId = getStoredCoderId();
        if (!coderId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const url = status
                ? `/api/coder/my-projects?coderId=${coderId}&status=${status}`
                : `/api/coder/my-projects?coderId=${coderId}`;

            const res = await fetch(url);
            const data = await res.json();

            if (data.success) {
                setProjects(data.projects);
                setStats(data.stats);
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateProjectStatus = useCallback(async (
        projectId: string,
        status: string,
        deployUrl?: string,
        previewUrl?: string
    ) => {
        const res = await fetch('/api/coder/my-projects', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId, status, deployUrl, previewUrl }),
        });

        const data = await res.json();
        if (!data.success) {
            throw new Error(data.error);
        }

        // Refresh projects list
        await fetchProjects();
        return data.project;
    }, [fetchProjects]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    return {
        projects,
        stats,
        loading,
        error,
        refetch: fetchProjects,
        updateStatus: updateProjectStatus,
    };
}

// Hook for coder statistics
export function useCoderStats() {
    const [coder, setCoder] = useState<Coder | null>(null);
    const [stats, setStats] = useState<CoderStats | null>(null);
    const [earnings, setEarnings] = useState<Earnings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        const coderId = getStoredCoderId();
        if (!coderId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const res = await fetch(`/api/coder/stats?coderId=${coderId}`);
            const data = await res.json();

            if (data.success) {
                setCoder(data.coder);
                setStats(data.stats);
                setEarnings(data.earnings);
            } else {
                setError(data.error);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { coder, stats, earnings, loading, error, refetch: fetchStats };
}

// Hook for coder authentication
export function useCoderAuth() {
    const [coder, setCoder] = useState<Coder | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const coderId = getStoredCoderId();
        setIsLoggedIn(!!coderId);
        setLoading(false);

        if (coderId) {
            // Fetch coder info
            fetch(`/api/coder/stats?coderId=${coderId}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setCoder(data.coder);
                    }
                });
        }
    }, []);

    const login = useCallback(async (email: string, password: string) => {
        const res = await fetch('/api/coder/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'login', email, password }),
        });

        const data = await res.json();
        if (!data.success) {
            throw new Error(data.error);
        }

        setStoredCoderId(data.coder.id);
        setCoder(data.coder);
        setIsLoggedIn(true);
        return data.coder;
    }, []);

    const register = useCallback(async (
        email: string,
        password: string,
        name?: string,
        phone?: string
    ) => {
        const res = await fetch('/api/coder/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'register', email, password, name, phone }),
        });

        const data = await res.json();
        if (!data.success) {
            throw new Error(data.error);
        }

        setStoredCoderId(data.coder.id);
        setCoder(data.coder);
        setIsLoggedIn(true);
        return data.coder;
    }, []);

    const logout = useCallback(() => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('gnata-coder-id');
        }
        setCoder(null);
        setIsLoggedIn(false);
    }, []);

    return { coder, isLoggedIn, loading, login, register, logout };
}
