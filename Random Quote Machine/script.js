// MVC implementation
const model = {
  init: function() {
    $.ajaxSetup({ cache: false });
    this.getJsonQuote();
  },

  getJsonQuote: function () { 
    // get a ramdon quote through getJSON()
    $.getJSON("https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1", function(data) {
      }).done(function(data) {
      // place the (new) quote in quoteData variable
      model.makeQuoteDataModel(data);
      // tell the controller there is a new quote
      controller.quoteUpdate(); 
    })
  },

  makeQuoteDataModel: function(data) {
    // populate the quoteData var with the quote information
    model.quoteData.quote = data[0].content;
    model.quoteData.source = data[0].title;
    model.quoteData.twitterURL =  this.twitterURL(data);
  },

  twitterURL: function(data) { 
    // construct the twitter url and return it, no side effects
    let quoteText = "%22" + escape(this.remExtChars(data[0].content)) + "%22 " + escape(this.remExtChars(data[0].title));
    let twitterURL = "https://twitter.com/intent/tweet?hashtags=quote&text=" + quoteText.replace(".%20%22%20", ".%22%20");
    return twitterURL;
  },

  remExtChars: function (quoteEl) {
    // remove extra/unnecessary chars from the raw quote element string, no side effects
    quote = quoteEl.replace(/<[pstrong/]+>|\n/g,"").replace("&#8217;","'").replace(/\s\s/, " ");
    return quote;
  },

  quoteData: {
    // the content of the quote data goes here in an ordered fashion.
    quote: "",
    source: "",
    twitterURL: ""
  }
};

const controller = {
  init: function() {
    // initiate the script
    model.init();
    view.init();
  },

  quoteUpdate: function() {
    // the quote has been updated act acordingly
    view.textToTwitter();
    view.placeQuote();
  },

  newQuote: function(){
    model.getJsonQuote();
  },

  getQuoteData: function() {
    return [model.quoteData.quote, model.quoteData.source, model.quoteData.twitterURL];
  }

};

const view = {
  init: function() {
    this.changeColor();
    document.getElementsByClassName("new-quote-btn")[0].addEventListener("click", function(e) {
      e.preventDefault();
      controller.newQuote();
      view.changeColor();
    });
  },

  quoteEls: function(el) {
    let quoteData = controller.getQuoteData();
    switch (el){
      case "quote":
        return quoteData[0] + "<p>&mdash; <em>" + quoteData[1] + "</em></p>";
        break;
      case "twitter":
        return quoteData[2];
        break;
    }
  },

  textToTwitter: function () {
    $(".twitter-share-button").prop("href", this.quoteEls("twitter"));
  },

  placeQuote: function() {
    $(".quote").html(this.quoteEls("quote"));
    // model.textToTwitter();
  },

  changeColor: function () {
    window.oldColor = "";
    const colors = ["#af96ae", "#a1af96", "#96af98", "#a496af", "#96afa4", "#acc8bc", "#acc8ae", "#96af97", "#6b8d6d", "#6b8d6d", "#8d6b8a", "#6b8a8d", "#8a8d6b", "#8d6e6b", "#6e6b8d", "#7f6b8d", "#8d7f6b", "#7f6b8d"];
    // oude kleur niet hetzellfde als neiwue kleur.....slapen
    let color = colors[Math.floor(Math.random()*colors.length)];
    while(color == oldColor) {
      color = colors[Math.floor(Math.random()*colors.length)];
    }
    oldColor = color;
    document.documentElement.style.setProperty("--basic-color", color);
  },

  newQuoteTimer: function(newQuote) {
    $(".quote").first().clone().addClass("new-quote").appendTo("#quote-wrapper");
    $(".quote").first().addClass("old-quote").addClass(".slide-out-right");
    let timeOutOut = setTimeout(function(newQuote) {
      $(".quote.old-quote").remove();
      view.placeQuote();
      $(".quote.new-quote").removeClass(".new-quote").addClass(".slide-in-left");
      let timeout1 = window.setTimeout(function(newQuote) {
        $(".quote").removeClass(".slide-in-left");
      }, 500);
    }, 500);
  },
};

controller.init("initial")


// not yet active, thinking of adding some animation using WAAPI (Web Animation Api)
var player = document.getElementById('toAnimate').animate([
    { transform: 'translateX(0)', opacity: 1},
    { transform: 'translateX(1000px)', opacity: 0},
  ], {
    duration: 500, //milliseconds
    easing: 'cubic-bezier(0.250, 0.460, 0.450, 0.940)', //'linear', a bezier curve, etc.
    delay: 10, //milliseconds
    iterations: 1, //or a number
    direction: 'normal', //'normal', 'reverse', etc.
    fill: 'forwards' //'backwards', 'both', 'none', 'auto'
  });