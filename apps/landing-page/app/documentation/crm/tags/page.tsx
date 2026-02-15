'use client';

import React from 'react';
import { Flexbox } from '@lobehub/ui';
import { Tag } from 'antd';
import { useDocStyles } from '../../_components/doc-styles';
import { DocNavFooter } from '../../_components/DocNavFooter';

export default function TagsPage() {
    const { styles } = useDocStyles();

    return (
        <>
            <section className={styles.sectionBlock}>
                <h1 className={styles.sectionTitle}>Tags & Segments</h1>
                <p className={styles.sectionSubtitle}>Organisez vos contacts avec des tags pour mieux cibler vos communications.</p>

                <p className={styles.prose}>Exemples de tags :</p>
                <Flexbox horizontal gap={8} wrap="wrap" style={{ margin: '12px 0 20px' }}>
                    {['Client VIP', 'Prospect chaud', 'Support en cours', 'Newsletter', 'Commande passée', 'Relance', 'Partenaire'].map((tag) => (
                        <Tag key={tag} color="green" style={{ borderRadius: 8, padding: '4px 12px' }}>{tag}</Tag>
                    ))}
                </Flexbox>
                <p className={styles.prose}>
                    Les tags peuvent être ajoutés manuellement ou automatiquement par l'agent IA en fonction du contenu de la conversation. Disponible à partir du plan <strong>Pro</strong>.
                </p>
            </section>

            <DocNavFooter
                prev={{ label: 'Gestion des contacts', href: '/documentation/crm' }}
                next={{ label: 'Historique de conversations', href: '/documentation/crm/history' }}
            />
        </>
    );
}
