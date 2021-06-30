const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
const fetch = require('node-fetch');
app.use(bodyParser.json());
const mongoose = require("mongoose");
const isImageURL = require('image-url-validator').default;


// mongoose.connect('mongodb://localhost/xmemeDB', {useNewUrlParser: true, useUnifiedTopology: true});

//connecting to atlas
mongoose.connect('mongodb+srv://adminTejas:tejascoder@cluster0.kxpff.mongodb.net/xmemeDB', {useNewUrlParser: true, useUnifiedTopology: true});

const xmemeSchema = new mongoose.Schema({
  name : String,
  url : String,
  caption : String
});

const Xmeme = mongoose.model("Xmeme", xmemeSchema);

//receiving data from front end
app.post("/memes", function(req,res)
{
       console.log(req.body);

        //validation of url
        isImageURL(req.body.url).then(is_image => {

                if(is_image)
                {
                    console.log("meme url is valid !");

                    const data = new Xmeme({
                      name : req.body.name,
                      url : req.body.url,
                      caption : req.body.caption
                    });

                    //  data.save();
                    data.save(function(err)
                    {
                        if(err)res.send(err);
                        else {
                          res.status(201).send({ id: data._id });
                        }
                    });
                }
                else {
                  //url is invalid
                  res.send("invalid");
                }
        });


});



app.get("/memes", function(req,res)
{
    Xmeme.find().sort({_id : -1}).limit(100).exec(function(err, memesArray)
    {
        if(err)console.log(err);
        else {

                // converting _id --> id ... because given in requirements
                for(var i=0;i<memesArray.length;i++)
                {
                  var temp= {
                    "id" : memesArray[i]._id,
                    "name" : memesArray[i].name,
                    "url" : memesArray[i].url,
                    "caption" : memesArray[i].caption
                  };

                  memesArray[i] = temp;
                }
                console.log(memesArray.length + " memes data displayed on /memes Route");
                res.send(memesArray);
        }

    });

});


app.get("/memes/:custom_id", function(req,res)
{
    const given_id = req.params.custom_id;
    Xmeme.findOne({_id : given_id} , function(err,foundMeme)
    {
        if(err)console.log(err);
        else
        {
            // converting _id --> id ... because given in requirements
            var temp= {
              "id" : foundMeme._id,
              "name" : foundMeme.name,
              "url" : foundMeme.url,
              "caption" : foundMeme.caption
            };

            res.send(temp);
        }
    });
});

app.get("/gettingMemes", function(req,res)
{
    Xmeme.find().sort({_id : -1}).limit(100).exec(function(err, memesArray)
    {
        if(err)console.log(err);
        else
        {
                //console.log("total memes => " + memesArray.length);
                res.send(memesArray);
        }

    });
});

// edit url and caption
app.post("/updateMeme", function(req,res)
{
      console.log(req.body);

      Xmeme.findOne({_id:req.body.id} , function(err,foundmeme)
      {
          if(err)console.log(err);
          else
          {
            if(req.body.url != '' && req.body.url != null)
            {
              isImageURL(req.body.url).then(is_image => {

                      if(is_image)
                      {
                          foundmeme.url = req.body.url;
                          if(req.body.caption != "" && req.body.caption != null)
                          {
                            foundmeme.caption = req.body.caption;
                          }

                          console.log("Updated meme : " + foundmeme);

                          foundmeme.save(function(err)
                          {
                              if(err)res.send(err);
                          });
                      }
                      else {
                        res.send("invalid");
                        console.log("invalid");
                      }
              });
            }
            else
            {
                //url not entered
                //check for CAPTION only

                if(req.body.caption != "" && req.body.caption != null)
                {
                  foundmeme.caption = req.body.caption;
                }

                console.log("Updated meme : " + foundmeme);

                foundmeme.save(function(err)
                {
                    if(err)res.send(err);
                });

            }

          }
      });
});


let port = process.env.PORT;
if(port == null || port == "")
{
  port = 8081;
}

app.listen(port,function()
{
  console.log("Listening to the port 8081");
});
