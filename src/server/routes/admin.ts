import express, {Request, Response, Router, NextFunction} from "express";
import Post from "../models/Post.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import session, { Session } from "express-session";

const router = express.Router();
const adminLayout = '../views/layouts/admin';


// Extend the Request interface
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

interface CustomRequest extends Request {
  session: Session & { userId?: string }; // Extend session to include userId
}

const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
    // const token = req.cookies.token;
    // if(!token)
    //    return res.status(401).json({"message" : "Unauthotrized"})
    // try{
    // const decoded = jwt.verify(token, superSecretWord) as { userId: string };
    // req.userId = decoded.userId;
    // next();
    // } catch (err) {
    //     res.status(401).json( { message: 'Unauthorized'} );
    // }
    if(!req.session.userId){
      return res.status(401).json({"message" : "Unauthotrized"})
    }
    next();
  }


router.get('', async (req, res) => {
    try{
        res.render("admin/index", {layout: adminLayout });
    } catch (err) {
        console.log(err);
    }
})


router.post('/register', async (req, res) => {
    try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      try {
        const user = await User.create({ username, password:hashedPassword });
        res.status(201).json({ message: 'User Created', user });
      } catch (error: any) {
        if(error.code === 11000) {
          res.status(409).json({ message: 'User already in use'});
        } else {
            res.status(500).json({ message: 'Internal server error'})
        }
      }
  
    } catch (error) {
      console.log(error);
    }
  });
  

router.post("/login",async (req: CustomRequest, res) => {
    try{
        let userData = req.body;
        let user = await User.findOne({username: userData.username});
        if(!user){
            return res.status(401).json({ message: "Invalid Credentials"})
        }

        const isPasswordValid = await bcrypt.compare(userData.password, user.password);

        if(!isPasswordValid)
            return res.status(401).json({message: "Invalid Credentials"});
        
        //const token = jwt.sign({userId: user._id}, superSecretWord);

        //res.cookie("token", token, { httpOnly: true });
        req.session.userId = user._id.toString();
        console.log(req.session);
        res.redirect("dashboard");

    } catch(error) {
        console.log(error);
    }

  })


  router.get("/dashboard" , authMiddleware, async (req, res) => {
    try{
        const posts = await Post.find()
        res.render("admin/dashboard", {posts, layout: adminLayout});
    } catch (err)
    {
        console.log(err);
    }
  })

  router.get("/add-post", authMiddleware,(req, res) => {
    try{
        res.render("admin/add", {layout: adminLayout});
    } catch (error) {
        console.log(error);
    }

  })

  router.post("/add-post", authMiddleware,async (req, res) => {
       try{
        const post = new Post(req.body);
        await post.save();
        res.redirect("/admin/dashboard");
       } catch(error) {
         console.log(error);
       }
  })

  router.put("/edit-post/:id", authMiddleware,async (req, res) => {
       try{
        await Post.findByIdAndUpdate(req.params.id, req.body);
        res.redirect("/admin/dashboard");
       } catch(error) {
         console.log(error);
       }
  })

  router.get("/edit-post/:id", authMiddleware,async (req, res) => {
       try{
        const post = await Post.findById(req.params.id);
        res.render("admin/edit", {post});
       } catch(error) {
         console.log(error);
       }
  })

  router.delete("/delete-post/:id", authMiddleware,async (req, res) => {
    try{
        await Post.findByIdAndDelete(req.params.id);
        res.redirect("/admin/dashboard");
       } catch(error) {
         console.log(error);
       }
})


router.get("/logout", (req, res) => {
  try{
    req.session.destroy((err) => {
      console.log(err);
    })
    res.json({message: "Logout Successful"});
  } catch (err) {
    console.log(err);
  }
})

export default router;