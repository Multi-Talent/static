"use strict";

$(function () {
  $(".js-news-item_title").on("click", function () {
    $(this).next(".js-news-item_content").slideToggle();
    $(this).parent(".js-news-item").toggleClass("is-active");
  });

  $(".fist-active:first").find(".js-news-item_content").slideToggle();
  $(".fist-active:first").toggleClass("is-active");
});
