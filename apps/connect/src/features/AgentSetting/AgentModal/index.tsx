'use client';

import {
  Form,
  type FormGroupItemType,
  type FormItemProps,
  Icon,
  Select,
  SliderWithInput,
} from '@lobehub/ui';
import { Flexbox } from '@lobehub/ui';
import { Form as AntdForm, Checkbox, Input, InputNumber, Switch, Tag, Typography } from 'antd';
import { MessageSquareOff, Phone, Shield, ShoppingCart, Store, Users } from 'lucide-react';
import { createStaticStyles } from 'antd-style';
import isEqual from 'fast-deep-equal';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import InfoTooltip from '@/components/InfoTooltip';
import { FORM_STYLE } from '@/const/layoutTokens';

import { selectors, useStore } from '../store';
import EcommerceProductSelector from './EcommerceProductSelector';

type ParamKey = 'temperature' | 'top_p' | 'presence_penalty' | 'frequency_penalty';

const styles = createStaticStyles(({ css }) => ({
  label: css`
    user-select: none;
  `,
}));

// Wrapper component for slider with checkbox
interface SliderWithCheckboxProps {
  checked: boolean;
  disabled: boolean;
  max: number;
  min: number;
  onChange?: (value: number) => void;
  onToggle: (checked: boolean) => void;
  step: number;
  styles: any;
  unlimitedInput?: boolean;
  value?: number;
}

const SliderWithCheckbox = memo<SliderWithCheckboxProps>(
  ({ value, onChange, disabled, checked, onToggle, min, max, step, unlimitedInput }) => {
    return (
      <Flexbox align="center" gap={12} horizontal justify={'flex-end'} width={300}>
        {!disabled && (
          <div style={{ flex: 1 }}>
            <SliderWithInput
              disabled={disabled}
              max={max}
              min={min}
              onChange={onChange}
              step={step}
              unlimitedInput={unlimitedInput}
              value={value}
            />
          </div>
        )}
        <Switch
          checked={checked}
          onChange={(v) => {
            onToggle(v);
          }}
          size={checked ? 'small' : 'default'}
        />
      </Flexbox>
    );
  },
);

// Wrapper component for select with checkbox
interface SelectWithCheckboxProps {
  checked: boolean;
  onChange?: (value: string) => void;
  onToggle: (checked: boolean) => void;
  options: Array<{ label: string; value: string }>;
  value?: string;
}

const SelectWithCheckbox = memo<SelectWithCheckboxProps>(
  ({ value, onChange, checked, onToggle, options }) => {
    return (
      <Flexbox align="center" gap={12} horizontal justify={'flex-end'} width={300}>
        {checked && (
          <div style={{ flex: 1 }}>
            <Select onChange={onChange} options={options} value={value} />
          </div>
        )}
        <Switch
          checked={checked}
          onChange={(v) => {
            onToggle(v);
          }}
          size={checked ? 'small' : 'default'}
        />
      </Flexbox>
    );
  },
);

const PARAM_NAME_MAP: Record<ParamKey, (string | number)[]> = {
  frequency_penalty: ['params', 'frequency_penalty'],
  presence_penalty: ['params', 'presence_penalty'],
  temperature: ['params', 'temperature'],
  top_p: ['params', 'top_p'],
};

const PARAM_DEFAULTS: Record<ParamKey, number> = {
  frequency_penalty: 0,
  presence_penalty: 0,
  temperature: 0.7,
  top_p: 1,
};

const PARAM_CONFIG = {
  frequency_penalty: {
    descKey: 'settingModel.frequencyPenalty.desc',
    labelKey: 'settingModel.frequencyPenalty.title',
    slider: { max: 2, min: -2, step: 0.1 },
    tag: 'frequency_penalty',
  },
  presence_penalty: {
    descKey: 'settingModel.presencePenalty.desc',
    labelKey: 'settingModel.presencePenalty.title',
    slider: { max: 2, min: -2, step: 0.1 },
    tag: 'presence_penalty',
  },
  temperature: {
    descKey: 'settingModel.temperature.desc',
    labelKey: 'settingModel.temperature.title',
    slider: { max: 2, min: 0, step: 0.1 },
    tag: 'temperature',
  },
  top_p: {
    descKey: 'settingModel.topP.desc',
    labelKey: 'settingModel.topP.title',
    slider: { max: 1, min: 0, step: 0.1 },
    tag: 'top_p',
  },
} satisfies Record<
  ParamKey,
  {
    descKey: string;
    labelKey: string;
    slider: { max: number; min: number; step: number };
    tag: string;
  }
