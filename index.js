const express = require("express");
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
const dotEnv = require("dotenv").config();
const app = express();
const URL =process.env.DATAB;

const DB ="management"
// middleware
app.use(express.json())

app.use(cors({
    origin:"http://localhost:3001"
}))
//Database
// put toArray for find
//Create a connection between mongodb and nodejs

//Create a db

//Select the collection

//Do the operation (CRUD)

//Close the connection

//if any error throw error
// Creating Mentor
app.post("/create-mentor",async function(req,res){

    //Connection

    try {
        const connection = await mongoClient.connect(URL);

const db = connection.db(DB);

await db.collection("mentor").insertOne(req.body);

await connection.close();

res.status(200).json({messege:"Data inserted"})
    } catch (error) {
        res.status(500).json({messege:"Something went wrong"})
    }

})

// To view mentor details

app.get("/mentordet",async function(req,res){
  try {
    const connection = await mongoClient.connect(URL);

  const db = connection.db(DB);

 let resOp =await db.collection("mentor").find().toArray();

 await connection.close();

 res.json(resOp);
  } catch (error) {
    res.status(500).json({messege:"something went wrong"})
  }
})

app.get("/mentor/:id",async function(req,res){
try {
    const connection = await mongoClient.connect(URL);
const db = connection.db(DB);

let mentor = await db.collection("mentor").findOne({_id:mongodb.ObjectId(req.params.id)})

await connection.close()

res.json(mentor)
} catch (error) {
    res.status(200).json({messege:"Something went wrong"})
}
})

// to create Students

app.post("/create-students", async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);

await db.collection("students").insertOne(req.body);

await connection.close();

res.json({messege:"Data inserted"})
    } catch (error) {
        res.status(500).json({messege:"Something went wrong"})
    }
})
// to assing mentors to students
app.put("/mentor-student/:mentid/:studid",async function(req,res){
    try {
        const connection = await mongoClient.connect(URL);

    const db =connection.db(DB);

    

  await  db.collection("students").findOneAndUpdate({_id:mongodb.ObjectId(req.params.studid)},{$set:{mentor_id:mongodb.ObjectId(req.params.mentid)}})

  await connection.close();

  res.json({messege:"Data inserted"})
    } catch (error) {
        res.json({messege:"Error occurred"})
    }
})


// to get students with no mentors
app.get("/nomentStudents", async function(req,res){
try {
    const connection = await mongoClient.connect(URL);
const db = connection.db(DB);

let data = await db.collection("students").find().toArray();

await connection.close();

let noMent =data.filter(val=>val.mentor_id === undefined)

res.json(noMent)
} catch (error) {
    res.status(500).json("Something went wrong")
}


})


// to assign students to mentors
// selecting one mentor and adding multiple students
app.put("/students-mentors/:mentid", async function(req,res){
    try {
        let studentId = req.body.students; // check 
    
        
    const connection = await mongoClient.connect(URL);

    const db = connection.db(DB);
//$addtoset was used not to duplicate data
await db.collection("mentor").updateOne({_id:mongodb.ObjectId(req.params.mentid)},{ $addToSet: {students_id:{$each:studentId}} }) 

    await connection.close();

    res.json({messege:"Students assigned"})
    } catch (error) {
        console.log(error)
        res.status(500).json("Something went wrong")
    }
})
// to find students under particular mentor
//give the id of the mentor as a paramenter 
app.get("/studentsofmentors/:mentid",async function(req,res){
try {
    const connection = await mongoClient.connect(URL);
const db = connection.db(DB);

let data = await db.collection("students").find({mentor_id:mongodb.ObjectId(req.params.mentid)}).toArray();


await connection.close();

res.json(data)
} catch (error) {
    res.status(500).json("Something went wrong")
}
})


app.listen(process.env.PORT || 3000)

