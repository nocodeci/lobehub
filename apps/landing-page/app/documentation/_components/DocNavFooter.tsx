'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useDocStyles } from './doc-styles';

interface DocNavFooterProps {
    prev?: { label: string; href: string };
    next?: { label: string; href: string };
}

export const DocNavFooter = ({ prev, next }: DocNavFooterProps) => {
    const { styles } = useDocStyles();
    const router = useRouter();

    return (
        <div className={styles.navFooter}>
            {prev ? (
                <div className={styles.navLink} onClick={() => router.push(prev.href)}>
                    <ArrowLeft size={14} /> {prev.label}
                </div>
            ) : <div />}
            {next ? (
                <div className={styles.navLink} onClick={() => router.push(next.href)}>
                    {next.label} <ArrowRight size={14} />
                </div>
            ) : <div />}
        </div>
    );
};
