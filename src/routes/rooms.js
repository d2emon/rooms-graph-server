'use strict';
import express from 'express';
import Room from '../models/room';
const router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
    Room.find().select({"roomId": 1})
        .then(response => res.json({rooms: response}))
        .catch(error => res.status(500).json({error: error}));
});

router.get('/:roomId', (req, res) => {
    const roomId = req.params.roomId;
    console.log(roomId);
    Room.findOne({roomId: roomId})
        .then(response => res.json({room: response}))
        .catch(error => res.status(500).json({error: error}));
});

router.post('/', (req, res) => {
    new Room(req.body).save()
        .then(response => res.json({room: response}))
        .catch(error => res.status(500).json({error: error}));
});

router.put('/:room_id', (req, res) => {
    const room_id = req.params.room_id;
    let result;
    Room.updateOne({room_id: room_id}, req.query)
        .then(response => {
            result = response;
            return Room.find({slug: slug});
        })
        .then(response => res.json({room: response, result: result}))
        .catch(error => res.status(500).json({error: error}));
});

router.delete('/:room_id', (req, res) => {
    const room_id = req.params.room_id;
    Room.deleteOne({room_id: room_id})
        .then(response => res.json({result: response}))
        .catch(error => res.status(500).json({error: error}));
});

module.exports = router;
