import withConversion, { getBasePrompt } from './helpers/conversationMode';
import { appendMessageBuffer } from './helpers/messageBuffer';
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
  inFight: number; // extern long in_fight;
  fighting: number; // extern long fighting;
  gamecom: (action: string) => Promise<void>;
  special: (action: string, name: string) => Promise<number>;

  // * sendMessage
  rte: (name: string) => Promise<void>;
  closeworld: () => Promise<void>;
  openworld: () => Promise<void>;

  // * showOutput
  keyBuff: string; // extern char key_buff[];
  keyInput: (value: string, maxLength: number) => Promise<void>; // key_input
  setProgname: (id: number, value: string) => Promise<void>; // set_progname
  sigAlon: () => Promise<void>; // sig_alon
  sigAloff: () => Promise<void>; // sig_aloff

  myLev: number; // extern long my_lev;
  // * getPrompt

  pbfr: () => Promise<void>;
  // * showOutput
  // * sendMessage

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
    pbfr,
    setProgname,
    //
    player,
  } = options;
        
  const prmpt = getPrompt(options);
    
  await pbfr();
    
  if (player.visibility > 9999) {
    await setProgname(0, '-csh');
  } else if (player.visibility === 0) {
    await setProgname(0, `   --}----- ABERMUD -----{--     Playing as ${name}`);
  }

  return prmpt;
};

const onAfterPrompt = async (name: string, options: MessageOptions) => {
  const {
    keyBuff,
  } = options;
        
  appendMessageBuffer(`[l]${keyBuff}\n[/l]`);
  return keyBuff;
};

const showOutput = (name: string, options: MessageOptions) => withTty(async () => {
  const {
    keyInput,
    sigAloff,
    sigAlon,
  } = options;
  const prmpt = await onBeforePrompt(name, options);
  await sigAlon();
  keyInput(prmpt, 80);
  await sigAloff();
  return onAfterPrompt(name, options);
});

const beforeConversion = (name: string, options: MessageOptions) => async () => {
  const {
    closeworld,
    openworld,
    pbfr,
    rte,
  } = options;

  await pbfr();
      
  const work = showOutput(name, options);
      
  await openworld();
  await rte(name);
  await closeworld();

  return work;
};

const afterConversion = (name: string, options: MessageOptions) => async (work: string) => {
  const {
    curch,
    curmode,
    fighting,
    inFight,
    //
    gamecom,
    special,
    //
    getPlayer,
  } = options;

  let newInFight: number;
  let newFighting: number;
  
  let a: number;
  if (curmode === 1) {
    await gamecom(work);
  } else {
    if ((work.toLowerCase() === '.q') && !work) {
      a = await special(work, name);
    }
  }

  if (fighting > -1) {
    const fightingPlayer = await getPlayer(fighting);
    if (!fightingPlayer) {
      newInFight = 0;
      newFighting = -1;
    }

    if (fightingPlayer?.channel !== curch) {
      newInFight = 0;
      newFighting = -1;
    }
  }

  if (inFight) {
    newInFight -= 1;
  }

  return work.toLowerCase() === '.q';
};

const sendMessage = async (name: string, options: MessageOptions) => withConversion(
  beforeConversion(name, options),
  afterConversion(name, options),
);
