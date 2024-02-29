import express from "express";
import { nanoid } from "nanoid";
import bodyParser from "body-parser";
import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";
import path from "path";

const urlModel = mongoose.model("urls", {
  shortUrl: { type: String },
  longUrl: { type: String },
});
dotenv.config();
const app = express();

const connetDB = async () => {
  try {
    const conn = await connect(
      `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.qt9nu2p.mongodb.net/`
    );
    console.log("connection was made");
  } catch (error) {
    console.log(error.message);
  }
};
connetDB();

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
// middleware to convert body data to readble form
app.use(express.json());

app.post("/url-shortner", async (req, res) => {
  const longUrl = req.body.longUrl;
  const shortUrl = nanoid(10);
  console.log({ [shortUrl]: longUrl });
  let newUrl = {
    shortUrl: shortUrl,
    longUrl: longUrl,
  };
  const newdbUrl = await urlModel.create(newUrl);
  newdbUrl.save();

  res.send(
    `<p><h2>Here is your shorten url </h2><a href="https://databaseforurls.onrender.com/J/${shortUrl}">https://databaseforurls.onrender.com/J/${shortUrl}</a></p>`
  );
});

app.get("/J/:id", async (req, res) => {
  console.log(req.params.id);
  try {
    let allUrls = await urlModel.find({ shortUrl: { $eq: req.params.id } });
    console.log(allUrls);
    res.redirect(allUrls[0].longUrl);
  } catch (error) {
    console.log(error);
  }
});

app.listen(10000, () => {
  console.log("running");
});
