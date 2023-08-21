import express from "express";
import bodyParser from "body-parser";


const app = express();
const port = 3000;

let todayTasks = [];
let workTasks = [];

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
 


app.get("/", (req, res) => {
    res.render("index.ejs", {
        ttasks: todayTasks
    })
});


app.get("/work", (req, res) => {
    res.render("work.ejs", {
        wtasks: workTasks
    })
});


app.post("/", (req, res) => {
    let input = req.body["task"];
    todayTasks.push(input);
    res.render("index.ejs", { ttasks: todayTasks}); 
});

app.post("/work", (req, res) => {
    let input = req.body["task"];
    workTasks.push(input);
    res.render("work.ejs", {wtasks: workTasks}); 
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});