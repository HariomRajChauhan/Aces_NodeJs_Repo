const express = require("express");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const { storage, multer } = require("./middleware/multerConfig");
const app = express();

connectToDb();


app.use(express.json());

const upload = multer({storage:storage})

// yo lai use gareko vane express le json data lai parse garxa ani req.body ma halxa
app.set("view engine","ejs");
app.use(express.urlencoded({extended:true}));


app.get("/about",(req,res)=>{
    const name = "Hariom";
    res.render("about.ejs",{name});
}
)

app.get("/",async (req,res)=>{
    const blogs = await Blog.find();
    console.log(blogs);
    res.render("./blog/home.ejs",{blogs});
})


app.get("/blog/:id",async (req,res)=>{
    const id = req.params.id;
    const blog = await Blog.findById(id);
    res.render("./blog/blogs.ejs",{blog});
})


app.get("/delete/:id",async (req,res)=>{
    const id = req.params.id;
    await Blog.findByIdAndDelete(id);
    res.redirect("/");
})

// Route to display the edit form with the current blog data
app.get("/edit/:id", async (req, res) => {
    const id = req.params.id;
    // Correctly fetch the blog post to edit
    const blog = await Blog.findById(id);
    // Render the edit form and pass the current blog data
    res.render("./blog/edit.ejs", { blog }); // Assuming the edit form is at "./blog/edit.ejs"
});

// Route to handle the submission of the edit form
app.post("/edit/:id", upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const { title, description, subtitle } = req.body;
    let updateData = {
        title,
        description,
        subtitle,
    };

    // If a new file is uploaded, add it to the update data
    if (req.file) {
        const file = req.file.filename;
        updateData.image = file;
    }

    // Update the blog post with the new data
    await Blog.findByIdAndUpdate(id, updateData);
    // Redirect to the homepage or to the updated blog post
    res.redirect("/");
});



app.get("/contact",(req,res)=>{
    const address = "Aces workshop";

    res.render("contact.ejs",{address});
})

app.get("/createblog",(req,res)=>{
    res.render("./blog/createBlog.ejs");
})


app.post("/createblog",upload.single('image'),async (req,res)=>{
    // console.log(req.body);
    // const title = req.body.title;
    // const description = req.body.description;
    // const subtitle = req.body.subtitle;


    const {title,description,subtitle} = req.body;
    const file = req.file.filename;
    console.log(file);

    console.log(title,description,subtitle);


    await Blog.create({
        title,
        description,
        subtitle,
        image : file,
    })
    console.log("Blog created successfully");
    res.redirect("/createblog");
})

app.use(express.static("./storage"))

app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})