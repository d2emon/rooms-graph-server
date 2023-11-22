import withAlarm from './helpers/alarm';
import withConversion, { getBasePrompt } from './helpers/conversationMode';
import { checkFighting } from './helpers/fighting';
import { appendMessageBuffer, getFromBuffer } from './helpers/messageBuffer';
import withTty from './helpers/tty';

interface PlayerInterface {
  playerId: number; // mynum
  name: string; // pname
  channel: number; // ploc
  visibility: number; // pvis
}

interface MessageOptions {
  debugMode: number; // extern long debug_mode;
  // * getPrompt

  // * nadj
  curch: number;
  curmode: number;
  gamecom: (action: string) => Promise<void>;
  special: (action: string, name: string) => Promise<number>;

  // * sendMessage
  rte: (name: string) => Promise<void>;
  closeworld: () => Promise<void>;
  openworld: () => Promise<void>;

  // * showOutput
  keyBuff: string; // extern char key_buff[];
  keyInput: (value: string, maxLength: number) => Promise<void>; // key_input

  myLev: number; // extern long my_lev;
  // * getPrompt

  player: PlayerInterface;
  // * getPrompt
  // * showOutput
  getPlayer: (playerId: number) => Promise<PlayerInterface | null>;
  // * nadj
}

const getPrompt = (options: MessageOptions) => {
  const {
    debugMode,
    myLev,

    player,
  } = options;

  let result = '';

  if (debugMode) {
    result += '#';
  }

  if (myLev > 9) {
    result += '----';
  }
  
  result += getBasePrompt();
  
  return player.visibility
    ? `(${result})`
    : result;
};

const onBeforePrompt = async (name: string, options: MessageOptions) => {
  const {
    player,
  } = options;

  const messagesBefore: string[] = await getFromBuffer();
      
  const prompt = getPrompt(options);

  const messagesAfter: string[] = await getFromBuffer();
  
  let title = '';
  if (player.visibility > 9999) {
    title = '-csh';
  } else if (player.visibility === 0) {
    title = `   --}----- ABERMUD -----{--     Playing as ${name}`;
  }

  return {
    messages: [
      ...messagesBefore,
      ...messagesAfter,
    ],
    prompt,
    title,
  };
};

const showOutput = (name: string, options: MessageOptions) => withTty(async () => {
  const {
    keyBuff,
    //
    keyInput,
  } = options;
  const {
    // messages,
    prompt,
    // title,
  } = await onBeforePrompt(name, options);

  await withAlarm(() => keyInput(prompt, 80));

  return keyBuff;
});

const beforeConversion = (name: string, options: MessageOptions) => async () => {
  const {
    closeworld,
    openworld,
    rte,
  } = options;

  const work = await showOutput(name, options);
      
  appendMessageBuffer(`[l]${work}\n[/l]`);

  await openworld();
  await rte(name);
  await closeworld();

  return work;
};

const afterConversion = (name: string, options: MessageOptions) => async (work: string) => {
  const {
    curch,
    curmode,
    //
    gamecom,
    special,
  } = options;

  const isQuit = (work.toLowerCase() === '.q');
  if (curmode === 1) {
    await gamecom(work);
  } else if (isQuit && !work) {
    await special(work, name);
  }

  checkFighting(curch);

  return isQuit;
};

const sendMessage = async (name: string, options: MessageOptions) => withConversion(
  beforeConversion(name, options),
  afterConversion(name, options),
);