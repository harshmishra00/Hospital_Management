const express = require("express")
const dotenv = require("dotenv")
dotenv.config()
const patientModel = require("./models/patient.js")
const postModel=require('./models/posts.js')
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const appointmentModel = require("./models/appointment.js")
const fetch = require("node-fetch");
const axios = require("axios")
const mongoose = require("mongoose")


const API_KEY = process.env.API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));


const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser())
app.use(express.static("public"));


function isLoggedIn(req, res, next) {
    const token = req.cookies.token;

    if (!token) return res.send("You should be logged in first");

    jwt.verify(token, JWT_SECRET, function (err, decoded) {
        if (err) return res.send("Invalid token")

        req.user = decoded;
        next();
    })

}

app.get("/", (req, res) => {
    res.render("signup")
})

app.post("/signup", (req, res) => {
    let { name, email, password, gender, age } = req.body;

    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
            let createdPatient = await patientModel.create({
                name: name,
                email: email,
                password: hash,
                gender: gender,
                age: age,
            })
            res.redirect("/login")

        });
    });

})

app.get("/logout", (req, res) => {
    res.cookie("token", "");
    res.redirect("/login")
})

app.get("/patient", isLoggedIn, async (req, res) => {
    const patient = await patientModel.findOne({ email: req.user.email })
    const healthUrl = `https://newsapi.org/v2/top-headlines?category=health&apiKey=${API_KEY}`;


    const healthData = await axios.get(healthUrl)
    res.render("patient", { patientName: patient.name, healthArticles: healthData.data.articles })
})

app.get("/profile", isLoggedIn, async (req, res) => {
    const patient = await patientModel.findOne({ email: req.user.email }).populate("appointments");
    res.render("profile", {patient: patient})
})
app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", async (req, res) => {

    let patient = await patientModel.findOne({ email: req.body.email });
    if (!patient) res.send('Something went Wrong')

    bcrypt.compare(req.body.password, patient.password, function (err, result) {
        if (result) {
            let token = jwt.sign({ email: req.body.email }, JWT_SECRET);
            res.cookie("token", token)
            res.redirect("/patient")
        }
        else res.send("Something went wrong")
    });
})

app.post("/book-appointment", isLoggedIn, async (req, res) => {
    let { date, doctor, reason, time } = req.body;

    const patient = await patientModel.findOne({ email: req.user.email });

    const appointment = await appointmentModel.create({
        patient: patient._id,
        doctor,
        date,
        time,
        reason
    });

    patient.appointments.push(appointment._id);
    await patient.save();
    res.redirect("/appointments")


})

app.get("/appointments", isLoggedIn, async (req, res) => {
    const patient = await patientModel.findOne({ email: req.user.email }).populate("appointments");
    res.render("appointments", { patient: patient })
})

app.get("/create-post", isLoggedIn, (req,res)=>{
    res.render("createPost")
}
)

app.post("/create-post", isLoggedIn, async (req, res) => {
    let {description}=req.body;
    const patient = await patientModel.findOne({ email: req.user.email });

    const post= await postModel.create({
        patient: patient._id,
        description
    });

    patient.posts.push(post._id);
    await patient.save();
    res.redirect("/posts")

})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port", PORT);
});