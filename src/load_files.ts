import db from './db/mongo';
import Room, { RoomInterface, ExitId } from './models/Room';
import Zone, {ZoneInterface} from './models/Zone';
import fs from 'fs';
import path from 'path';

const exitNames: ExitId[] = [
    "north",
    "east",
    "south",
    "west",
    "up",
    "down",
];

const zones = [
    {name: "TCHAN", startRoomId: -1},
    {name: "LIMBO", startRoomId: 1},
    {name: "WSTORE", startRoomId: 2},
    {name: "HOME", startRoomId: 4},
    {name: "START", startRoomId: 5},
    {name: "PIT", startRoomId: 6},
    {name: "WIZROOM", startRoomId: 19},
    {name: "DEAD", startRoomId: 99},
    {name: "BLIZZARD", startRoomId: 299},
    {name: "CAVE", startRoomId: 399},
    {name: "LABRNTH", startRoomId: 499},
    {name: "FOREST", startRoomId: 599},
    {name: "VALLEY", startRoomId: 699},
    {name: "MOOR", startRoomId: 799},
    {name: "ISLAND", startRoomId: 899},
    {name: "SEA", startRoomId: 999},
    {name: "RIVER", startRoomId: 1049},
    {name: "CASTLE", startRoomId: 1069},
    {name: "TOWER", startRoomId: 1099},
    {name: "HUT", startRoomId: 1101},
    {name: "TREEHOUSE", startRoomId: 1105},
    {name: "QUARRY", startRoomId: 2199},
    {name: "LEDGE", startRoomId: 2299},
    {name: "INTREE", startRoomId: 2499},
    {name: "WASTE", startRoomId: 99999},
];

function loadZones (): void {
    zones.forEach(z => {
        const zone = new Zone(z);
        zone.save();
    })
}

function isDark (roomId: number): boolean {
    if ((roomId === 1100) || (roomId === 1101)) return false;
    if ((roomId >= 1113) && (roomId <= 1123)) return true;
    return !((roomId > 399) || (roomId < 300));
}

const zone = (roomId: string) => {
    console.log("roomId = ", parseInt(roomId));
    if (!roomId) {
        console.log("ERROR");
        return;
    }
    return Zone.findOne({startRoomId: {"$gte": roomId}}).sort('startRoomId');
};

const loadRoom = (roomId: number): Promise<RoomInterface> => new Promise((resolve, reject) => {
    const roomsPath = path.join(__dirname, "..", "data", "files");
    const fileName = path.join(roomsPath, '' + roomId);
    fs.readFile(fileName, (err, data) => {
        try {
            if (err) throw err;
            console.log(fileName);
            /*
            let room = {
                roomId: roomId,
                exits: {},
                text: '',
                death: false,
                nobr: false,
            };
            */
            zone(`${roomId}`)
                .then(z => {
                    console.log(z);
                    const room: RoomInterface = new Room({
                        roomId,
                        exits: {},
                        zone: z,
                        dark: isDark(roomId),
                    }) as RoomInterface;
                    const contents = data.toString();
                    const strings = contents.split("\n");
                    strings.forEach((s, id) => {
                        if (id < exitNames.length) {
                            let exitId = parseInt(s);
                            if (exitId > 1000) exitId = 1000 - exitId;
                            else exitId = -exitId;

                            room.exits[exitNames[id]] = exitId;
                        } else if (id === exitNames.length) {
                            room.name = s;
                        } else {
                            if (s === "#DIE") room.death = true;
                            else if (s === "#NOBR") room.nobr = true;
                            else room.description += s + "\n";
                        }
                    });
                    resolve(room);
                });
        } catch (e) {
            reject(e);
        }
    });
});

const saveRoom = (room: RoomInterface) => {
    room.save()
        .then(response => {
           console.log(response);
           console.log(`Room ${room.roomId} saved.`);
        });
};

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('MongoDB connected');
    loadZones();
    for (let i = 0; i < 1500; i++) {
        loadRoom(i)
            .then((response: RoomInterface) => saveRoom(response))
            .catch(err => {
                console.log("ERROR with ", i);
                console.error(err);
            });
    }
});
