interface ConversationModeData {
  conversationMode?: number; // convflg
}

export const MODE_ACTION = 0;
export const MODE_SAY = 1;
export const MODE_TSS = 2;

const data: ConversationModeData = {};

export const getConversationMode = () => data.conversationMode;
export const setConversationMode = (conversationMode: number) => {
  data.conversationMode = conversationMode;
};

export const getBasePrompt = () => {
  if (data.conversationMode === MODE_ACTION) {
    return '>';
  } else if (data.conversationMode === MODE_SAY) {
    return '"';
  } else if (data.conversationMode === MODE_TSS) {
    return '*';
  } else {
    return '?';
  }   
};

export const converseAction = (action: string): string => {
  if (!action) {
    return '';
  }
      
  if ((action !== '*') && (action[0] === '*')) {
    return action.substring(1);
  }
  
  if (data.conversationMode === MODE_ACTION) {
    return action;
  } else if (data.conversationMode === MODE_SAY) {
    return `say ${action}`;
  } else if (data.conversationMode === MODE_TSS) {
    return `tss ${action}`;
  } else {
    return '';
  }   
};

const withConversion = async (
  onBeforeConversion: () => Promise<string>,
  onAfterConversion: (action: string) => Promise<boolean>,
): Promise<boolean> => {
  const action = await onBeforeConversion();

  if ((data.conversationMode !== MODE_ACTION) && (action === '**')) {
    data.conversationMode = MODE_ACTION;

    return withConversion(
      onBeforeConversion,
      onAfterConversion,
    );
  }

  return onAfterConversion(action);
};

export default withConversion;
