import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";


const app = express();
const port = 3000;

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));
 
mongoose.connect("mongodb+srv://admin-elli:test123@cluster93114.vqucwpk.mongodb.net/todolistDB");

const itemSchema = {
    name: String
};

const Item = mongoose.model("item", itemSchema);

const example1 = new Item({
    name: "example 1"
});

const example2 = new Item({
    name: "example 2"
});

const example3 = new Item({
    name: "example 3"
});

const defaultArray = [example1, example2, example3];

const listSchema = {
    name: String,
    items: [itemSchema]
};

const List = mongoose.model("list", listSchema);



app.get("/", async (req, res) => {

    const foundItems = await Item.find({}).exec();

    if (foundItems.length === 0) {
        Item.insertMany(defaultArray);
        res.redirect("/");
    } else {
        res.render("index", {
            listTitle: "Today",
            ttasks: foundItems
        });
    }

    
});

app.post("/", async (req, res) => {
    const itemName = req.body.task;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        const foundList = await List.findOne({name: listName}).exec();
        console.log(foundList);
        foundList.items.push(item);
        foundList.save();
        res.redirect("/" + listName);
    }
});

app.post("/delete", async (req, res) => {
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;
    if (listName === "Today") {
      await Item.findByIdAndRemove(checkedItemId).exec();
      res.redirect("/");
    } else {
      await List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).exec();
      res.redirect("/" + listName);
    }
    
  });

  app.get("/:param", async (req, res) => {
    const paramName = _.capitalize(req.params["param"]);
    // console.log(paramName);
  
    const foundList = await List.findOne({name: paramName}).exec();
    
    if (foundList) {
      // show existing list
      res.render("index", {listTitle: foundList.name, ttasks: foundList.items});
    } else {
      // create new list
      const list = new List({
        name: paramName,
        items: defaultArray
      });
      list.save();
      res.redirect("/" + paramName);
    }
  });

app.listen(process.env.PORT, () => {
    console.log(`Server running successfully`);
});