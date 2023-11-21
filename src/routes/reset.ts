import axios from 'axios';
import { Router } from 'express';
import config from '../config';
import Room, { RoomInterface } from '../models/Room';
import Zone, { ZoneInterface } from '../models/Zone';

const router = Router();

const injectZones = (zones: ZoneInterface[]) => Promise.all(zones.map((data) => {
  const zone = new Zone(data);
  console.log(zone);
  return zone.save();
}))
  .then((result) => {
    console.log(result);
  });

const injectRooms = (rooms: RoomInterface[]) => Promise.all(rooms.map((data) => {
  const name = data && data.zone && data.zone.name;
  return Zone
    .findOne({ name })
    .then((zone: ZoneInterface) => {
      data.zone = zone;
      const room = new Room(data);
      console.log(room);
      return room.save();
    });
}))
  .then((result) => {
    console.log(result);
  });

router.get('/', (req, res) => axios.get('http://127.0.0.1:3000/reset/clear')
  .then(() => axios.get(config.dataServer))
  .then((response) => {
    const {
      data,
    } = response;
    const {
      zones,
      rooms,
    } = data;
    console.log(rooms);
    return injectZones(zones)
      .then(() => injectRooms(rooms))
      .then(() => {
        res.json({ data });
      });
  }),
);

router.get('/clear', (req, res) => {
  return Zone
    .deleteMany({})
    .then((result: any) => res.json({ result }));
});

export default router;
