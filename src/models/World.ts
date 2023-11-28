import Event from '../interfaces/Event';
import Walker from '../interfaces/Walker';
import { createWalker, isWalkerExists } from './Walker';

export interface WorldData {
  // Walkers
  addWalker: (name: string) => Promise<Walker | null>;
  getWalkerById: (id: string) => Promise<Walker | null>;
  findPlayerByName: (name: string) => Promise<Walker | null>; // fpbn(name)
  // Events
  getEvents: (firstEventId: number | null, lastEventId: number | null) => Promise<Event[]>;
  getLastEventId: () => Promise<number>; // findend
}

interface WorldInterface {
  load: () => Promise<WorldData>;
}

interface SavedData {
  maxWalkerId: number; // maxu
  walkers: Walker[];
  firstEventId: number;
  lastEventId: number;
  events: Event[];
}

const data: SavedData = {
  maxWalkerId: 16,
  walkers: [
    createWalker(0, 'Name'),
  ],
  firstEventId: 0,
  lastEventId: 0,
  events: [
    {
      id: 0,
      code: 0,
      payload: '',
    },
  ],
};

const load = async () => {
  const getWalker = async (walkerId: number) => {
    const walker = data.walkers[walkerId];
    return isWalkerExists(walker) ? walker : null;
  };

  const getAllWalkers = async () => {
    const walkerIds = [];
    for (let walkerId = 0; walkerId < data.maxWalkerId; walkerId += 1) {
      walkerIds.push(walkerId);
    }
    return Promise.all(walkerIds.map(getWalker));
  };

  const getWalkerId = async () => {
    const walkers = await getAllWalkers();
    return walkers.reduce(
      (result: number | null, walker: Walker | null, walkerId: number) => {
        if (result) {
          return result;
        }
        return walker ? null : walkerId;
      },
      null,
    );
  };

  const findPlayerByName = async (name: string) => {
    const walkers = await getAllWalkers();
    return walkers.find((walker) => (walker && (walker.name === name))) || null;
  };

  const addWalker = async (name: string) => {
    const found = await findPlayerByName(name);
    if (found) {
      throw new Error('You are already on the system - you may only be on once at a time');
    }
  
    const walkerId = await getWalkerId();

    if (walkerId === null) {
      throw new Error('Sorry AberMUD is full at the moment');
    }
    
    // TODO: Create new message buffer (sysbuf)
    const walker = createWalker(walkerId, name);
    data.walkers[walkerId] = walker;
    // TODO: Reset eventId

    return walker;
  };

  const getWalkerById = async (id: string) => {
    const walkerId = parseInt(id, 10);
    return getWalker(walkerId);
  };

  const normalizeEventId = (id: number) => (id - data.firstEventId);

  const getLastEventId = async () => data.lastEventId;

  const getEventById = async (id: number): Promise<Event> => {
    const eventId = normalizeEventId(id);
    return data.events[eventId];
  };

  const getEvents = async (firstEventId: number | null, lastEventId: number | null): Promise<Event[]> => {
    if ((firstEventId === null) || (lastEventId === null)) {
      return [];
    }
  
    const eventIds: number[] = [];
    for (let eventId = firstEventId; eventId < lastEventId; eventId += 1) {
      eventIds.push(eventId);
    }

    return Promise.all(eventIds.map(getEventById));
  };

  return {
    addWalker,
    findPlayerByName,
    getEvents,
    getLastEventId,
    getWalkerById,
  };
};

const World: WorldInterface = {
  load,
};

export default World;
