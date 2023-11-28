import Event from '../interfaces/Event';
import World from './World';

const MAX_EVENT_CODE = -3;

interface EventProcessor {
  loadEvents: (eventId?: number | null) => Promise<void>;
}

const addMessage = async (message: string) => {
  console.log('bprintf', message);
};

const eventProcessor = (name: string): EventProcessor => {
  const userName = name.toLowerCase();
  const debugMode = 0;

  const systemEvent = async (event: Event) => {
    console.log('sysctrl', event, userName);
  };

  const processEvent = async (event: Event) => {
    /* Print appropriate stuff from data block */

    if (debugMode) {
      await addMessage(`<${event.code}>`);
    }

    if (event.code < MAX_EVENT_CODE) {
      await systemEvent(event);
    } else {
      await addMessage(`${event.payload}`);
    }
  };

  const loadEvents = async (eventId: number | null = null) => {
    const world = await World.load();

    const lastEventId = await world.getLastEventId();

    if (eventId !==  null) {
      const events = await world.getEvents(eventId, lastEventId);
      await Promise.all(events.map(processEvent));  
    }

    // TODO: Save lastEventId
    // TODO: Update eventId [update(name)]

    // eorte();

    // extern long vdes,tdes,rdes;
    // rdes = 0;
    // tdes = 0;
    // vdes = 0;

    // Optional
    // TODO: Save world [closeworld()]
  };

  return {
    loadEvents,
  };
};

export default eventProcessor;
