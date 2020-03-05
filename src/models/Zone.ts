import mongoose, {
    Schema,
    Document,
} from 'mongoose';

export interface ZoneInterface extends Document {
    startRoomId?: number,
    name: string,
}

const zoneSchema: Schema = new mongoose.Schema({
    startRoomId: { type: Number, index: true, unique: true },
    name: String,
});

export default mongoose.model('Zone', zoneSchema);
