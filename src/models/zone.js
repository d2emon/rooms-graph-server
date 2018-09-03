import mongoose from 'mongoose';

const zoneSchema = mongoose.Schema({
    startRoomId: { type: Number, index: true, unique: true, required: true },
    name: String,
});

export default mongoose.model('Zone', zoneSchema);
