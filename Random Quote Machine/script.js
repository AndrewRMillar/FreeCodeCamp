// MVC implementation

var model = {
  init: function() {
    this.getJsonQuote();
    $.ajaxSetup({ cache: false });
  },

  getJsonQuote: function () {
    $.getJSON("https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1", function(data) {
    }).done(function(data) {
      view.newQuoteTimer(data);
      return data;
    })
  },

  textToTwitter: function (data) {
    var quoteText = "%22" + escape(this.remExtChars(data[0].content)) + "%22 &mdash; " + escape(this.remExtChars(data[0].title));
    var twitterURL = "https://twitter.com/intent/tweet?hashtags=quote&text="
    $(".twitter-share-button").prop("href", twitterURL + quoteText.replace(".%20%22%20", ".%22%20"));
  },

  remExtChars: function (quote) {
    quote = quote.replace(/<[pstrong/]+>|\n/g,"").replace("&#8217;","'").replace(/\s\s/, " ");
    return quote;
  }
};

var controller = {
  init: function() {
    model.init();
    view.init();
  },

  passJsonQuote: function(){
    return model.getJsonQuote();
  },

};

var view = {
  init: function() {
    controller.passJsonQuote();
    this.changeColor();
    document.getElementsByClassName("new-quote-btn")[0].addEventListener("click", function(e) {
      e.preventDefault();
      controller.passJsonQuote();
      view.changeColor();
    });
  },

  placeQuote: function() {
    $(".quote").html(data[0].content + "<p>&mdash; <em>" + data[0].title + "</em></p>")
      view.textToTwitter(data);
  },

  changeColor: function () {
    const colors = ["#af96ae", "#a1af96", "#96af98", "#a496af", "#96afa4", "#acc8bc", "#acc8ae", "#96af97", "#6b8d6d", "#6b8d6d", "#8d6b8a", "#6b8a8d", "#8a8d6b", "#8d6e6b", "#6e6b8d", "#7f6b8d", "#8d7f6b", "#7f6b8d"];
    let color = colors[Math.floor(Math.random()*colors.length)];
    document.documentElement.style.setProperty("--basic-color", color);
  },

  newQuoteTimer: function(newQuote) {
    $(".quote").first().clone().addClass("new-quote").appendTo("#quote-wrapper");
    $(".quote").first().addClass("old-quote").addClass(".slide-out-right");
    var timeOutOut = setTimeout(function(newQuote) {
      $(".quote.old-quote").remove();
      $(".quote.new-quote").removeClass(".new-quote")
      var timeout1 = window.setTimeout(function(newQuote) {
      }, 500);
    }, 500);
  },
};

controller.init()
