import { Router } from 'express';
import Room, { RoomInterface, ExitId } from '../models/Room';
const router = Router();

const go = (room: RoomInterface, direction: ExitId) => {
    if (!room) throw new Error('No room found.');
    if (!direction) throw new Error('That\'s not a valid direction.');

    const newRoomId: number = room.exits[direction];
    // if (newRoomId <= 0) newRoomId = door(-newRoomId);
    if (newRoomId <= 0) throw new Error("You can't go that way");

    return Room.findOne({roomId: newRoomId})
        .populate('zone');
};

router.get('/', (req, res) => {
    Room.find()
        .select({ roomId: 1 })
        .then(rooms => res.json({ rooms }))
        .catch(error => res.status(500).json({ error }));
});

router.get('/:roomId/:direction', (req, res) => {
    const roomId: number = Number(req.params.roomId);
    const direction: ExitId = req.params.direction as ExitId;
    Room.findOne({ roomId })
        .populate('zone')
        .then((room: RoomInterface) => go(room, direction))
        .then(room => res.json({ room }))
        .catch(error => res.status(500).json({ error }));
});

router.get('/:roomId', (req, res) => {
    const roomId: number = Number(req.params.roomId);
    Room.findOne({ roomId })
        .populate('zone')
        .then(room => res.json({ room }))
        .catch(error => res.status(500).json({ error }));
});

router.post('/', (req, res) => {
    new Room(req.body).save()
        .then(room => res.json({ room }))
        .catch(error => res.status(500).json({ error }));
});

router.put('/:roomId', (req, res) => {
    const roomId: number = Number(req.params.roomId);
    let result: any;
    Room.updateOne({ roomId }, req.query)
        .then(response => {
            result = response;
            return Room.find({ roomId })
                .populate('zone');
        })
        .then(room => res.json({ room, result }))
        .catch(error => res.status(500).json({ error }));
});

router.delete('/:roomId', (req, res) => {
    const roomId: number = Number(req.params.roomId);
    Room.deleteOne({ roomId })
        .then(result => res.json({ result }))
        .catch(error => res.status(500).json({ error }));
});

module.exports = router;
