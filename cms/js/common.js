"use strict";

$(function () {
    var $body = $("body");
    var $toggle = $(".js-header_toggle");
    var $close = $(".js-header-close");
    var $overlay = $(".js-nav_overlay");
    $toggle.on("click", function () {
        $body.addClass("is-active");
    });
    $close.on("click", function () {
        $body.removeClass("is-active");
    });
    $overlay.on("click", function () {
        $body.removeClass("is-active");
    });
    $(".js-nav_item").on("click", function () {
        $(this).next("ul").slideToggle();
    });
    var $pagetop = $(".js-pagetop");
    $pagetop.hide();
    $(window).on("scroll", function () {
        if ($(this).scrollTop() > 100) {
        $pagetop.fadeIn();
        $pagetop.children("a").css("opacity", 1);
        $pagetop.find("img").css("opacity", 1);
        } else {
        $pagetop.fadeOut();
        }
    });
    $pagetop.on("click", function () {
        $("body, html").animate(
        {
            scrollTop: 0,
        },
        500
        );
        return false;
    });
});

function search_addr_by_zip(fzip1, fzip2, fpref, faddr, farea, fstrt, ffocus) {
    $('input[name="' + fpref + '"]').val("");
    $('input[name="' + faddr + '"]').val("");
    AjaxZip3.zip2addr(fzip1, fzip2, fpref, faddr, farea, fstrt, ffocus);
    AjaxZip3.onSuccess = function () {
        $('input[name="' + farea + '"]').focus();
    };
}

function submit_func(form_name, confirm_msg) {
    if (window.confirm(confirm_msg)) {
        $("#" + form_name).submit();
    }
}

function ajax_post(url, data, success_func, err_func_name)
{
    $.ajax({
        type: 'post',
        url: url,
        data: data,
        dataType: 'json',
        success: success_func,
        error: function (xmlhttprequest, textstatus, errorThrown) {
            // ファンクションが存在する場合
            if (typeof alert_dlg === "function") {
                alert_dlg("Error", "Error at " + err_func_name + "<br>\n" +
                    xmlhttprequest.responseText + "<br>\n" +
                    "HttpStatus: " + xmlhttprequest.status + "<br>\n" +
                    "TextStatus: " + textstatus + "<br>\n" +
                    "Error: " + errorThrown.message);
            } else {
                alert("Error at " + err_func_name + "<br>\n" +
                    xmlhttprequest.responseText + "<br>\n" +
                    "HttpStatus: " + xmlhttprequest.status + "<br>\n" +
                    "TextStatus: " + textstatus + "<br>\n" +
                    "Error: " + errorThrown.message);
            }
        },
        cache: false,
        async: false
    });
}