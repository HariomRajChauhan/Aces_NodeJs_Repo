const express = require("express");
const bcrypt = require("bcrypt");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const { storage, multer } = require("./middleware/multerConfig");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");

const app = express();

// User model lai call gareko

const User = require("./model/userModel");

// Database connection
connectToDb();


app.use(express.json());
app.use(cookieParser());

app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2'], // These are the keys used to sign and verify the cookie values. Use complex, unique keys for production.
    maxAge: 24 * 60 * 60 * 1000 // 24 hours cookie expiration
}));


// multer ko storage lai use gareko

const upload = multer({ storage: storage })

// yo lai use gareko vane express le json data lai parse garxa ani req.body ma halxa
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get('/set-cookie', (req, res) => {
    // Setting a session value
    req.session.userId = '12345';
    res.send('Encrypted user ID has been set in a session cookie');
});

app.get('/get-cookie', (req, res) => {
    // Accessing a session value
    const userId = req.session.userId;
    res.send(`Encrypted User ID from session cookie: ${userId}`);
});


app.get('/clear-cookie', (req, res) => {
    // Clearing all session data
    req.session = null;
    res.send('Session (and encrypted cookie) cleared');
  });



app.get("/home", (req, res) => {
    res.render("home.ejs");
})

app.get("/about", (req, res) => {
    const name = "Hariom";
    res.render("about.ejs", { name });
}
)

app.get("/", async (req, res) => {
    const blogs = await Blog.find();
    console.log(blogs);
    res.render("./blog/home.ejs", { blogs });
})


app.get("/blog/:id", async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    res.render("./blog/blogs.ejs", { blog });
})


app.get("/delete/:id", async (req, res) => {
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
    res.redirect("/blog/" + id);
});



app.get("/contact", (req, res) => {
    const address = "Aces workshop";

    res.render("contact.ejs", { address });
})

app.get("/createblog", (req, res) => {
    res.render("./blog/createBlog.ejs");
})


app.post("/createblog", upload.single('image'), async (req, res) => {
    // console.log(req.body);
    // const title = req.body.title;
    // const description = req.body.description;
    // const subtitle = req.body.subtitle;


    const { title, description, subtitle } = req.body;
    const file = req.file.filename;
    console.log(file);

    console.log(title, description, subtitle);


    await Blog.create({
        title,
        description,
        subtitle,
        image: file,
    })
    console.log("Blog created successfully");
    res.redirect("/createblog");
})


// User ko route haru

app.get("/register", (req, res) => {
    res.render("./blog/register.ejs");
})

app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    await User.create({
        username,
        email,
        password: await bcrypt.hashSync(password, 12),
    })
    res.redirect("/login");
})

app.get("/login", (req, res) => {
    res.render("./blog/login.ejs");
})

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        res.send("invalid email");
    }
    else {
        // password match garne
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.send("invalid password");

        }
        else {
            // res.send("Login success");
            res.redirect("/");
        }
    }
})





app.use(express.static("./storage"))

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})