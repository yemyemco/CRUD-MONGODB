const express = require("express");
const server = express();
const PORT = process.env.PORT||5500;
server.use(express.json());

const mongoose = require("mongoose");
const importDB = require("./appDB");
const db_URL = "mongodb+srv://yemyemcogroup:solution@cluster0.j7tkoox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(db_URL).then(()=>
{
    console.log("Database connected successfully");
});

//Welcome message
server.get("/home", (req, res)=>
{
    res.json({Message: "Welcome to the Items Recovery System"});
});

//API for logging found items into database
server.post("/found-item", async (req, res)=>
{
    const {itemName, description, locationFound, dateFound, claimed} = req.body;
    if(!itemName || !description || !locationFound || !dateFound || !claimed)
    {
        return res.status(400).json({
            Message: "Error! All fields are required"
        });
    }

    const receivedData = importDB({itemName, description, locationFound, dateFound, claimed});
    await receivedData.save();
    res.status(200).json({
        Message: "Recovered item saved successfully. See details below",
        Detail: receivedData
    })
});

//API for viewing all items in database
server.get("/all-items", async (req, res)=>
{
    const all_items = await importDB.find();
    res.status(200).json({
        Message: "Success: All items found:",
        Items: all_items
    })
});

//API for viewing unclaimed items
server.get("/unclaimed-items", async (req, res)=>
    {
        const unclaimedItems = await importDB.find({claimed: false});
        res.status(200).json({
            Message: "Success: All unclaimed items:",
            Items: unclaimedItems
        })
    });

//API for viewing one item at a time by id
server.post("/item-by-id", async (req, res)=>
{
    const id = req.body.id;
    const item = await importDB.findById(id);
    (item) ? res.status(200).json({Message: "Success: Item found", Item: item
    }) : res.status(r00).json({Message: "Error! Item not found"});
});

//API for updating items in the database
server.put("/update-item", async (req, res)=>
{
    const {id} = req.body;
    const {itemName, description, locationFound, dateFound, claimed} = req.body;
    if(!itemName || !description || !locationFound || !dateFound || !claimed)
    {
        return res.status(400).json({Message: "Error! All fields are required"});
    }

    const updatedItem = await importDB.findByIdAndUpdate(
    id,
    {itemName, description, locationFound, dateFound, claimed},
    {new: true});
    (updatedItem) ? res.status(200).json({Message: "Item updated successfully",
        Details: updatedItem}) :
        res.status(400).json({Message: "Error! Update failed. Item does not exist"});
});

//API for deleting items in the database
server.delete("/delete-item", async (req, res)=>
{
    const {id} = req.body;
    await importDB.findByIdAndDelete(id).then(deletedItem =>
    {(!deletedItem) ? 
        res.status(400).json({ Message: "Error! Item not found!"}) : 
        res.status(200).json({Message: "Item deleted successfully",deletedItem});
    })
    .catch(error =>
    {
        res.status(400).json({Message: "Error deleting item" + error});
    });
});


server.listen(PORT, ()=>
{
    console.log("Server started at " + PORT + "...[Press Ctrl+C to stop]");
});