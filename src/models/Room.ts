import mongoose, {
    Schema,
    Document,
} from 'mongoose';
import Zone, { ZoneInterface } from './Zone';

export type ExitId = 'north' | 'east' | 'south' | 'west' | 'up' | 'down';

export interface ExitsInterface extends Document {
    north: number,
    east: number,
    south: number,
    west: number,
    up: number,
    down: number,
}

export interface RoomInterface extends Document {
    roomId: number,
    exits: ExitsInterface,
    name: string,
    description: string,
    death: boolean,
    nobr: boolean,
    zone: ZoneInterface,
    dark: boolean,
}

const exitsSchema: Schema = new mongoose.Schema({
    north: { type: Number, default: 0 },
    east: { type: Number, default: 0 },
    west: { type: Number, default: 0 },
    south: { type: Number, default: 0 },
    up: { type: Number, default: 0 },
    down: { type: Number, default: 0 },
});

const roomSchema: Schema = new mongoose.Schema({
    roomId: { type: Number, index: true, unique: true, required: true },
    exits: exitsSchema,
    name: String,
    description: { type: String, default: "" },
    death: Boolean,
    nobr: Boolean,
    zone: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone' },
    dark: { type: Boolean, default: false },
});

export default mongoose.model('Room', roomSchema);
