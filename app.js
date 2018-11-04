var express = require("express"),
app = express(),
mongoose = require("mongoose"),
bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
methodOverride = require('method-override');

app.use(expressSanitizer());
mongoose.connect("mongodb://localhost/test");
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true }));
app.use(methodOverride('_method'));
app.use(express.static("public"));

var blogSchema = new mongoose.Schema({
     title:String,
     post:String,
     image:String,
     date:{type:Date,required:true,default:Date.now},
     author:String
    });

var Blog = mongoose.model("Blog",blogSchema);

app.get("/",function(req,res){
   res.redirect("/blogs/"); 
});

app.get("/blogs",function(req,res){
    Blog.find({},function(err,allBlogs){
        if(err){
            console.log(err);
        }else{
            allBlogs.forEach(function(allBlog){
                allBlog.post = allBlog.post.substr("0","200");
            });
            res.render("index",{blogs:allBlogs});
        }
    });
    
    
});

app.get("/blogs/new",function(req,res){
   res.render("new"); 
});

app.post("/blogs",function(req,res){
    
    var title = req.body.title;
    var author = req.body.author;
    var image = req.body.image;
    var post = req.body.post;
    
    var newPost = {title:title,post:post,image:image,author:author};

    
    Blog.create(newPost,function(err,newlyCreated){
       if(err){
           console.log(err);
       } else{
           res.redirect("/blogs");
       }
    });
    
    
});



app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("show",{blog:foundBlog})
        }
    });
    
});

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err){
            console.log(err);
        }else{
            res.render("edit",{blog:foundBlog})
        }
    });
});


app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, function(err, foundBlog){
       if(err){
           console.log(err);
       } else{
           var url = "/blogs/" + foundBlog._id;
           res.redirect(url);
       }
    });
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id, function (err) { 
        if(err){
            console.log(err);
        }else{
            res.redirect("/blogs/");
        }
    } );
});

const http = require('http');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
/** 
app.listen(process.env.PORT, process.env.IP, function(){
	var hostname = String(process.env.IP);
	var port = String(process.env.PORT);
    console.log("Server is up and running!");
	console.log(`Server running at http://${hostname}:${port}/`);
});
**/