>;

const AgentModal = memo(() => {
  const { t } = useTranslation('setting');
  const [form] = Form.useForm();
  const config = useStore(selectors.currentAgentConfig, isEqual);

  const updateConfig = useStore((s) => s.setAgentConfig);

  const { temperature, top_p, presence_penalty, frequency_penalty } = config.params ?? {};

  const lastValuesRef = useRef<Record<ParamKey, number | undefined>>({
    frequency_penalty,
    presence_penalty,
    temperature,
    top_p,
  });

  useEffect(() => {
    form.setFieldsValue(config);

    if (typeof temperature === 'number') lastValuesRef.current.temperature = temperature;
    if (typeof top_p === 'number') lastValuesRef.current.top_p = top_p;
    if (typeof presence_penalty === 'number') {
      lastValuesRef.current.presence_penalty = presence_penalty;
    }
    if (typeof frequency_penalty === 'number') {
      lastValuesRef.current.frequency_penalty = frequency_penalty;
    }
  }, [config, form, temperature, top_p, presence_penalty, frequency_penalty]);

  const temperatureValue = AntdForm.useWatch(PARAM_NAME_MAP.temperature, form);
  const topPValue = AntdForm.useWatch(PARAM_NAME_MAP.top_p, form);
  const presencePenaltyValue = AntdForm.useWatch(PARAM_NAME_MAP.presence_penalty, form);
  const frequencyPenaltyValue = AntdForm.useWatch(PARAM_NAME_MAP.frequency_penalty, form);

  useEffect(() => {
    if (typeof temperatureValue === 'number') lastValuesRef.current.temperature = temperatureValue;
  }, [temperatureValue]);

  useEffect(() => {
    if (typeof topPValue === 'number') lastValuesRef.current.top_p = topPValue;
  }, [topPValue]);

  useEffect(() => {
    if (typeof presencePenaltyValue === 'number') {
      lastValuesRef.current.presence_penalty = presencePenaltyValue;
    }
  }, [presencePenaltyValue]);

  useEffect(() => {
    if (typeof frequencyPenaltyValue === 'number') {
      lastValuesRef.current.frequency_penalty = frequencyPenaltyValue;
    }
  }, [frequencyPenaltyValue]);

  const enabledMap: Record<ParamKey, boolean> = {
    frequency_penalty: typeof frequencyPenaltyValue === 'number',
    presence_penalty: typeof presencePenaltyValue === 'number',
    temperature: typeof temperatureValue === 'number',
    top_p: typeof topPValue === 'number',
  };

  const handleToggle = useCallback(
    (key: ParamKey, enabled: boolean) => {
      const namePath = PARAM_NAME_MAP[key];

      if (!enabled) {
        const currentValue = form.getFieldValue(namePath);
        if (typeof currentValue === 'number') {
          lastValuesRef.current[key] = currentValue;
        }
        form.setFieldValue(namePath, undefined);
        return;
      }

      const fallback = lastValuesRef.current[key];
      const nextValue = typeof fallback === 'number' ? fallback : PARAM_DEFAULTS[key];
      lastValuesRef.current[key] = nextValue;
      form.setFieldValue(namePath, nextValue);
    },
    [form],
  );

  const paramItems: FormItemProps[] = (Object.keys(PARAM_CONFIG) as ParamKey[]).map((key) => {
    const meta = PARAM_CONFIG[key];
    const enabled = enabledMap[key];

    return {
      children: (
        <SliderWithCheckbox
          checked={enabled}
          disabled={!enabled}
          max={meta.slider.max}
          min={meta.slider.min}
          onToggle={(checked) => handleToggle(key, checked)}
          step={meta.slider.step}
          styles={styles}
        />
      ),
      desc: t(meta.descKey as any),
      label: (
        <Flexbox align={'center'} className={styles.label} gap={8} horizontal>
          {t(meta.labelKey as any)}
          <InfoTooltip title={t(meta.descKey as any)} />
        </Flexbox>
      ),
      minWidth: undefined,
      name: PARAM_NAME_MAP[key],
      tag: meta.tag,
    } satisfies FormItemProps;
  });

  const maxTokensValue = AntdForm.useWatch(['params', 'max_tokens'], form);
  const reasoningEffortValue = AntdForm.useWatch(['params', 'reasoning_effort'], form);

  const model: FormGroupItemType = {
    children: [
      {
        children: <Switch />,
        desc: t('settingChat.enableStreaming.desc'),
        label: t('settingChat.enableStreaming.title'),
        layout: 'horizontal',
        minWidth: undefined,
        name: ['chatConfig', 'enableStreaming'],
        valuePropName: 'checked',
      },
      ...paramItems,
      {
        children: (
          <SliderWithCheckbox
            checked={typeof maxTokensValue === 'number'}
            disabled={typeof maxTokensValue !== 'number'}
            max={32_000}
            min={0}
            onToggle={(checked) => {
              if (!checked) {
                form.setFieldValue(['params', 'max_tokens'], undefined);
              } else {
                form.setFieldValue(['params', 'max_tokens'], 4096);
              }
            }}
            step={100}
            styles={styles}
            unlimitedInput
          />
        ),
        desc: t('settingModel.maxTokens.desc'),
        label: (
          <Flexbox align={'center'} className={styles.label} gap={8} horizontal>
            {t('settingModel.maxTokens.title')}
            <InfoTooltip title={t('settingModel.maxTokens.desc')} />
          </Flexbox>
        ),
        minWidth: undefined,
        name: ['params', 'max_tokens'],
        tag: 'max_tokens',
      },
      {
        children: (
          <SelectWithCheckbox
            checked={typeof reasoningEffortValue === 'string'}
            onToggle={(checked) => {
              if (!checked) {
                form.setFieldValue(['params', 'reasoning_effort'], undefined);
              } else {
                form.setFieldValue(['params', 'reasoning_effort'], 'medium');
              }
            }}
            options={[
              { label: t('settingModel.reasoningEffort.options.low'), value: 'low' },
              { label: t('settingModel.reasoningEffort.options.medium'), value: 'medium' },
              { label: t('settingModel.reasoningEffort.options.high'), value: 'high' },
            ]}
          />
        ),
        desc: t('settingModel.reasoningEffort.desc'),
        label: (
          <Flexbox align={'center'} className={styles.label} gap={8} horizontal>
            {t('settingModel.reasoningEffort.title')}
            <InfoTooltip title={t('settingModel.reasoningEffort.desc')} />
          </Flexbox>
        ),
        minWidth: undefined,
        name: ['params', 'reasoning_effort'],
        tag: 'reasoning_effort',
      },
    ],
    title: t('settingModel.title'),
  };

  // --- WhatsApp Automation Config ---
  const hasWhatsApp = config.plugins?.includes('lobe-whatsapp-local');

  const whatsappAutomation: FormGroupItemType = {
    children: [
      {
        children: <Switch />,
        desc: 'Quand vous répondez manuellement à une conversation, l\'IA se met en pause automatiquement pendant la durée configurée.',
        label: (
          <Flexbox align={'center'} className={styles.label} gap={8} horizontal>
            <Icon icon={MessageSquareOff} size={16} />
            Prise humaine (Human Takeover)
          </Flexbox>
        ),
        layout: 'horizontal',
        minWidth: undefined,
        name: ['params', 'whatsappConfig', 'humanTakeoverEnabled'],
        valuePropName: 'checked',
      },
      {
        children: <InputNumber min={5} max={1440} addonAfter="min" style={{ width: 160 }} />,
        desc: 'Durée de pause de l\'IA après qu\'un humain a répondu (5 à 1440 minutes).',
        label: 'Durée de pause',
        minWidth: undefined,
        name: ['params', 'whatsappConfig', 'humanTakeoverMinutes'],
      },
      {
        children: <Switch />,
        desc: 'Si activé, l\'agent IA répondra aussi dans les conversations de groupe WhatsApp.',
        label: (
          <Flexbox align={'center'} className={styles.label} gap={8} horizontal>
            <Icon icon={Users} size={16} />
            Répondre dans les groupes
          </Flexbox>
        ),
        layout: 'horizontal',
        minWidth: undefined,
        name: ['params', 'whatsappConfig', 'respondToGroups'],
        valuePropName: 'checked',
      },
      {
        children: <Input.TextArea placeholder="Un numéro par ligne (ex: 33612345678)" rows={3} />,
        desc: 'L\'agent IA ne répondra JAMAIS à ces numéros. Format international sans le +.',
        label: (
          <Flexbox align={'center'} className={styles.label} gap={8} horizontal>
            <Icon icon={Shield} size={16} />
            Numéros bloqués
          </Flexbox>
        ),
        minWidth: undefined,
        name: ['params', 'whatsappConfig', 'blockedNumbers'],
      },
      {
        children: <Switch />,
        desc: 'Si activé, l\'agent ne répondra QU\'aux numéros de la liste autorisée ci-dessous.',
        label: (
          <Flexbox align={'center'} className={styles.label} gap={8} horizontal>
            <Icon icon={Phone} size={16} />
            Mode liste blanche uniquement
          </Flexbox>
        ),
        layout: 'horizontal',
        minWidth: undefined,
        name: ['params', 'whatsappConfig', 'allowedNumbersOnly'],
        valuePropName: 'checked',
      },
      {
        children: <Input.TextArea placeholder="Un numéro par ligne (ex: 33612345678)" rows={3} />,
        desc: 'L\'agent IA ne répondra QU\'à ces numéros (mode liste blanche).',
        label: 'Numéros autorisés',
        minWidth: undefined,
        name: ['params', 'whatsappConfig', 'allowedNumbers'],
      },
    ],
    icon: Phone,
    title: '⚙️ Automatisation WhatsApp',
  };

  // --- E-Commerce Config ---
  const hasEcommerce = config.plugins?.includes('lobe-ecommerce');

  const ecommerceConfig: FormGroupItemType = {
    children: [
      {
        children: <EcommerceProductSelector />,
        desc: 'Sélectionnez les produits de votre catalogue que cet agent pourra vendre. Si aucun produit n\'est sélectionné, l\'agent aura accès à tous les produits.',
        label: (
          <Flexbox align={'center'} className={styles.label} gap={8} horizontal>
            <Icon icon={ShoppingCart} size={16} />
            Produits assignés
          </Flexbox>
        ),
        minWidth: undefined,
        name: ['params', 'ecommerceConfig', 'selectedProductIds'],
      },
      {
        children: <Switch />,
        desc: 'L\'agent présentera automatiquement les produits sélectionnés aux clients et pourra prendre des commandes.',
        label: (
          <Flexbox align={'center'} className={styles.label} gap={8} horizontal>
            <Icon icon={Store} size={16} />
            Mode vendeur automatique
          </Flexbox>
        ),
        layout: 'horizontal',
        minWidth: undefined,
        name: ['params', 'ecommerceConfig', 'autoSellMode'],
        valuePropName: 'checked',
      },
      {
        children: <Input.TextArea placeholder="Instructions personnalisées pour la vente..." rows={3} />,
        desc: 'Instructions supplémentaires pour l\'agent lors de la vente (ton, style, promotions, etc.).',
        label: 'Instructions de vente personnalisées',
        minWidth: undefined,
        name: ['params', 'ecommerceConfig', 'customSalesInstructions'],
      },
    ],
    icon: ShoppingCart,
    title: '🛒 E-Commerce',
  };

  const formItems = [
    model,
    ...(hasWhatsApp ? [whatsappAutomation] : []),
    ...(hasEcommerce ? [ecommerceConfig] : []),
  ];

  return (
    <Form
      footer={<Form.SubmitFooter />}
      form={form}
      initialValues={config}
      items={formItems}
      itemsType={'group'}
      onFinish={(values) => {
        // 清理 params 中的 undefined 和 null 值，确保禁用的参数被正确移除
        const cleanedValues = { ...values };
        if (cleanedValues.params) {
          const cleanedParams = { ...cleanedValues.params };
          (Object.keys(cleanedParams) as Array<keyof typeof cleanedParams>).forEach((key) => {
            // 使用 null 作为禁用标记（JSON 可以序列化 null，而 undefined 会被忽略）
            if (cleanedParams[key] === undefined) {
              cleanedParams[key] = null as any;
            }
          });
          cleanedValues.params = cleanedParams as any;
        }

        updateConfig(cleanedValues);
      }}
      variant={'borderless'}
      {...FORM_STYLE}
    />
  );
});

export default AgentModal;
