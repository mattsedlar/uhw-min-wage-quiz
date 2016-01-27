var score = 0,
    counter = 1,
    ansMessage;

function getURLParameter(name) {
  return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
}

// this will be called in bind() and removed unbind()
var clickHandler = function () {
     if($(this).attr("data-answer") == "yes") {
      $("div[data-answer='no']").css({ opacity: 0.5 });
      if ( $(window).width() < 768 ) {
        $("#answer-container p").prepend("Correct! ").css({"display":"block","height":"auto","color":"black"});
      }
      else {
        $(this).animate({ marginLeft:'0px'}, function(){
        $(this).find("div").hide().fadeOut(3000);
        $(this).find("div").html($("#answer-container p").html()).css({"font-size":"70%", "line-height":"1.25em"}).fadeIn(1000);
       });
      }
      score++;
    }

    else if($(this).attr("data-answer") == "no") {
     $(this).css("background-color","red");
      if ( $(window).width() < 768 ) {
        $("#answer-container p").prepend("Sorry! ").css({"display":"block","height":"auto","color":"black"});
      }
      else {
        $("div[data-answer='yes']").animate({marginLeft: '0px'}, function(){
          $("div[data-answer='yes']").find("div").hide().fadeOut(3000);
          $("div[data-answer='yes']").find("div").html($("#answer-container p").html()).css({ 'font-size': '70%', "line-height" : "1.25em" }).fadeIn(1000);
        });
      }
      $("div[data-answer='no']").css({ opacity: 0.5 });
    }

    $("#next").fadeTo("slow",1.0);
    $(".choice").unbind("click", clickHandler);
}

function nextQuestion(model){

  console.log(counter);

  if(counter > 4) {

    $("#question-container").css("display","none");
    $("#score-container h2").html("You got " + score + "/4 correct");
    $("#score-container").css("display","block");
    ga('send', 'event', 'button', 'click', 'finish-quiz', score);

  }

  else {

  $(".site-wrapper").css({"background":"none"});
  var questionView = new app.QuestionView({model:model}),
      l = 1;
    questionView.render();
		for (x in model.attributes) {
			if(model.attributes.hasOwnProperty(x)){
        if(x.indexOf("choice") > -1) {
          $("#choice-container").append("<div class='choice' data-answer='no' id='choice"
                                        + l
                                        + "'><div>"
                                        + model.attributes[x]
                                        + "</div></div>");
          l++;
  			}
			}
		}


   $("#choice" + model.attributes.answer).attr("data-answer","yes");
   $("#count").html(counter + " ");

   $("#next").attr("onclick","nextQuestion(eval('question' + counter))");

   counter++;

    $(".cover").hide();
    $("#next").css({opacity:0.0});

  $(".choice").bind("click", clickHandler);

  }
}

$(document).ready( function() {

    organization = getURLParameter('org');

    $("input[name*='org']").val(organization);

    $("#twitter").click( function() {
        var twitterUrl = "http://twitter.com/share/?",
        text = "text=I got " + 
                             score + 
                             " out of 4 correct on the minimum wage quiz. Think you can beat me? Give it a try! FPPC ID 1380738",
        quizUrl = "&url=http://liftupca.net/quiz/";

        var width  = 575,
        height = 400,
        left   = ($(window).width()  - width)  / 2,
        top    = ($(window).height() - height) / 2,
        url    = twitterUrl + text + quizUrl,
        opts   = 'status=1' +
                 ',width='  + width  +
                 ',height=' + height +
                 ',top='    + top    +
                 ',left='   + left;

    window.open(url, 'twitter', opts);
    ga('send', 'event', 'button', 'click', 'twitter-share', score);

    });


    $("#facebook").click( function() {
          FB.ui({
              method: 'feed',
              link: 'http://liftupca.net/quiz/',
              name: 'I got ' + score + ' out of 4 correct on the minimum wage quiz. Think you can beat me? Give it a try!',
              caption: 'Paid for by Lift Up California FPPC ID 1380738',
              picture: 'http://www.liftupcawages.com/wp-content/uploads/sites/2/2016/01/FB-share.png'
              }, function(response){});
              ga('send', 'event', 'button', 'click', 'facebook-share', score);
    });

  $(function () {
    $('.form-signup').submit(function () {
        if($(this).valid()) {
          $(this).remove();
          $("#form-lead").html("Thanks for your interest in raising the minimum wage. Now let your friends know how you did!");
          $("#score-container p").last().hide();
        }
    });
});


});



