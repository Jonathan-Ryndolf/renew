$(function () {
  $("#designer").hover(
    function () {
      $(".big").css("height", "300px");
      $(".outline").css("height", "285px");
      $(".outline").css("border", "2px solid #fff");
      $(".outline").css("background-color", "#00c5db10");
      $(".small").css("opacity", "1");
      $("#color1, #color2, #color3, #color4, #color5").css("opacity", "1");
      $("#color1").css("transition-delay", "0s");
      $("#color2").css("transition-delay", ".25s");
      $("#color3").css("transition-delay", ".5s");
      $("#color4").css("transition-delay", ".75s");
      $("#color5").css("transition-delay", "1s");
    },
    function () {
      // on mouseout, reset the background colour
      $(".big").css("height", "0px");
      $(".outline").css("height", "0px");
      $(".outline").css("border", "0px solid #59595900");
      $(".outline").css("background-color", "#00c5db2300");
      $(".small").css("opacity", "0");
      $("#color1, #color2, #color3, #color4, #color5").css("opacity", "");
      $("#color1").css("transition-delay", "1s");
      $("#color2").css("transition-delay", ".75s");
      $("#color3").css("transition-delay", ".5s");
      $("#color4").css("transition-delay", ".25s");
      $("#color5").css("transition-delay", "0s");
    }
  );
});

$(function () {
  $("#developer").hover(
    function () {
      $("#code").css("clip-path", "circle(30% at 55% 50%)");
    },
    function () {
      // on mouseout, reset the background colour
      $("#code").css("clip-path", "circle(0% at 55% 50%)");
    }
  );
});

$(function () {
  $("#doctor").hover(
    function () {
      $("#doc").css("clip-path", "circle(80% at 45% 50%)");
    },
    function () {
      // on mouseout, reset the background colour
      $("#doc").css("clip-path", "circle(0% at 45% 50%)");
    }
  );
});

$(function () {
  $("#deesigner").hover(
    function () {
      $("#des").css("clip-path", "circle(30% at 50% 50%)");
    },
    function () {
      // on mouseout, reset the background colour
      $("#des").css("clip-path", "circle(0% at 50% 50%)");
    }
  );
});

$(document).ready(function () {
  $("#designer").hover(
    function () {
      $("#name").addClass("grad");
    },
    function () {
      $("#name").removeClass("grad");
    }
  );
});

$(document).ready(function () {
  $("#developer").hover(
    function () {
      $("#name").addClass("greener");
    },
    function () {
      $("#name").removeClass("greener");
    }
  );
});

$(document).ready(function () {
  $("#doctor").hover(
    function () {
      $("#name").addClass("reder");
    },
    function () {
      $("#name").removeClass("reder");
    }
  );
});
