import express, {Router} from "express";
import Post from "../models/Post.js";


const router = express.Router();

router.get('', async (req, res) => {
    try{
        let perPage: number = 3;
        let pg: number = Number(req.query.page) || 0;
        const posts = await Post.find()
        .sort({ createdAt: -1, _id: -1 })
        .skip(pg * perPage)
        .limit(perPage)

        let count: number  = await Post.countDocuments()
        let nextPage: number = pg+1;
        let hasNextPage = nextPage < Math.ceil(count/perPage);

        res.render("index", {posts: posts, nextPage: hasNextPage ? nextPage : null });
    } catch (err) {
        console.log(err);
    }
})


router.get('/:id', async (req, res) => {

    try{
        const id = req.params.id;
        let post = await Post.findById(id);
        res.render("details", {post: post});
    } catch (err) {
        console.log(err);
    }


})


router.post("/search", async (req, res) => {
    try{
        let searchTerm = req.body.searchTerm;
        const noSpecialCharacters = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const data = await Post.find({
            $or: [
                { title: { $regex : new RegExp(noSpecialCharacters, "i")} },
                { body: {$regex : new RegExp(noSpecialCharacters, "i")} }
            ]
        })

        res.render("search", {posts:data});
        //console.log(data, noSpecialCharacters);
    } catch (err){
        console.log(err);
    } 
})


router.get('/about', (req, res) => {
    res.render('about');
});




export default router;