import mongoose from "mongoose";

const audioSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true

    },
    url: { type: String, require: true },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});
const Audio = mongoose.model("Audio", audioSchema)
export default Audio;