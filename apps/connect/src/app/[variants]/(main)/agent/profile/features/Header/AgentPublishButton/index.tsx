import { memo } from 'react';

import AgentActivationToggle from './AgentActivationToggle';

/**
 * Agent Publish/Activation Button Component
 *
 * Simple toggle to activate/deactivate agents for production use (24/7)
 */
const AgentPublishButton = memo(() => {
  return <AgentActivationToggle />;
});

export default AgentPublishButton;
