interface FightingData {
  inFight: number; // extern long in_fight;
  fighting: number; // extern long fighting;
}
  
const data: FightingData = {
  inFight: 0,
  fighting: 0,
};

const getPlayer = (playerId: number) => Promise.resolve(null);

export const stopFighting = () => {
  data.inFight = 0;
  data.fighting = -1;
};
export const updateFighting = () => {
  if (data.inFight) {
    data.inFight -= 1;
  }
};
export const checkFighting = async (channelId: number) => {
  if (data.fighting > -1) {
    const fightingPlayer = await getPlayer(data.fighting);
    if (!fightingPlayer) {
      stopFighting();
    }
    
    if (fightingPlayer?.channel !== channelId) {
      stopFighting();
    }
  }
    
  updateFighting();
};
  