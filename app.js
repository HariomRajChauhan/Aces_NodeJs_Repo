const express = require("express");

const app = express();

app.set("view engine","ejs");


app.get("/about",(req,res)=>{
    const name = "Hariom";
    res.render("about.ejs",{name});
}
)


app.get("/contact",(req,res)=>{
    const address = "Aces workshop";

    res.render("contact.ejs",{address});
})





app.listen(3000,()=>{
    console.log("Server is running on port 3000");
})