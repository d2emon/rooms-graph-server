interface WalkerFlags {
  //
}
    
export default interface Walker {
  id: number;
  name: string;
  channelId: number;
  eventId: number;
  level: number;
  visibility: number;
  strength: number;
  weaponId: number;
  flags: WalkerFlags;
}
    