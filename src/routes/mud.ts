import axios from 'axios';
import { Router } from 'express';
import {
    links,
    setTimer,
    showMessages,
    showPrompt,
    start,
    stop,
    timerIsActive,
} from '../mud';

const router = Router();

const makeResponse = (data: any, errorCode?: number) => ({
    ...data,
    errorCode,
    links: links(),
});
const finish = (message: string, data: any) => makeResponse(
    {
        ...data,
        userMessages: showMessages(),
        prompt: false,
        message,
    },
    0,
);

router.get('/', (req, res) => {
    const {
        userId,
    } = req.query;
    return axios.get('http://127.0.0.1:3000/mud/user', {
        params: {
            userId,
        }
    })
        .then(response => response.data)
        .then(data => data.user)
        .then((user) => {
            if (!user.name) {
                throw new Error('Args!');
            }
            return {
                userId: user.userId,
                name: (user.name === 'D2emon') ? `The ${user.name}` : user.name,
            };
        })
        .then(user => Promise.all([
            user,
            axios.post('http://127.0.0.1:3000/mud/sys-log', {
                message: `ENTRY: ${user.name}[${user.userId}]`,
            })
        ]))
        .then(([user]) => res.json(makeResponse(
            {
                user,
                result: start(user),
            },
        )))
        .catch(error => res.json(makeResponse(
            {
                error,
            },
            0,
        )));
});

router.get('/events/error', (req, res) => {
    setTimer(false);
    return res.json(makeResponse(
        { result: stop() },
        255,
    ));
});

router.get('/events/exit', (req, res) => {
    const {
        canExit,
    } = req.query;
    if (!canExit) {
        return res.json(makeResponse(
            {
                result: false,
            }
        ));
    }
    setTimer(false);
    return res.json(finish(
        'Bye',
        { result: stop() },
    ));
});

router.get('/events/time', (req, res) => {
    const {
        name,
    } = req.query;
    if (!timerIsActive()) {
        return res.json(makeResponse(
            {
                result: false,
            }
        ));
    }
    setTimer(false);
    const result = [
        ['LOAD'],
        ['EVENTS', name, {
            interrupt: true
        }],
        ['ON TIME'],
        ['SAVE'],
    ];
    const prompt = showPrompt();
    setTimer(true);
    return res.json(makeResponse(
        {
            result,
            ...prompt,
        }
    ));
});

router.get('/user', (req, res) => {
    const {
        userId,
    } = req.query;
    if (!userId) {
        return res.json({
            errorCode: 0,
            error: 'No user'
        })
    }
    return res.json({
        user: {
            userId,
            name: 'D2emon',
        },
    });
});

router.post('/sys-log', (req, res) => {
    const { message } = req.body;
    return res.json({
        result: true,
        message,
    });
});

export default router;
