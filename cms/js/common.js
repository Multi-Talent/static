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
    // メニューの動作設定
    var $navItem = $(".js-nav_item");

    // クリックイベント（全デバイス共通）
    $navItem.on("click", function () {
        var $currentMenu = $(this).next("ul");
        // 他の全ての子メニューを閉じる
        $navItem.each(function() {
            var $otherMenu = $(this).next("ul");
            if (!$otherMenu.is($currentMenu)) {
                $otherMenu.slideUp();
            }
        });
        // 現在のメニューをトグル
        $currentMenu.slideToggle();
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
  // クリア（input/select 両対応）
  $('[name="' + fpref + '"], #' + fpref).val('');
  $('[name="' + faddr + '"], #' + faddr).val('');
  if (farea) $('[name="' + farea + '"], #' + farea).val('');
  if (fstrt) $('[name="' + fstrt + '"], #' + fstrt).val('');

  // ★必ず先にコールバック設定
  AjaxZip3.onSuccess = function () {
    // fpref (例: "神奈川県") から select(prefecture_code) を選ぶ
    const prefName = $('#fpref').val(); // ← fpref を使う（都道府県名）
    if (prefName) {
      const $sel = $('#prefecture_code');
      const match = $sel.find('option').filter(function () {
        return $(this).text() === prefName;
      }).val();

      if (match !== undefined) {
        $sel.val(match).trigger('change'); // ★ここで change を確実に発火
      }
    }

    // フォーカス
    if (farea && $('[name="' + farea + '"], #' + farea).length) {
      $('[name="' + farea + '"], #' + farea).focus();
    } else {
      $('#address_2').focus();
    }
  };

  AjaxZip3.onFailure = function () {
    // 失敗時：必要ならここで通知
    // console.log('AjaxZip3 failed');
  };

  // ★最後に実行
  AjaxZip3.zip2addr(fzip1, fzip2, fpref, faddr, farea, fstrt, ffocus);
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