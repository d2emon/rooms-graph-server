interface MessageBufferData {
  messages: string; // sysbuf
}

const data: MessageBufferData = {
  messages: '',
};
  
export const getMessageBuffer = () => data.messages;
export const setMessageBuffer = (messages: string) => {
  data.messages = messages;
};
export const appendMessageBuffer = (message: string) => {
  data.messages += message;
};
  