import Walker from '../interfaces/Walker';

export const isWalkerExists = (walker: Walker | null): boolean => {
  if (!walker) {
    return false;
  }

  return !!walker.name;
};

export const createWalker = (id: number, name: string): Walker => ({
  id,
  name,
  channelId: 0,
  eventId: -1,
  level: 1,
  visibility: 0,
  strength: -1,
  weaponId: -1,
  flags: {},
});
  