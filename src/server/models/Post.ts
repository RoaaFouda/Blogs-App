import {Schema, model} from "mongoose";

interface Ipost{
    title:String,
    body: String,
    createdAt: Date,
    updatedAt: Date
}

const postSchema  = new Schema<Ipost>(
 {
    title:{
    type: String,
    required: true
    },

    body: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now()
    },

    updatedAt: {
        type: Date,
        default: Date.now()
    }
 }
)

const Post = model<Ipost>("Post", postSchema);
export default Post;