const timer = {
    active: false,
    time: 0,
    isOn: false,
};
export const links = () => ({
    onClose: 'http://127.0.0.1:3000/mud/events/error',
    onExit: 'http://127.0.0.1:3000/mud/events/exit',
    onTerminate: 'http://127.0.0.1:3000/mud/events/exit',
    onStop: '',
    onQuit: '',
    onContinue: 'http://127.0.0.1:3000/mud/events/error',
    onTimer: timer.isOn && 'http://127.0.0.1:3000/mud/events/timer',
    timer,
});
export const timerIsActive = () => timer.active;

export const setTimer = (value: boolean) => {
    timer.active = value;
    timer.isOn = value;
    timer.time = value ? 2 : null;
};
export const setBlock = (value: boolean) => {
    timer.isOn = !value;
    if (!value && timer.active) {
        timer.time = 2;
    }
};

export const showMessages = () => [
    '',
];

export const showPrompt = () => {
    // needLineBreak = true;
    const userMessages = showMessages();
    // const promptMessage = (!mode && prompt) && `${promptText}${inputText}`;
    const promptMessage = '';
    return {
        userMessages,
        promptMessage,
        prompt: false,

    };
};

export const start = (user: any) => {
    // let inSystem = false;
    const result = [];
    result.push(['CREATE MESSAGES']);
    // let eventID = null;
    result.push(['LOG IN']);

    result.push(['LOAD']);
    /*
    if (!loaded) {
        return finish('Sorry system is currently unavailable');
    }
    if (userId >= MAX_USER_ID) {
        return {
            error: 'Sorry system is full at the moment',
            errorCode: 0,
        };
    }
     */
    result.push(['EVENTS', user]);
    result.push(['SAVE']);

    // let eventID = null;
    result.push(['SPECIAL', 'START', user]);
    // let inSystem = true;
    return {
        user,
        result,
    };
};

export const nextTurn = (user: any) => {
    const result = [];
    result.push(['SHOW MESSAGES']);
    result.push(['GET INPUT', user]);
    /*
    if (needEvents) {
        result.push(['EVENTS', user]);
        needEvents = false;
    }
     */
    result.push(['SAVE']);
    result.push(['SHOW MESSAGES']);
    return {
        user,
        result,
    };
};

export const stop = () => {
    const result = [];
    setTimer(false);
    // let inSystem = false;
    result.push(['LOAD']);
    result.push(['DROP ITEMS']);
    /*
    if (user[userId].visibility < INVISIBLE) {
        sendEvent(
            name,
            name,
            ADMIN_MESSAGE,
            null,
            `${name} has departed`,
        )
    }
    user[userId] = null;
     */
    result.push(['SAVE']);
    /*
    if (!banned) {
        result.push(['SAVE USER']);
    }
     */
    result.push(['DISCONNECT VIEWERS']);
    return {
        result,
    };
};

