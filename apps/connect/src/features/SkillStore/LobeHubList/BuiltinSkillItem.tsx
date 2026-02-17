'use client';

import { ActionIcon, Block, DropdownMenu, Flexbox } from '@lobehub/ui';
import { Avatar } from 'antd';
import { MoreVerticalIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import React, { memo, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAgentStore } from '@/store/agent';

import { itemStyles } from '../style';

interface BuiltinSkillItemProps {
  avatar: string;
  description: string;
  identifier: string;
  label: string;
}

const EMOJI_MAP: Record<string, string> = {
  '💻': '1f4bb',
  '📓': '1f4d3',
  '✅': '2705',
  '🧠': '1f9e0',
};

const BuiltinSkillItem = memo<BuiltinSkillItemProps>(
  ({ avatar, description, identifier, label }) => {
    const { t } = useTranslation('setting');
    const styles = itemStyles;
    const togglePlugin = useAgentStore((s) => s.togglePlugin);
    const [enabled, setEnabled] = useState(true);

    const handleToggle = useCallback(() => {
      setEnabled((prev) => !prev);
      togglePlugin(identifier);
    }, [identifier, togglePlugin]);

    const renderAvatar = () => {
      if (avatar.startsWith('data:')) {
        return (
          <Avatar
            shape="square"
            size={40}
            src={avatar}
            style={{ color: 'var(--ant-color-text)', marginInlineEnd: 0 }}
          />
        );
      }

      const emojiCode = EMOJI_MAP[avatar];
      if (emojiCode) {
        return (
          <Avatar
            shape="square"
            size={40}
            style={{
              color: 'var(--ant-color-text)',
              fontSize: 28,
              marginInlineEnd: 0,
            }}
          >
            <img
              alt={avatar}
              height={40}
              loading="lazy"
              src={`https://registry.npmmirror.com/@lobehub/fluent-emoji-3d/latest/files/assets/${emojiCode}.webp`}
              style={{ color: 'transparent', flex: '0 0 auto' }}
              width={40}
            />
          </Avatar>
        );
      }

      return (
        <Avatar
          shape="square"
          size={40}
          style={{ color: 'var(--ant-color-text)', fontSize: 28, marginInlineEnd: 0 }}
        >
          {avatar}
        </Avatar>
      );
    };

    return (
      <Block
        align={'center'}
        className={styles.container}
        gap={12}
        horizontal
        paddingBlock={12}
        paddingInline={12}
        style={{ cursor: 'pointer' }}
        variant={'outlined'}
      >
        {renderAvatar()}
        <Flexbox flex={1} gap={4} style={{ minWidth: 0, overflow: 'hidden' }}>
          <span className={styles.title}>{label}</span>
          <span className={styles.description}>{description}</span>
        </Flexbox>
        <div onClick={(e) => e.stopPropagation()}>
          <DropdownMenu
            items={[
              {
                icon: enabled ? <ToggleRight size={16} /> : <ToggleLeft size={16} />,
                key: 'toggle',
                label: enabled ? t('tools.lobehubSkill.disconnect') : t('tools.lobehubSkill.connect'),
                onClick: handleToggle,
              },
            ]}
            nativeButton={false}
            placement="bottomRight"
          >
            <ActionIcon icon={MoreVerticalIcon} />
          </DropdownMenu>
        </div>
      </Block>
    );
  },
);

BuiltinSkillItem.displayName = 'BuiltinSkillItem';

export default BuiltinSkillItem;
