'use client';

import { createModal } from '@lobehub/ui';
import { t } from 'i18next';
import type { Klavis } from 'klavis';

import {
  type BuiltinSkillMeta,
  IntegrationDetailContent,
  type IntegrationType,
} from './IntegrationDetailContent';

export type { BuiltinSkillMeta, IntegrationType } from './IntegrationDetailContent';

export interface CreateIntegrationDetailModalOptions {
  builtinMeta?: BuiltinSkillMeta;
  identifier: string;
  serverName?: Klavis.McpServerName;
  type: IntegrationType;
}

export const createIntegrationDetailModal = ({
  identifier,
  serverName,
  type,
  builtinMeta,
}: CreateIntegrationDetailModalOptions) =>
  createModal({
    children: (
      <IntegrationDetailContent
        builtinMeta={builtinMeta}
        identifier={identifier}
        serverName={serverName}
        type={type}
      />
    ),
    destroyOnHidden: true,
    footer: null,
    title: t('dev.title.skillDetails', { ns: 'plugin' }),
    width: 800,
  });
