import Walker from './Walker';

interface LinksInterface {
  action: string;
  messages: string;
}

export default interface WalkerResponse {
  walker: Walker | null;
  links?: LinksInterface;
}
  