interface TerminalData {
  tty: number; // tty
}
  
const data: TerminalData = {
  tty: 0,
};
  
export const getTty = () => data.tty;
export const setTty = (tty: number) => {
  data.tty = tty;
};

const topScreen = () => Promise.resolve(); // topscr
const bottomScreen = () => Promise.resolve(); // btmscr

const withTty = async (
  onAfterScreen: () => Promise<string>,
): Promise<string> => {
  if (getTty() !== 4) {
    return onAfterScreen();
  }

  await bottomScreen();
  const result = await onAfterScreen();
  await topScreen();
  return result;
};
  
export default withTty;
  