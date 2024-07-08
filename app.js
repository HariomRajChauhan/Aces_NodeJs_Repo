const express = require("express");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const app = express();

connectToDb();


app.use(express.json());


// yo lai use gareko vane express le json data lai parse garxa ani req.body ma halxa
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));


app.get("/about",(req,res)=>{
    const name = "Hariom";
    res.render("about.ejs",{name});
}
)


app.get("/contact",(req,res)=>{
    const address = "Aces workshop";

    res.render("contact.ejs",{address});
})

app.get("/createblog",(req,res)=>{
    res.render("./blog/createBlog.ejs");
})


app.post("/createblog",async (req,res)=>{
    // console.log(req.body);
    // const title = req.body.title;
    // const description = req.body.description;
    // const subtitle = req.body.subtitle;


    const {title,description,subtitle} = req.body;

    console.log(title,description,subtitle);

    await Blog.create({
        title,
        description,
        subtitle,
    })
    console.log("Blog created successfully");
    res.redirect("/createblog");
})



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})