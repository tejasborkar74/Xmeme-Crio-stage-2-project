$(document).ready(function()
{

  //Getting meme list of 100 latest memes and appending to meme-section
  $.ajax
  ({
    type: "GET",
    url: "https://arcane-sierra-70178.herokuapp.com/gettingMemes",
    success: function(memesArray)
    {
       for(var i=0;i<memesArray.length;i++)
       {
            var name = memesArray[i].name;
            var url = memesArray[i].url;
            var caption = memesArray[i].caption;
            var buttonid = memesArray[i]._id;

           $("<div class='meme_card'><div class='name'><h3>"+ name +"</h3></div><div class='caption'><p>"+ caption +"</p></div><div class='image'> <img src='"+ url +"'></div><button class = 'edit_button' id='"+ buttonid +"'>Edit</button></div>").appendTo("#memes_section");
       }
    }
  });



  // Submitting the form
   $("#submitButton").click(function()
   {
     //Retriving data from the form
       var memeowner = $("input[name='memeowner']").val();
       var caption = $("input[name='caption']").val();
       var url = $("input[name='meme_url']").val();


       if(url === "")
       {
         alert("Meme URL field is empty");
       }
       else if(memeowner === "")
       {
         alert("Memeowner name is empty");
       }
       else if(caption === "")
       {
          alert("Caption is not given");
       }
       else
       {
                    var data ={
                    name : memeowner ,
                    caption : caption,
                    url : url,
                    };

                    //sending data to memes route in nodejs (backend)
                    $.ajax({
                    type: 'POST',
                    url: 'https://arcane-sierra-70178.herokuapp.com/memes',
                    data: data,
                    success: function(res)
                    {
                      if(res=='invalid')alert("Entered Meme URL is invalid !!");
                    }
                    });
       }

   });



   //Edit button functionality
   //memes_section is id of parent div of all memes
   $("#memes_section").on('click', 'button' , function()
   {
        var id = $(this).attr("id");
        var newurl = prompt( "EDIT URL" + "\n" + "Enter new URL : ", "");
        var newcaption = prompt("EDIT CAPTION" + "\n" + "Enter new Caption : ", "");
        alert("Entered URL : " + newurl + "\n\n" + "Entered Caption : " + newcaption);


        var data ={
        caption : newcaption,
        url : newurl,
        id : id
        };

        //sending data to memes route in nodejs (backend)
        $.ajax({
        type: 'POST',
        url: 'https://arcane-sierra-70178.herokuapp.com/updateMeme',
        data: data,
        success: function(res)
        {
          if(res=='invalid')alert("Entered Meme URL is invalid !!");
        }
        });


   });

});
