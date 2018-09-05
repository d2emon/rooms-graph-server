import mongoose from 'mongoose';
import Zone from './zone';

const exitsSchema = mongoose.Schema({
    north: { type: Number, default: 0 },
    east: { type: Number, default: 0 },
    west: { type: Number, default: 0 },
    south: { type: Number, default: 0 },
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 },
});

const roomSchema = mongoose.Schema({
    roomId: { type: Number, index: true, unique: true, required: true },
    exits: exitsSchema,
    name: String,
    description: { type: String, default: "" },
    death: Boolean,
    nobr: Boolean,
    zone: { type: mongoose.Schema.ObjectId, ref: 'Zone' },
    dark: false,
});

export default mongoose.model('Room', roomSchema);
