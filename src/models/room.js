import mongoose from 'mongoose';

const exitsSchema = mongoose.Schema({
    north: Number,
    east: Number,
    west: Number,
    south: Number,
    up: Number,
    down: Number,
});
const roomSchema = mongoose.Schema({
    roomId: { type: Number, index: true, unique: true },
    exits: exitsSchema,
    name: String,
    description: String,
});

export default mongoose.model('Room', roomSchema);
