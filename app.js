const express = require ("express");
const bodyParser = require ("body-parser");
const https = require ("https");
const ejs = require("ejs");
const _ = require("lodash");
const multer = require("multer");

let fileName = '';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    const { originalname } = file;
    cb(null, originalname);
    fileName = file;
  }
});
const upload = multer({ storage });

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded( {extended: true} ));
app.use(express.static(__dirname + "/public"));

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

let posts = [];

app.get("/", function (req, res) {
    res.render("home", {homeText: homeStartingContent, newPosts: posts});
});

app.get("/about", function (req, res) {
  res.render("about", {aboutText: aboutContent});
});

app.get("/contact", function (req, res) {
  res.render("contact", {contactText: contactContent});
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:titleOfPost", function (req, res) {
  const requestedPost = _.lowerCase(req.params.titleOfPost);

  posts.forEach(function(post) {
    if (_.lowerCase(post.title) === requestedPost) {
      res.render("post", {blogPostTitle: post.title, blogPostContent: post.body, blogPostImg: post.img});
    }
  });
});

app.post("/compose", upload.single("postImg"), function (req, res) {
  let nameOfImg = '';
  
  if (!fileName.originalname) {
    nameOfImg = 'patternpad.svg';
  } else {
    nameOfImg = fileName.originalname;
  }
  
  const post = {
    title: req.body.postTitle,
    body: req.body.postBody,
    img: nameOfImg
  };

  fileName = '';

  posts.push(post);

  res.redirect("/");
});

app.listen("3000", function () {
    console.log("Server is running on port 3000");
});