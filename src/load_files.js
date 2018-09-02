#!/usr/bin/env babel-node
'use strict';
import db from './db/mongo';
import Room from './models/room';
import fs from 'fs';
import path from 'path';

const exitNames = [
    "north",
    "east",
    "south",
    "west",
    "up",
    "down",
];

const loadRoom = (roomId) => new Promise((resolve, reject) => {
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
            const room = new Room({
                roomId: roomId,
                exits: {},
            });
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
        } catch (e) {
            reject(e);
        }
    });
});

const saveRoom = (room) => {
    room.save()
        .then(response => {
           console.log(response);
           console.log(`Room ${room.roomId} saved.`);
        });
};

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('MongoDB connected');
    for (let i = 0; i < 1500; i++) {
        loadRoom(i)
            .then(response => saveRoom(response))
            .catch(err => {
                console.log("ERROR with ", i);
                console.error(err);
            });
    }
});
