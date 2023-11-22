const sigAlOn = () => Promise.resolve(); // sig_alon
const sigAlOff = () => Promise.resolve(); // sig_aloff
  
const withAlarm = async (
  action: () => Promise<void>,
): Promise<void> => {
  await sigAlOn();
  await action();
  await sigAlOff();
};
    
export default withAlarm;
    