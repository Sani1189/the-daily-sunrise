import mongoose, { Schema } from "mongoose";

const newsSchema = new Schema({
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    published_date: {
        type: Date,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    image_url: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        required: true,
    },
});

const News = mongoose.models?.News || mongoose.model("News", newsSchema);
export default News;
