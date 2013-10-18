$(function() {
  var offset = 40,
    $htmlbody = $("html, body");

  // Scrolling navigation
  $(".navbar-nav > li > a").on("click", function(e) {
    // e.preventDefault();
    var top = $(this.getAttribute("href")).offset().top - offset;
    $htmlbody.animate({
      scrollTop: top
    })
  });

  // Add "run" buttons to examples
  $(".codeblock").each(function(i, el) {
    var $el = $(el),
      n = $el.attr("data-example"),
      $button = $('<a class="btn btn-primary example-button" target="_blank" href="app/'+n+'/">Run &rarr;</a>');

    $el.children().each(function(j, pre) {
      var $pre = $(pre),
        type = $pre.attr("data-type"),
        $container = $('<div class="codeblock-container"></div>');

      $pre.before($container);
      $pre.appendTo($container);

      if (type !== undefined) {
        $container.attr("data-type", type);
      }

      // Add IDs so we can link to specific lines:
      $pre.attr("id", "ex-" + n + "-" + type)

      if (j === 0) {
        if (n !== "none") {
          $pre.before($button);
        }
      }
    });
  })

  $(".line-link").on("mouseover click", function(e) {
    e.preventDefault();

    var href = $(this).attr("href").split(":"),
      pre, lines;

    if (href.length === 2) {
      pre = $(href[0]);
      lines = href[1];

      // remove old highlights:
      $(".temporary.line-highlight").remove()

      // Add new ones:
      Prism.highlightLines(pre[0], lines, "temporary ")
    }
  });
});
