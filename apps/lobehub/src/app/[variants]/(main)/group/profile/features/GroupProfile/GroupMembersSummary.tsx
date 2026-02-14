'use client';

import { Avatar, Flexbox, Tag, Text } from '@lobehub/ui';
import { cssVar } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { Crown, Users } from 'lucide-react';
import { memo } from 'react';

import { DEFAULT_AVATAR } from '@/const/meta';
import { useAgentStore } from '@/store/agent';
import { agentByIdSelectors } from '@/store/agent/selectors';
import { useAgentGroupStore } from '@/store/agentGroup';
import { agentGroupSelectors } from '@/store/agentGroup/selectors';

interface MemberCardProps {
    agentId: string;
    avatar?: string;
    backgroundColor?: string;
    isSupervisor?: boolean;
    title: string;
}

const MemberCard = memo<MemberCardProps>(({ agentId, avatar, backgroundColor, isSupervisor, title }) => {
    const config = useAgentStore(agentByIdSelectors.getAgentConfigById(agentId), isEqual);

    return (
        <Flexbox
            align="center"
            gap={10}
            horizontal
            style={{
                background: cssVar.colorFillQuaternary,
                border: `1px solid ${cssVar.colorBorderSecondary}`,
                borderRadius: 10,
                padding: '10px 14px',
            }}
        >
            <Avatar
                avatar={avatar || DEFAULT_AVATAR}
                background={backgroundColor}
                shape="square"
                size={32}
                style={{ borderRadius: 6, flex: 'none' }}
            />
            <Flexbox flex={1} gap={2} style={{ minWidth: 0 }}>
                <Flexbox align="center" gap={6} horizontal>
                    <Text ellipsis style={{ fontSize: 13, fontWeight: 600 }}>
                        {title}
                    </Text>
                    {isSupervisor && (
                        <Tag color="gold" size="small" style={{ flexShrink: 0 }}>
                            <Flexbox align="center" gap={2} horizontal>
                                <Crown size={10} />
                                Superviseur
                            </Flexbox>
                        </Tag>
                    )}
                </Flexbox>
                {config?.model && (
                    <Text style={{ color: cssVar.colorTextTertiary, fontSize: 11 }}>
                        {config.model}
                    </Text>
                )}
            </Flexbox>
        </Flexbox>
    );
});

MemberCard.displayName = 'MemberCard';

const GroupMembersSummary = memo(() => {
    const members = useAgentGroupStore(agentGroupSelectors.currentGroupAgents, isEqual);

    if (!members || members.length === 0) return null;

    return (
        <Flexbox gap={12} style={{ marginTop: 8 }}>
            <Flexbox align="center" gap={6} horizontal>
                <Users size={14} style={{ color: cssVar.colorTextSecondary }} />
                <Text style={{ color: cssVar.colorTextSecondary, fontSize: 13, fontWeight: 500 }}>
                    Membres ({members.length})
                </Text>
            </Flexbox>
            <Flexbox gap={6}>
                {members.map((member) => (
                    <MemberCard
                        agentId={member.id}
                        avatar={member.avatar || undefined}
                        backgroundColor={member.backgroundColor || undefined}
                        isSupervisor={member.isSupervisor}
                        key={member.id}
                        title={member.title || 'Agent'}
                    />
                ))}
            </Flexbox>
        </Flexbox>
    );
});

GroupMembersSummary.displayName = 'GroupMembersSummary';

export default GroupMembersSummary;
