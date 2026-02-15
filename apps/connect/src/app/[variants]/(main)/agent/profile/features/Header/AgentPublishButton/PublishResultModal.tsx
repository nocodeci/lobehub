'use client';

import { FluentEmoji, Modal, Text } from '@lobehub/ui';
import { Result } from 'antd';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';

interface PublishResultModalProps {
  identifier?: string;
  onCancel: () => void;
  open: boolean;
}

const PublishResultModal = memo<PublishResultModalProps>(({ onCancel, open }) => {
  const { t } = useTranslation('setting');
  const { t: tCommon } = useTranslation('common');

  return (
    <Modal
      cancelButtonProps={{ style: { display: 'none' } }}
      centered
      okText={tCommon('ok')}
      onCancel={onCancel}
      onOk={onCancel}
      open={open}
      title={null}
      width={440}
    >
      <Result
        icon={<FluentEmoji emoji={'🎉'} size={96} type={'anim'} />}
        style={{
          paddingBottom: 32,
          paddingTop: 48,
          width: '100%',
        }}
        subTitle={
          <Text fontSize={14} type={'secondary'}>
            {t('marketPublish.resultModal.message')}
          </Text>
        }
        title={
          <Text fontSize={28} weight={'bold'}>
            {t('marketPublish.resultModal.title')}
          </Text>
        }
      />
    </Modal>
  );
});

export default PublishResultModal;

