"use strict";
/*------------------------------------------------------------
  共通変数
------------------------------------------------------------*/
/*------------------------------------------------------------
  PC・SPのサイズ取得
------------------------------------------------------------*/
//SPのウィンドウサイズ
var sp_size = 768;

//ウィンドウサイズ（pc・spで判定用）
var window_size = "pc";
var w = 0;
var h = 0;
var js_bg_modalClassName = "js-modal"; //モーダル用の共通クラス
var bg_modalClassName = "modal"; //モーダル用の共通クラス
var movie__inner__ClassName = "modal__inner"; //モーダルのインナー共通クラス
var tabindex_before = ""; //モーダル表示前のアクティブ要素
var modal_showflag = false; //モーダル表示前のアクティブ要素
//ウィンドウサイズの測定（読み込み時）

window.addEventListener(
  "DOMContentLoaded",
  function () {
    //w　ウィンドウ幅を取得
    w =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    //h　ウィンドウ幅を取得
    h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;

    //PCサイズ
    if (w > sp_size) {
      window_size = "pc";
      //SPサイズ
    } else {
      window_size = "sp";
    }
  },
  false
);
//ウィンドウサイズの測定（リサイズ時）
window.addEventListener(
  "resize",
  function () {
    //w　ウィンドウ幅を取得
    w =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;
    //h　ウィンドウ幅を取得
    h =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    //PCサイズ
    if (w > sp_size) {
      window_size = "pc";
      //SPサイズ
    } else {
      window_size = "sp";
    }
  },
  false
);

var set_position = 0;
var page_scroll = "";
window.addEventListener("scroll", function () {
  if (set_position < document.documentElement.scrollTop) {
    page_scroll = "down";
  } else {
    page_scroll = "up";
  }
  set_position = document.documentElement.scrollTop;
});

var userAgent = window.navigator.userAgent.toLowerCase();
var appVersion = window.navigator.appVersion.toLowerCase();

/*------------------------------------------------------------
  IE対応：Scroll量計測
------------------------------------------------------------*/
/*------------------------------------------------------------
  IE対応：Scroll量計測（X軸）
------------------------------------------------------------*/
function getScrollX(window) {
  if ("scrollX" in window) {
    return window.scrollX;
  }

  if ("pageXOffset" in window) {
    return window.pageXOffset;
  }

  var doc = window.document;

  return doc.compatMode === "CSS1Compat"
    ? doc.documentElement.scrollLeft
    : doc.body.scrollLeft;
}

/*------------------------------------------------------------
  IE対応：Scroll量計測（Y軸）
------------------------------------------------------------*/
function getScrollY(window) {
  if ("scrollY" in window) {
    return window.scrollY;
  }

  if ("pageYOffset" in window) {
    return window.pageYOffset;
  }

  var doc = window.document;

  return doc.compatMode === "CSS1Compat"
    ? doc.documentElement.scrollTop
    : doc.body.scrollTop;
}
/*------------------------------------------------------------
  共通関数の設定
------------------------------------------------------------*/
/*------------------------------------------------------------
  closest ブラウザ(IE)
  親要素の取得するための設定
  使用箇所：e.target.closest(xxxxxxx)
------------------------------------------------------------*/
//
if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    var el = this;

    do {
      if (el.matches(s)) return el;
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);

    return null;
  };
}

/*------------------------------------------------------------
  単位:vh ブラウザ対応(Safari)
  アドレスバーの高さ算出
------------------------------------------------------------*/
var setFillHeight = function setFillHeight() {
  var vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty("--vh", vh + "px");
};

// 画面のサイズ変動があった時に、高さを再計算する
window.addEventListener("resize", setFillHeight);
// 関数実行
setFillHeight();

/*------------------------------------------------------------
  URL：パラメーターの値を取得
  使用箇所：getQueryString(xxxxxxx);
------------------------------------------------------------*/
function getQueryString() {
  var key = false,
    res = {},
    itm = null; // get the query string without the ?

  var qs = location.search.substring(1); // check for the key as an argument

  if (arguments.length > 0 && arguments[0].length > 1) key = arguments[0]; // make a regex pattern to grab key/value

  var pattern = /([^&=]+)=([^&]*)/g; // loop the items in the query string, either
  // find a match to the argument, or build an object
  // with key/value pairs

  while ((itm = pattern.exec(qs))) {
    if (key !== false && decodeURIComponent(itm[1]) === key)
      return decodeURIComponent(itm[2]);
    else if (key === false)
      res[decodeURIComponent(itm[1])] = decodeURIComponent(itm[2]);
  }

  return key === false ? res : null;
}

/*------------------------------------------------------------
  scroll関連
  ・スクロール処理禁止
  ・スクロール処理禁止解除
------------------------------------------------------------*/
// スクロールを禁止にする関数
function disableScroll(event) {
  event.preventDefault();
}

// スクロール処理禁止
function scroll_no() {
  // イベントと関数を紐付け
  //touchmove時
  document.addEventListener("touchmove", disableScroll, {
    passive: false,
  });
  //mousewheel時
  document.addEventListener("mousewheel", disableScroll, {
    passive: false,
  });
}

// スクロール処理禁止解除
function scroll_yes() {
  // イベントと関数を紐付け
  //touchmove時
  document.removeEventListener("touchmove", disableScroll, {
    passive: false,
  });
  //mousewheel時
  document.removeEventListener("mousewheel", disableScroll, {
    passive: false,
  });
}

/* ---------------------------------------------------------
スムーズスクロール(ページロード時のページ内リンク)
hash: ID指定（位置）
scroll_m : scroll停止時の初期余白
speed: スクロールスピード
--------------------------------------------------------- */
function scrollToAnker(hash, scroll_m, speed) {
  //hash変数の代入
  var target = $(hash);
  // header
  var $header = $(".js-l-header");

  var h_header = $header.outerHeight(); // headerの高さ

  var position;
  //hashが存在しているとき
  if (target.length) {
    if (target.offset().top > scroll_m) {
      position = -scroll_m;
    } else {
      position = 0;
    }
    // headerが存在しているとき(SP時)
    if (window_size === "sp" && $header.length) {
      // headerの高さ分を引いた、scroll値を調整
      position += target.offset().top - h_header - 10;
      // headerが存在していないとき
    } else {
      // scroll値を調整
      position += target.offset().top;
    }
  }
  //スクロール処理の実行
  $("body,html").animate(
    {
      scrollTop: position,
    },
    speed,
    "swing"
  );
}

/*------------------------------------------------------------
  ページ内Scroll処理（汎用用）
------------------------------------------------------------*/
function pageScrollFun(href) {
  //header用のClass
  var $header = $(".js-l-header");

  //href変数に「#」の文字を含むとき
  if (href.indexOf("#") != -1) {
    //hrefの値が「#」完全一致するとき
    if (href === "#") {
      //scrollTopの位置まで、スクロールする
      $("body,html").animate(
        {
          scrollTop: 0,
        },
        500,
        "swing"
      );
      //hrefの値が「#」完全一致しないとき
    } else {
      //hrefの値があるとき
      if ($(href)) {
        //スムーズスクロール
        scrollToAnker(href, 0, 500);
      }
    }
  }
}

/*------------------------------------------------------------
  bodyのidとheaderのhrefの値が一部合致する場合。カレントのClassを付与
------------------------------------------------------------*/
function GlinkActive() {
  //idを取得
  var id = $("body").attr("id");
  $(".js-l-header a").each(function () {
    // リンクのhrefとid名が一致するか
    if (
      $(this)
        .attr("href")
        .indexOf("/" + id + "/") !== -1
    ) {
      //bodyのIDと一致した時のみ、リンクにClassを付与
      $(this).addClass("is-current");
    }
  });
}

/*------------------------------------------------------------
  高さ揃え(matchHeight)
  該当Classがあるとき、高さを調整する。
------------------------------------------------------------*/
function matchheightFun() {
  //トップページ：.js-article-thum-swiper .js-article-thum-area
  if ($(".js-article-thum-swiper .js-article-thum-area").length) {
    $(".js-article-thum-swiper .js-article-thum-area").matchHeight();
  }

  //トップページ：.js-article-thum-swiper .js-article-thum-text-area
  if ($(".js-article-thum-swiper .js-article-thum-text-area").length) {
    $(".js-article-thum-swiper .js-article-thum-text-area").matchHeight();
  }
}

/*------------------------------------------------------------
 高さ揃え(matchHeight)
 リセット
------------------------------------------------------------*/
function matchheightRemoveFun() {
  //トップページ：.js-article-thum-swiper .js-article-thum-area
  if ($(".js-article-thum-swiper .js-article-thum-area").length) {
    $(".js-article-thum-swiper .js-article-thum-area").matchHeight({
      remove: true,
    });
  }
  //トップページ：.js-article-thum-swiper .js-article-thum-text-area
  if ($(".js-article-thum-swiper .js-article-thum-text-area").length) {
    $(".js-article-thum-swiper .js-article-thum-text-area").matchHeight({
      remove: true,
    });
  }
}

/*------------------------------------------------------------
  追従ボタン&メニュー
------------------------------------------------------------*/
function FollowFun() {
  this.page__top__sp__ClassName = "js-page-top-sp"; //page-top用のClass:共通
  this.page__top__pc__ClassName = "js-page-top-pc"; //page-top用のClass:共通
  this.page__top__link__ClassName = "js-page-top-link"; //page-top用のClass:共通

  this.$page__top__sp = document.querySelector(
    "." + this.page__top__sp__ClassName
  ); //.page-top用のHTML
  this.$page__top__sp__link = document.querySelector(
    "." + this.page__top__sp__ClassName + " ." + this.page__top__link__ClassName
  ); //.page-top-link用のHTML

  this.$page__top__pc = document.querySelector(
    "." + this.page__top__pc__ClassName
  ); //.page-top用のHTML
  this.$page__top__pc__link = document.querySelector(
    "." + this.page__top__pc__ClassName + " ." + this.page__top__link__ClassName
  ); //.page-top-link用のHTML

  this.follow__js__ClassName = "js-follow"; //追従メニュー用のClass:共通
  this.$follow__js = document.querySelector("." + this.follow__js__ClassName); //追従メニュー用のHTML
  this.follow__js__list__ClassName = "js-follow-list"; //追従メニュー用のClass:共通
  this.$follow__js__list = document.querySelector(
    "." + this.follow__js__list__ClassName
  ); //
  this.page__top__pc__stop__flag = false;
  this.page__top__sp__stop__flag = false;
  this.follow__js__stop__flag = false; //
  this.page__top__sp__stop__ClassName = "is-stop"; //
  this.follow__js__stop__ClassName = "is-stop"; //
  this.follow__js__list__transition__no__ClassName = "is-transition-no"; //

  this.page__top__pc__link__top = ""; //追従メニュー用のTTOP位置
  this.page__top__sp__link__top = ""; //追従メニュー用のTTOP位置
  this.follow__js__list__top = ""; //追従メニュー用のTTOP位置
  this.first__load__flag = false; //初回ロード判定
  this.pageTop__flag = false; //ページスクロール判定
  this.scrollY = ""; //ScrollY量
  this.page__top__pc__bottom = 20; //ScrollY量
  this.page__top__sp__bottom = 20; //ScrollY量
  this.speed = 500; //ScrollY量
  this.init();
}
//モーダルを削除するとき　共通関数
FollowFun.prototype.init = function () {
  var self = this;
  self.event();
};

FollowFun.prototype.set = function () {
  var self = this;

  self.scrollY = getScrollY(window);
  if (self.scrollY > h) {
    self.pageTop__flag = true;
  } else {
    self.pageTop__flag = false;
  }
};
FollowFun.prototype.page__top__pc__set = function () {
  var self = this;
  self.page__top__pc__link__top =
    self.$page__top__pc.offsetTop -
    h +
    self.$page__top__pc__link.offsetHeight / 2 +
    self.page__top__pc__bottom;
  //停止位置までScroll
  if (self.scrollY >= self.page__top__pc__link__top) {
    self.page__top__pc__stop__flag = true;
    self.$page__top__pc__link.style.bottom =
      self.scrollY -
      self.page__top__pc__link__top +
      self.page__top__pc__bottom +
      "px";
    //停止位置より上
  } else {
    self.page__top__pc__stop__flag = false;
    self.$page__top__pc__link.style.bottom = "";
  }
};

FollowFun.prototype.page__top__sp__set = function () {
  var self = this;
  self.page__top__sp__link__top =
    self.$page__top__sp.offsetTop -
    h +
    self.$page__top__sp__link.offsetHeight +
    self.page__top__sp__bottom;
  //停止位置までScroll
  if (self.scrollY >= self.page__top__sp__link__top) {
    self.page__top__sp__stop__flag = true;
    if (!$(self.$page__top__sp).hasClass(self.page__top__sp__stop__ClassName)) {
      $(self.$page__top__sp).addClass(self.page__top__sp__stop__ClassName);
    }
    //停止位置より上
  } else {
    self.page__top__sp__stop__flag = false;
    if ($(self.$page__top__sp).hasClass(self.page__top__sp__stop__ClassName)) {
      $(self.$page__top__sp).removeClass(self.page__top__sp__stop__ClassName);
    }
  }
};

FollowFun.prototype.follow__set = function () {
  var self = this;
  var timeoutId;

  //停止位置までScroll
  if (page_scroll === "up") {
    self.follow__js__list__top = self.$follow__js.offsetTop - h;
  } else if (page_scroll === "down") {
    self.follow__js__list__top =
      self.$follow__js.offsetTop - h + self.$follow__js__list.offsetHeight;
  } else {
    self.follow__js__list__top =
      self.$follow__js.offsetTop - h + self.$follow__js__list.offsetHeight;
  }

  if (self.scrollY >= self.follow__js__list__top) {
    self.follow__js__stop__flag = true;
    if (!$(self.$follow__js).hasClass(self.follow__js__stop__ClassName)) {
      $(self.$follow__js).addClass(self.follow__js__stop__ClassName);
    }

    //停止位置より上
  } else {
    self.follow__js__stop__flag = false;

    if ($(self.$follow__js).hasClass(self.follow__js__stop__ClassName)) {
      if (page_scroll === "up") {
        $(self.$follow__js).addClass(
          self.follow__js__list__transition__no__ClassName
        );

        // スクロールを停止してXXms後に終了とする
        timeoutId = setTimeout(function () {
          $(self.$follow__js).removeClass(
            self.follow__js__list__transition__no__ClassName
          );
        }, 100);
      }
      $(self.$follow__js).removeClass(self.follow__js__stop__ClassName);
    }
  }
};

FollowFun.prototype.event = function () {
  var self = this;
  //ロード時
  $(window).on("load", function (e) {
    // 初回読み込み表示フラグがfalseの時
    if (self.first__load__flag === false) {
      self.first__load__flag = true;
    }
  });
  $(window).on("load scroll resize", function (e) {
    self.set();
  });
  if (self.$page__top__pc) {
    self.page__top__pc__event();
  }
  if (self.$page__top__sp) {
    self.page__top__sp__event();
  }
  if (self.$follow__js) {
    self.follow__event();
  }
};
FollowFun.prototype.page__top__pc__event = function () {
  var self = this;

  $(window).on("load", function (e) {
    self.page__top__pc__set();
    // 表示フラグがtrueの時
    if (self.pageTop__flag === true) {
      // 処理内容(表示)
      $(self.$page__top__pc__link).stop().fadeIn();
    }
  });
  //スクロール時
  $(window).on("scroll", function (e) {
    self.page__top__pc__set();
    // 初回読み込み表示フラグがtrueの時
    if (
      self.first__load__flag === true &&
      self.page__top__pc__stop__flag === false
    ) {
      // 表示フラグがtrueの時
      if (self.pageTop__flag === true) {
        // 処理内容(非表示)
        $(self.$page__top__pc__link).stop().fadeIn();
      } else {
        $(self.$page__top__pc__link).stop().fadeOut();
      }
    }
  });
};
FollowFun.prototype.page__top__sp__event = function () {
  var self = this;

  $(window).on("load", function (e) {
    self.page__top__sp__set();
    // 表示フラグがtrueの時
    if (self.pageTop__flag === true) {
      // 処理内容(表示)
      $(self.$page__top__sp__link).stop().fadeIn();
    }
  });
  //スクロール時
  $(window).on("scroll", function (e) {
    self.page__top__sp__set();
    // 初回読み込み表示フラグがtrueの時
    if (
      self.first__load__flag === true &&
      self.page__top__sp__stop__flag === false
    ) {
      // 表示フラグがtrueの時
      if (self.pageTop__flag === true) {
        // 処理内容(非表示)
        $(self.$page__top__sp__link).stop().fadeIn();
      } else {
        $(self.$page__top__sp__link).stop().fadeOut();
      }
    }
  });
};
FollowFun.prototype.follow__event = function () {
  var self = this;
  var timeoutId;

  $(window).on("load", function (e) {
    self.follow__set();
    // 表示フラグがtrueの時
    if (self.pageTop__flag === true && self.follow__js__stop__flag === false) {
      // 処理内容(表示)
      self.$follow__js__list.style.transform = "translateY(0)";
      if (self.$page__top__sp && self.$page__top__sp__link) {
        if (!$(self.$follow__js).hasClass(self.follow__js__stop__ClassName)) {
          self.$page__top__sp__link.style.transform =
            "translateY( -" + self.$follow__js.offsetHeight + "px)";
        }
      }
    } else {
      // 処理内容(非表示)
      self.$follow__js__list.style.transform = "translateY(100%)";
      if (self.$page__top__sp && self.$page__top__sp__link) {
        if (!$(self.$follow__js).hasClass(self.follow__js__stop__ClassName)) {
          self.$page__top__sp__link.style.transform = "translateY(0)";
        }
      }
    }
  });

  $(window).on("scroll", function (e) {
    self.follow__set();
    // 初回読み込み表示フラグがtrueの時
    if (
      self.first__load__flag === true &&
      self.follow__js__stop__flag === false
    ) {
      // スクロールを停止してXXms後に終了とする
      clearTimeout(timeoutId);

      // 表示フラグがtrueの時
      if (self.pageTop__flag === true) {
        // 処理内容(非表示)
        self.$follow__js__list.style.transform = "translateY(100%)";

        if (self.$page__top__sp && self.$page__top__sp__link) {
          if (!$(self.$follow__js).hasClass(self.follow__js__stop__ClassName)) {
            self.$page__top__sp__link.style.transform = "translateY(0)";
          }
        }

        // スクロールを停止してXXms後に終了とする
        timeoutId = setTimeout(function () {
          // 処理内容(表示)
          self.$follow__js__list.style.transform = "translateY(0)";
          if (self.$page__top__sp && self.$page__top__sp__link) {
            if (
              !$(self.$follow__js).hasClass(self.follow__js__stop__ClassName)
            ) {
              self.$page__top__sp__link.style.transform =
                "translateY( -" + self.$follow__js.offsetHeight + "px)";
            }
          }
        }, self.speed);
      } else {
        // スクロールを停止してXXms後に終了とする
        timeoutId = setTimeout(function () {
          // 処理内容(非表示)

          self.$follow__js__list.style.transform = "translateY(100%)";
          if (self.$page__top__sp && self.$page__top__sp__link) {
            if (
              !$(self.$follow__js).hasClass(self.follow__js__stop__ClassName)
            ) {
              self.$page__top__sp__link.style.transform = "translateY(0)";
            }
          }
        }, self.speed);
      }
    }
  });
};

function TextHeightFun(textName, text_h_row_pc, text_h_row_sp, btnText) {
  this.parameterName = "moretext"; //パラメータ：URLの取得名
  this.textName = textName;
  this.$text = document.querySelectorAll(this.textName);
  this.text_h_row_pc = new String(text_h_row_pc); //テキストの最大行数(pc)
  this.text_h_row_sp = new String(text_h_row_sp); //テキストの最大行数(sp)
  this.btnText = btnText; //ボタンの有無（テキストを配列）

  this.three__text__className = "three-point-leader-text";
  this.three__text__js__className = "js-three-point-leader-text";
  this.three__more__btn__className = "three-point-more-btn";
  this.three__more__btn__js__className = "js-three-point-more-btn";
  this.three__more__btn__js__class =
    "." + this.three__more__btn__js__className + " > a";
  this.open__className = "is-open";
  this.speed = 200;
  this.text_font_size;
  this.text_light_height;
  this.init();
}

TextHeightFun.prototype.init = function () {
  var self = this;
  if (self.$text.length > 0) {
    //URLパラメーターに、self.parameterNameが含まれているか
    var parameter = getQueryString(self.parameterName);
    if (parameter !== null) {
      //パラメーターに「,」が含まれていないとき
      if (parameter.indexOf(",") === -1) {
        //パラメーターとIDが一致するとき
        if ($("#" + parameter).length > 0) {
          //ページローディング時に開閉する場合の処理を実行
          self.loadshow($("#" + parameter)[0]);
        }
        //パラメーターに「,」が含まれているとき
      } else {
        //「,」配列に格納
        var parameterArray_set = parameter.split(",");

        var parameterArray = parameterArray_set.filter(function (ele, pos) {
          return parameterArray_set.indexOf(ele) == pos;
        });

        //配列でループする
        for (var i = 0; i < parameterArray.length; i++) {
          var parameterCurrnt = parameterArray[i];
          //配列毎に開閉処理を実行
          self.loadshow($("#" + parameterCurrnt)[0]);
        }
      }
    }

    self.set(self.$text);

    if (self.btnText !== undefined) {
      $("body").on("click", self.three__more__btn__js__class, function (e) {
        var $this = $(this).parent().parent();

        if (!$($this).hasClass(self.open__className)) {
          //現在の高さ算出
          var curHeight = $($this)
            .find("." + self.three__text__js__className)
            .height();
          //開閉用Classを付与
          $($this).addClass(self.open__className);
          //本来の高さ算出
          $($this)
            .find("." + self.three__text__js__className)
            .css({
              height: "",
            });
          //auto用の高さを算出
          var autoHeight = $($this)
            .find("." + self.three__text__js__className)
            .height();
          //開閉用アニメ―ション
          $($this)
            .find("." + self.three__text__js__className)
            .height(curHeight)
            .animate({ height: autoHeight }, self.speed, function () {
              $(this).css({
                height: "",
              });
            });

          //閉じるにテキストを変更
          $($this).find(
            "." + self.three__more__btn__js__className + " > a "
          )[0].text = self.btnText[1];
        } else {
          //現在の高さ算出
          var curHeight = $($this)
            .find("." + self.three__text__js__className)
            .height();

          var text_font_size = Number(
            $($this).css("fontSize").replace("px", "")
          );

          //IEのとき
          if (userAgent.indexOf("msie") != -1) {
            if (
              appVersion.indexOf("msie 6.") != -1 ||
              appVersion.indexOf("msie 7.") != -1 ||
              appVersion.indexOf("msie 8.") != -1 ||
              appVersion.indexOf("msie 9.") != -1 ||
              appVersion.indexOf("msie 10.") != -1
            ) {
              var text_light_height =
                Number(
                  getStyle.lineHeight *
                    parseFloat($($this).css("font-size").replace("px", ""))
                ) / text_font_size;
            }

            //IE以外のとき
          } else {
            var text_light_height =
              Number($($this).css("line-height").replace("px", "")) /
              text_font_size;
          }

          if (window_size === "pc" && self.text_h_row_pc !== "") {
            //テキストの高さ > フォントサイズ * 行高　* テキストの行数制限
            var text_max_h =
              text_font_size * text_light_height * self.text_h_row_pc + 1;
            if (curHeight > text_max_h) {
              self.texthideAnimate($this, text_max_h, self.text_h_row_pc);
            }
          } else if (window_size === "sp" && self.text_h_row_sp !== "") {
            //テキストの高さ > フォントサイズ * 行高　* テキストの行数制限
            var text_max_h =
              text_font_size * text_light_height * self.text_h_row_sp + 1;

            if (curHeight > text_max_h) {
              self.texthideAnimate($this, text_max_h, self.text_h_row_sp);
            }
          } else {
          }

          window.setTimeout(open__class__RemoveFun, self.speed);

          function open__class__RemoveFun() {
            $($this).removeClass(self.open__className);
          }
        }

        e.preventDefault();
      });
    }

    $(window).on("resize", function (e) {
      //初回ロード時のwindow_sizeと現在のwindowサイズが異なるとき
      self.set(self.$text);
    });
  }
};

TextHeightFun.prototype.set = function ($this) {
  var self = this;
  var pc_spflag = "";
  var text_h = "";
  for (var i = 0; i < $this.length; i++) {
    pc_spflag = "";
    if (!$($this[i]).hasClass(self.open__className)) {
      if (
        $($this[i]).find("." + self.three__text__js__className).length === 0
      ) {
        text_h = $this[i].offsetHeight;
      } else {
        self.texthideReset($this[i]);
        text_h = $($this[i]).find("." + self.three__text__js__className)[0]
          .offsetHeight;
      }

      self.text_font_size = Number(
        $($this[i]).css("fontSize").replace("px", "")
      );
      //IEのとき
      if (userAgent.indexOf("msie") != -1) {
        if (
          appVersion.indexOf("msie 6.") != -1 ||
          appVersion.indexOf("msie 7.") != -1 ||
          appVersion.indexOf("msie 8.") != -1 ||
          appVersion.indexOf("msie 9.") != -1 ||
          appVersion.indexOf("msie 10.") != -1
        ) {
          self.text_light_height =
            Number(
              getStyle.lineHeight *
                parseFloat($($this[i]).css("font-size").replace("px", ""))
            ) / self.text_font_size;
        }
        //IE以外のとき
      } else {
        self.text_light_height =
          Number($($this[i]).css("line-height").replace("px", "")) /
          self.text_font_size;
      }
      //Windowサイズの測定（PC時）
      if (window_size === "pc") {
        if (self.text_h_row_pc != "") {
          //テキストの高さ > フォントサイズ * 行高　* テキストの行数制限
          var text_max_h =
            self.text_font_size * self.text_light_height * self.text_h_row_pc +
            1;

          //テキストの行数が上限より上の場合
          if (text_h > text_max_h) {
            self.texthide($this[i], text_max_h, self.text_h_row_pc);
          } else {
            self.texthideReset($this[i]);
            self.moreRemove($this[i]);
          }
        }
        //Windowサイズの測定（SP時）
      } else {
        if (self.text_h_row_sp != "") {
          //テキストの高さ > フォントサイズ * 行高　* テキストの行数制限
          var text_max_h =
            self.text_font_size * self.text_light_height * self.text_h_row_sp +
            1;
          //テキストの行数が上限より上の場合

          if (text_h > text_max_h) {
            self.texthide($this[i], text_max_h, self.text_h_row_sp);
          } else {
            self.texthideReset($this[i]);
            self.moreRemove($this[i]);
          }
        }
      }
    }
    //Windowサイズの測定（PC時）
    if (window_size === "pc") {
      if (pc_spflag === "sp" || pc_spflag === "") {
        if (self.text_h_row_pc == "") {
          self.texthideReset($this[i]);
          self.moreRemove($this[i]);
        }
        pc_spflag = "pc";
      }
    } else {
      if (pc_spflag === "pc" || pc_spflag === "") {
        pc_spflag = "sp";

        if (self.text_h_row_sp == "") {
          self.texthideReset($this[i]);
          self.moreRemove($this[i]);
        }
      }
    }
  }
};

TextHeightFun.prototype.loadshow = function ($this) {
  var self = this;
  var pc_spflag = "";
  var text_h = "";
  pc_spflag = "";
  if ($($this).find("." + self.three__text__js__className).length === 0) {
    text_h = $this.offsetHeight;
  } else {
    self.texthideReset($this);
    text_h = $($this).find("." + self.three__text__js__className)[0]
      .offsetHeight;
  }

  self.text_font_size = Number($($this).css("fontSize").replace("px", ""));
  //IEのとき
  if (userAgent.indexOf("msie") != -1) {
    if (
      appVersion.indexOf("msie 6.") != -1 ||
      appVersion.indexOf("msie 7.") != -1 ||
      appVersion.indexOf("msie 8.") != -1 ||
      appVersion.indexOf("msie 9.") != -1 ||
      appVersion.indexOf("msie 10.") != -1
    ) {
      self.text_light_height =
        Number(
          getStyle.lineHeight *
            parseFloat($($this).css("font-size").replace("px", ""))
        ) / self.text_font_size;
    }
    //IE以外のとき
  } else {
    self.text_light_height =
      Number($($this).css("line-height").replace("px", "")) /
      self.text_font_size;
  }
  //Windowサイズの測定（PC時）
  if (window_size === "pc") {
    if (self.text_h_row_pc != "") {
      //テキストの高さ > フォントサイズ * 行高　* テキストの行数制限
      var text_max_h =
        self.text_font_size * self.text_light_height * self.text_h_row_pc + 1;

      //テキストの行数が上限より上の場合
      if (text_h > text_max_h) {
        self.textshow($this, text_max_h, self.text_h_row_pc);
      }
    }
    //Windowサイズの測定（SP時）
  } else {
    if (self.text_h_row_sp != "") {
      //テキストの高さ > フォントサイズ * 行高　* テキストの行数制限
      var text_max_h =
        self.text_font_size * self.text_light_height * self.text_h_row_sp + 1;
      //テキストの行数が上限より上の場合

      if (text_h > text_max_h) {
        self.textshow($this, text_max_h, self.text_h_row_sp);
      }
    }
  }
  //高さ揃え リセット
  matchheightRemoveFun();
  //高さ揃え
  matchheightFun();
};

TextHeightFun.prototype.textshow = function ($this, text_max_h, text_h_row) {
  var self = this;
  var clone_element = $this.innerHTML;

  $this.innerHTML =
    '<span class="' +
    self.three__text__className +
    " " +
    self.three__text__js__className +
    '">' +
    clone_element +
    "</span>";

  $($this).append(
    '<span class="' +
      self.three__more__btn__className +
      " " +
      self.three__more__btn__js__className +
      '"><a class="is-noscroll" href="#">' +
      self.btnText[1] +
      "</a></span>"
  );
  $($this).addClass(self.open__className);

  //高さ揃え リセット
  matchheightRemoveFun();
  //高さ揃え
  matchheightFun();
};

TextHeightFun.prototype.texthide = function ($this, text_max_h, text_h_row) {
  var self = this;
  var clone_element = $this.innerHTML;

  if ($($this).find("." + self.three__text__className).length === 0) {
    $this.style.opacity = 1;
    $this.innerHTML =
      '<span class="' +
      self.three__text__className +
      " " +
      self.three__text__js__className +
      '" style="height:' +
      text_max_h +
      "px; -webkit-line-clamp:" +
      text_h_row +
      ';">' +
      clone_element +
      "</span>";
  } else {
    if ($($this).find("." + self.three__text__js__className)) {
      $($this)
        .find("." + self.three__text__js__className)
        .css({
          height: text_max_h + "px",
          "-webkit-line-clamp": text_h_row,
        });
    }
  }

  if (
    self.btnText !== undefined &&
    $($this).find("." + self.three__more__btn__js__className).length === 0
  ) {
    $($this).append(
      '<span class="' +
        self.three__more__btn__className +
        " " +
        self.three__more__btn__js__className +
        '"><a class="is-noscroll" href="#">' +
        self.btnText[0] +
        "</a></span>"
    );
  }

  //高さ揃え リセット
  matchheightRemoveFun();
  //高さ揃え
  matchheightFun();
};

TextHeightFun.prototype.texthideAnimate = function (
  $this,
  text_max_h,
  text_h_row
) {
  var self = this;
  var clone_element = $this.innerHTML;

  if ($($this).find("." + self.three__text__js__className)) {
    //現在の高さ算出
    var curHeight = $($this)
      .find("." + self.three__text__js__className)
      .height();

    $($this)
      .find("." + self.three__text__js__className)
      .height(curHeight)
      .animate(
        {
          height: text_max_h + "px",
        },
        self.speed,
        function () {
          $(this).css({
            "-webkit-line-clamp": text_h_row,
          });
        }
      );
  }

  if (
    self.btnText !== undefined &&
    $($this).find("." + self.three__more__btn__js__className).length !== 0
  ) {
    $($this).find(
      "." + self.three__more__btn__js__className + " > a "
    )[0].text = self.btnText[0];
  }

  //高さ揃え リセット
  matchheightRemoveFun();
  //高さ揃え
  matchheightFun();
};

TextHeightFun.prototype.texthideReset = function ($this) {
  var self = this;

  if ($($this).find("." + self.three__text__js__className).length > 0) {
    $($this)
      .find("." + self.three__text__js__className)
      .css({
        height: "",
        "-webkit-line-clamp": "",
      });
  }
};

TextHeightFun.prototype.moreRemove = function ($this) {
  var self = this;
  if (
    self.btnText !== undefined &&
    $($this).find("." + self.three__more__btn__js__className).length > 0
  ) {
    $($this)
      .find("." + self.three__more__btn__js__className)
      .remove();
    //open用のClassが付与されているとき
    if ($($this).hasClass(self.open__className)) {
      //open用のClassを削除
      $($this).removeClass(self.open__className);
    }
  }
};

function TextBoxHeightFun(textboxWrapName, box_row, btnText) {
  this.parameterName = "morebox"; //パラメータ：URLの取得名
  this.textboxWrapName = textboxWrapName;
  this.$textboxWrap = document.querySelectorAll(this.textboxWrapName);
  this.box_row = new String(box_row); //テキストの最大個数
  this.btnText = btnText; //ボタンの有無（テキストを配列）

  this.more__box__wrap__className = "more-box-wrap";
  this.more__box__wrap__js__className = "js-more-box-wrap";
  this.three__more__btn__className = "three-point-more-btn";
  this.three__more__box__btn__js__className = "js-three-point-more-box-btn";
  this.three__more__btn__js__class =
    "." + this.three__more__box__btn__js__className + " > a";
  this.open__className = "is-open";
  this.show__className = "is-show";
  this.speed = 200;
  this.text_font_size;
  this.text_light_height;
  this.init();
}

TextBoxHeightFun.prototype.init = function () {
  var self = this;
  if (self.$textboxWrap.length > 0) {
    //URLパラメーターに、self.parameterNameが含まれているか
    var parameter = getQueryString(self.parameterName);
    if (parameter !== null) {
      //パラメーターに「,」が含まれていないとき
      if (parameter.indexOf(",") === -1) {
        //パラメーターとIDが一致するとき
        if ($("#" + parameter).length > 0) {
          //ページローディング時に開閉する場合の処理を実行
          self.loadshow($("#" + parameter)[0]);
        }
        //パラメーターに「,」が含まれているとき
      } else {
        //「,」配列に格納
        var parameterArray_set = parameter.split(",");

        var parameterArray = parameterArray_set.filter(function (ele, pos) {
          return parameterArray_set.indexOf(ele) == pos;
        });

        //配列でループする
        for (var i = 0; i < parameterArray.length; i++) {
          var parameterCurrnt = parameterArray[i];
          //配列毎に開閉処理を実行
          self.loadshow($("#" + parameterCurrnt)[0]);
        }
      }
    }

    //設定
    self.set();

    if (self.btnText !== undefined) {
      $("body").on("click", self.three__more__btn__js__class, function (e) {
        var $this = $(this).parent().parent();
        if (!$($this).hasClass(self.open__className)) {
          //本来の高さ算出
          $($this)
            .find("." + self.more__box__wrap__js__className)
            .css({
              height: "auto",
            });
          //auto用の高さを算出
          var autoHeight = $($this)
            .find("." + self.more__box__wrap__js__className)
            .height();
          //現在の高さ
          $($this)
            .find("." + self.more__box__wrap__js__className)
            .css({
              height: "",
            });

          //現在の高さ算出
          var curHeight = $($this)
            .find("." + self.more__box__wrap__js__className)
            .height();
          //開閉用Classを付与
          $($this).addClass(self.open__className);
          //開閉用アニメ―ション
          $($this)
            .find("." + self.more__box__wrap__js__className)
            .height(curHeight)
            .animate({ height: autoHeight }, self.speed, function () {
              $($this)
                .find("." + self.more__box__wrap__js__className)
                .addClass(self.show__className);
              //現在の高さ
              $($this)
                .find("." + self.more__box__wrap__js__className)
                .css({
                  height: "",
                });
            });

          //閉じる用のテキストを変更
          $($this).find(
            "." + self.three__more__box__btn__js__className + " > a "
          )[0].text = self.btnText[1];

          //高さ揃え リセット
          matchheightRemoveFun();
          //高さ揃え
          matchheightFun();
        } else {
          //現在の高さ算出
          var curHeight = $($this)
            .find("." + self.more__box__wrap__js__className)
            .height();
          $($this)
            .find("." + self.more__box__wrap__js__className)
            .removeClass(self.show__className);
          //開閉用アニメ―ション
          $($this)
            .find("." + self.more__box__wrap__js__className)
            .height(curHeight)
            .animate({ height: 0 }, self.speed, function () {
              //開閉用Classを削除
              $($this).removeClass(self.open__className);
            });

          //開く用のテキストを変更
          $($this).find(
            "." + self.three__more__box__btn__js__className + " > a "
          )[0].text = self.btnText[0];
        }

        e.preventDefault();
      });
    }
  }
};

TextBoxHeightFun.prototype.loadshow = function ($this) {
  var self = this;
  var clone_element = "";
  var clone_wrap_element = "";
  var $textbox = $this.children;
  var textbox_num = $textbox.length;
  //テキストの要素が、self.box_rowを上回るとき
  if (textbox_num > self.box_row) {
    for (var i = 0; i < textbox_num; i++) {
      if (i >= self.box_row) {
        clone_wrap_element += $textbox[i].cloneNode(true).outerHTML;
      } else {
        clone_element += $textbox[i].cloneNode(true).outerHTML;
      }
    }
    $this.innerHTML =
      clone_element +
      '<div class="' +
      self.more__box__wrap__className +
      " " +
      self.more__box__wrap__js__className +
      '">' +
      clone_wrap_element +
      "</div>";

    $($this).addClass(self.open__className);
    $($this)
      .find("." + self.more__box__wrap__js__className)
      .addClass(self.show__className);

    //閉じるテキストを追加
    $($this).append(
      '<span class="' +
        self.three__more__btn__className +
        " " +
        self.three__more__box__btn__js__className +
        '"><a class="is-noscroll" href="#">' +
        self.btnText[1] +
        "</a></span>"
    );
  }
  //高さ揃え リセット
  matchheightRemoveFun();
  //高さ揃え
  matchheightFun();
};

TextBoxHeightFun.prototype.set = function () {
  var self = this;
  var $textbox;
  var textbox_num;
  for (var i = 0; i < self.$textboxWrap.length; i++) {
    //開くClassがないとき
    if (!$(self.$textboxWrap[i]).hasClass(self.open__className)) {
      textbox_num = self.$textboxWrap[i].children.length;

      //ボックスの個数が上限より上の時
      if (textbox_num > self.box_row) {
        self.boxhide(self.$textboxWrap[i], self.box_row);
      }
    }
  }
};

TextBoxHeightFun.prototype.boxhide = function ($this, box_row) {
  var self = this;
  var clone_element = "";
  var clone_wrap_element = "";
  var $children = $this.children;
  for (var i = 0; i < $children.length; i++) {
    if (i >= box_row) {
      clone_wrap_element += $children[i].cloneNode(true).outerHTML;
    } else {
      clone_element += $children[i].cloneNode(true).outerHTML;
    }
  }
  if ($($this).find("." + self.more__box__wrap__className).length === 0) {
    $this.style.opacity = 1;
    $this.innerHTML =
      clone_element +
      '<div class="' +
      self.more__box__wrap__className +
      " " +
      self.more__box__wrap__js__className +
      '">' +
      clone_wrap_element +
      "</div>";
  }

  if (
    self.btnText !== undefined &&
    $($this).find("." + self.three__more__box__btn__js__className).length === 0
  ) {
    $($this).append(
      '<span class="' +
        self.three__more__btn__className +
        " " +
        self.three__more__box__btn__js__className +
        '"><a class="is-noscroll" href="#">' +
        self.btnText[0] +
        "</a></span>"
    );
  }

  //高さ揃え リセット
  matchheightRemoveFun();
  //高さ揃え
  matchheightFun();
};

/*------------------------------------------------------------
  モーダル関連
------------------------------------------------------------*/
/*------------------------------------------------------------
  モーダルを削除するときの処理　共通処理
------------------------------------------------------------*/
function ModalFun() {
  this.fadeSpeed = 200; //モーダルの表示スピード
  this.target__link__click__ClassName = "js-target-header-click"; //headerの吹き出し表示用のリンク
  this.target__link__ClassName = "js-target-header-link"; //開閉リンクをクリック
  this.target__link__item__ClassName = "js-target-header-item"; //開閉リンク
  this.header__check__icon__hamburger__ClassName =
    "js-header-check-icon-hamburger"; //チェックボックス
  this.modal__close__ClassName = "js-modal_close"; //モーダルを閉じるボタン
  this.pop_js__ClassName = "js-pop-up"; //ポップアップ用のリンク[HTMLに付与する共通Class]
  this.init();
}
//モーダルを削除するとき　共通関数
//モーダルの背景以外をクリックしたら削除
ModalFun.prototype.init = function () {
  var self = this;

  //モーダル非表示
  $("body").on("click", function (e) {
    //モーダル用のテキストリンク以外をクリック時
    if (
      !e.target.closest("." + movie__inner__ClassName) &&
      !e.target.closest("." + self.header__check__icon__hamburger__ClassName) &&
      !e.target.closest("." + self.target__link__click__ClassName) &&
      !e.target.closest("." + self.target__link__ClassName) &&
      !e.target.closest("." + self.target__link__item__ClassName) &&
      !e.target.closest("." + self.pop_js__ClassName)
    ) {
      //モーダルが1つ以上存在する場合
      if ($("." + js_bg_modalClassName).length > 0) {
        //ページscrollを解除
        scroll_yes();
        //モーダルを解除（フェードアウトし、HTMLを削除））
        $("." + js_bg_modalClassName).fadeOut(self.fadeSpeed, function () {
          $("." + js_bg_modalClassName).remove();
          $(tabindex_before).focus();
          modal_showflag = false;
        });
      }
    }
  });

  //モーダル非表示
  $("body").on("click", "." + self.modal__close__ClassName, function (e) {
    //モーダルが1つ以上存在する場合
    if ($("." + js_bg_modalClassName).length > 0) {
      //ページscrollを解除
      scroll_yes();
      //モーダルを解除（フェードアウトし、HTMLを削除））
      $("." + js_bg_modalClassName).fadeOut(self.fadeSpeed, function () {
        $("." + js_bg_modalClassName).remove();
        $(tabindex_before).focus();
        modal_showflag = false;
      });
    }
  });

  $("body").on("keydown", "." + self.modal__close__ClassName, function () {
    if (event.keyCode == 13) {
      //モーダルがなければ実行
      if ($("." + js_bg_modalClassName).length > 0) {
        //ページscrollを解除
        scroll_yes();
        //モーダルを解除（フェードアウトし、HTMLを削除））
        $("." + js_bg_modalClassName).fadeOut(self.fadeSpeed, function () {
          $("." + js_bg_modalClassName).remove();
          $(tabindex_before).focus();
          modal_showflag = false;
        });
      }
    }
  });
};

/*------------------------------------------------------------
  ポップアップjs
  ※モーダルの削除処理は、ModalFun()と組み合わせて使用します。
------------------------------------------------------------*/
function ModalPopUpFun() {
  this.pop__up__ClassName = "js-pop-up";
  this.$pop = $("." + this.pop__up__ClassName); //モーダルのリンクのClass
  this.pop__up__html__ClassName = "js-pop-up-html";
  this.modal_set = ""; //モーダル　HTMLを代入する変数
  this.modal_setClass = "js-modal-movie modal-movie"; //動画用のモーダルに付与するClass
  this.modal_iframe_setClassName = "js-modal-iframe modal-iframe"; //動画のiframeに付与するクラス
  this.fadeSpeed = 200; //fadeのスピード
  this.modalMenuElements =
    ".js-modal_close, a, button, input, textarea, [tabindex]";
  this.init();
}
//初期設定
ModalPopUpFun.prototype.init = function () {
  var self = this;
  //モーダル[動画]のリンクのClassがあるとき
  if (self.$pop.length > 0) {
    for (var i = 0; i < self.$pop.length; i++) {
      $(self.$pop[i]).attr("tabindex", 0);
    }
    self.event();
  }
};
ModalPopUpFun.prototype.event = function () {
  var self = this;

  $(document).keydown(function (e) {
    self.focusEvent(e);
  });
  self.$pop.on("click", function (e) {
    tabindex_before = document.activeElement; //前回のTABのアクティブなものを格納

    //ページscrollを禁止
    scroll_no();
    //初期値設定
    self.set($(this));
    self.focusCliclkEvent(e);
    //イベント処理停止
    e.preventDefault();
  });

  self.$pop.keydown(function (e) {
    if (e.keyCode == 13) {
      tabindex_before = document.activeElement; //前回のTABのアクティブなものを格納

      //ページscrollを禁止
      scroll_no();
      //モーダルがなければ実行
      if ($("." + bg_modalClassName).length === 0) {
        //初期値設定
        self.set($(this));
        self.focusCliclkEvent(e);
      }
    }
  });
};

ModalPopUpFun.prototype.focusEvent = function (event) {
  var self = this;
  var $modalMenuElements = $("." + js_bg_modalClassName).find(
    self.modalMenuElements
  );
  // モーダルメニュー内でフォーカスを当てたい要素リスト
  // キーイベント
  var firstEl = $modalMenuElements[0];
  // タブキーを押されたかどうか
  var tabKey = 9 === event.keyCode;
  // Shiftキーが押されているかどうか
  var shiftKey = event.shiftKey;
  // モーダルメニュー内でフォーカスを当てたい最後の要素
  var lastEl = $modalMenuElements[$modalMenuElements.length - 1];

  if ($(".js-modal").length > 0) {
    // フォーカスが当たっている要素
    var activeEl = document.activeElement;

    // モーダルメニュー内でフォーカスを当てたい最初の要素
    if (modal_showflag === false) {
      //クローズボタン以外があるとき
      if ($modalMenuElements.length > 1) {
        $($modalMenuElements[1]).focus();
        //クローズボタンのみ
      } else {
        $($modalMenuElements[0]).focus();
      }
      modal_showflag = true;
    } else {
      // 最後の要素でタブキーが押された場合は、最初の要素にフォーカスを当てる
      if (!shiftKey && tabKey && lastEl === activeEl) {
        event.preventDefault();
        firstEl.focus();
      }

      // 最初の要素でタブキー+Shiftキーが押された場合は、最後の要素にフォーカスを当てる
      if (shiftKey && tabKey && firstEl === activeEl) {
        event.preventDefault();
        lastEl.focus();
      }
    }
  } else {
    if (self.flag === true) {
      self.flag = false;
    }
  }
};

ModalPopUpFun.prototype.focusCliclkEvent = function (event) {
  var self = this;
  var $modalMenuElements = $("." + js_bg_modalClassName).find(
    self.modalMenuElements
  );

  //クローズボタン以外があるとき
  if ($modalMenuElements.length > 1) {
    $($modalMenuElements[1]).focus();
    ///kagakukan/pr_form_j.htm以下、住所表示挿入のあるとき、住所登録用の領域が表示されているか
    if ($($modalMenuElements[1]).parents(".js-box-done")) {
      ///kagakukan/pr_form_j.htm以下、住所表示挿入のあるとき、住所登録用の領域が表示されていないとき
      if (
        $($modalMenuElements[1]).parents(".js-box-done")[0].style.display ===
        "none"
      ) {
        $($modalMenuElements[0]).focus();
      }
    }
    //クローズボタンのみ
  } else {
    $($modalMenuElements[0]).focus();
  }
  modal_showflag = true;
};

//設定
ModalPopUpFun.prototype.set = function ($this) {
  var self = this;

  if ($($this).find("." + self.pop__up__html__ClassName).length > 0) {
    self.modal_set = $($this)
      .find("." + self.pop__up__html__ClassName)[0]
      .cloneNode(true);

    //モーダルhtmlを挿入
    var modalhtml =
      '<div class="' +
      bg_modalClassName +
      " " +
      js_bg_modalClassName +
      '"><div class="modal__wrap"><div class="modal_close__wrap"><div class="js-modal_close modal_close" tabindex="0"><span></span><span></span></div></div><div class="' +
      movie__inner__ClassName +
      '"></div></div></div>';
    $("body").append(modalhtml);
    //モーダルHTMLに、動画用のClassを付与
    $("." + js_bg_modalClassName).addClass(self.modal_setClass);
    //modalの中身に動画用のhtmlを挿入
    $($("." + movie__inner__ClassName)[0]).append(self.modal_set);
    //モーダルHTMLをwrap

    $(self.modal_set).wrapAll(
      '<div class="' + self.modal_iframe_setClassName + '"></div>'
    );

    //モーダル表示
    $($("." + js_bg_modalClassName)[0]).fadeIn(self.fadeSpeed);
  }
};

/*------------------------------------------------------------
　グローバルヘッダー(PC)
  リンクをクリックした際:吹き出し表示のリンク表示
  
  hover要素のclass
  js-target-link-click-hover
  開くターゲットに指定しておくための、class名(hover以外のときに非表示にするために必要)
  js-target-link-click-item
------------------------------------------------------------*/
function TargetLinkHeaderFun() {
  //hover要素を取得
  this.targetLinkClassName = "js-target-header-click";
  this.$targetLink = document.querySelectorAll("." + this.targetLinkClassName);
  //data-name=xxxx xxxxを指定する用の要素を取得
  this.dataName = "data-name";
  this.$dataName = document.querySelectorAll("[" + this.dataName + "]");
  //開く状態時のClass
  this.openClassName = "is-open";
  //開くターゲットに指定しておくための、class名(hover以外のときに非表示にするために必要)
  this.targetLinkClickItemClass = "js-target-header-click-item";
  this.$targetLinkClickItem = document.querySelectorAll(
    "." + this.targetLinkClickItemClass
  );
  //グレースケール要に必要(jsで代入するClass)
  this.gHeader__menuOnPcClassName = "g-header__menu-on-pc";
  //表示のスピード
  this.speed = 100;
  //SP時の初回切り替え用フラグ
  this.sp_first_flag = true;
  //初期設定
  this.init();
}
//初期設定
TargetLinkHeaderFun.prototype.init = function () {
  var self = this;
  self.event();
};
//イベントの登録
TargetLinkHeaderFun.prototype.event = function () {
  var self = this;
  //スクロール時
  $(window).on("scroll", function (e) {
    self.set();
  });
  //リサイズ時
  $(window).on("resize", function (e) {
    //SP初回切り替え時
    if (window_size === "sp" && self.sp_first_flag === true) {
      //設定を全てリセット
      self.reset();
      self.sp_first_flag === false;
      //PC初回切り替え時
    } else if (window_size === "pc" && self.sp_first_flag === false) {
      self.sp_first_flag === true;
      self.set();
      //PC時かつPC初回切り替え時以外
    } else if (window_size === "pc" && self.sp_first_flag === true) {
      self.set();
      //その他
    } else {
    }
  });

  $("body").on("click", function (e) {
    //モーダル用のテキストリンク以外をクリック時
    if (!e.target.closest("." + self.targetLinkClassName)) {
      //設定を全てリセット
      self.reset();
    }
  });

  for (var i = 0; i < self.$targetLink.length; i++) {
    var current = self.$targetLink[i]; //ターゲットのリンクにマウスがある
    var $this = "";
    //currentをクリック時
    $(current).on("click", function (e) {
      $this = $(this);
      var view_flag = true;
      if ($this.hasClass(self.openClassName)) {
        view_flag = false;
      }
      //クリックされたリンクが開いている場合は表示
      for (var i = 0; i < self.$targetLink.length; i++) {
        var targetLink = self.$targetLink[i]; //ターゲットのリンクにマウスがある
        if ($(targetLink).hasClass(self.openClassName)) {
          self.hide($(targetLink));
        }
      }

      if (view_flag === true) {
        //表示位置
        self.set();
        //表示処理
        self.fade($this);
      } else {
        self.reset();
      }

      //リンクタグの本来の動作を停止
      e.preventDefault();
    });
  }
};
//リセット
TargetLinkHeaderFun.prototype.reset = function () {
  var self = this;
  for (var i = 0; i < self.$targetLink.length; i++) {
    var targetLink = self.$targetLink[i]; //ターゲットのリンクにマウスがある
    self.hide($(targetLink));
  }
  //ページscrollを禁止を解除
  scroll_yes();
};
//要素の位置を設定
TargetLinkHeaderFun.prototype.set = function () {
  var self = this;
  for (var i = 0; i < self.$targetLinkClickItem.length; i++) {
    var current = self.$targetLinkClickItem[i];
    var currentDataName = current.getAttribute(self.dataName);
    for (var z = 0; z < self.$targetLink.length; z++) {
      var targetLinkHref = self.$targetLink[z]
        .getAttribute("href")
        .replace("#", "");
      if (currentDataName === targetLinkHref) {
        //positionで吹き出しリンクを設置する(left,top)代入
        var thisGetBoundingClientRect =
          self.$targetLink[z].getBoundingClientRect();
        current.style.minWidth = $(self.$targetLink[z]).innerWidth() + "px";
        //吹き出し表示の要素：leftを指定
        current.style.left =
          thisGetBoundingClientRect.left -
          $(current).innerWidth() / 2 +
          $(self.$targetLink[z]).innerWidth() / 2 +
          "px";
        //吹き出し表示の要素：topを指定
        current.style.top = thisGetBoundingClientRect.bottom + "px";
      }
    }
  }
};
//要素を表示対応にする
TargetLinkHeaderFun.prototype.fade = function ($this) {
  var self = this;
  $this.addClass(self.openClassName);
  var hrefTarget = $this[0].getAttribute("href").replace("#", "");

  //data-name ループ
  for (var i = 0; i < self.$dataName.length; i++) {
    //data-name
    var current = self.$dataName[i];
    //data-nameの値を取得
    var currentDataName = current.getAttribute(self.dataName);
    //currentDataNameとhrefTargetが一致するとき
    if (currentDataName === hrefTarget) {
      //heightにautoを指定
      current.style.height = "auto";
      //高さを指定
      var currentH = current.offsetHeight + "px";
      //heightをリセット
      current.style.height = "0";
      current.style.visibility = "visible";

      //高さをcurrentHに変更
      $(current).stop().animate(
        {
          height: currentH,
        },
        self.speed,
        "swing"
      );
    }
  }

  //ページscrollを禁止
  scroll_no();

  //モーダルの背景追加
  if ($("body").find("." + js_bg_modalClassName).length === 0) {
    $("body").append(
      '<div class="' +
        self.gHeader__menuOnPcClassName +
        " " +
        bg_modalClassName +
        " " +
        js_bg_modalClassName +
        '"></div>'
    );

    $("." + self.gHeader__menuOnPcClassName).on("click", function (e) {
      for (var i = 0; i < self.$targetLink.length; i++) {
        var current = self.$targetLink[i]; //ターゲットのリンクにマウスがある
        self.hide($(current));
      }
    });
  }
};
//要素を非表示対応にする
TargetLinkHeaderFun.prototype.hide = function ($this) {
  var self = this;
  //$thisがあるとき
  if ($this) {
    //開く状態のクラスを削除
    $this.removeClass(self.openClassName);
  }

  if ($("." + self.gHeader__menuOnPcClassName).length) {
    //self.gHeader__menuOnPcClassName削除
    $("." + self.gHeader__menuOnPcClassName).remove();
  }

  var current = self.$targetLinkClickItem;
  //currentが存在するとき
  if (current) {
    //height 0

    $(current)
      .stop()
      .animate(
        {
          height: 0,
        },
        self.speed,
        "swing",
        function () {
          $(this).css({
            visibility: "",
            left: "",
            top: "",
          });
        }
      );
  }
};

/*------------------------------------------------------------
  //グローバルヘッダー(SP)：開閉リンク
  要素の開閉（高さ0⇒本来の高さ）
------------------------------------------------------------*/
function TargetHeaderLinkFun() {
  this.targetLinkClassName = "js-target-header-link"; //リンクのclass名
  this.$targetLink = document.querySelectorAll("." + this.targetLinkClassName);
  this.dataName = "data-name"; //データ名（[data-name="xxxxxxx"]）
  this.$dataName = document.querySelectorAll("[" + this.dataName + "]");
  this.openClassName = "is-open"; //開いた時のclass付与
  this.speed = 500; //開閉速度
  this.sp_first_flag = true; //SP時の初回切り替え用フラグ
  if (this.$targetLink.length > 0) {
    this.init();
  }
}
//初期値の設定
TargetHeaderLinkFun.prototype.init = function () {
  var self = this;
  self.event();
};
//イベントの設定
TargetHeaderLinkFun.prototype.event = function () {
  var self = this;

  //リサイズ時
  $(window).on("resize", function (e) {
    //SP初回切り替え時
    if (window_size === "sp" && self.sp_first_flag === false) {
      self.sp_first_flag === false;
      //PC初回切り替え時
    } else if (window_size === "pc" && self.sp_first_flag === true) {
      self.sp_first_flag === false;
      //ハンバーガーメニュー表示をリセット
      self.reset();
      //その他
    } else {
    }
  });

  for (var i = 0; i < self.$targetLink.length; i++) {
    var current = self.$targetLink[i];
    //self.$targetLink をクリックしたとき
    $(current).on("click", function (e) {
      //開いた際のclassが付与されていないとき
      if (!$(this).hasClass(self.openClassName)) {
        //fadeの処理、開いた際のclassを付与
        self.fade($(this));
      } else {
        //hideの処理、開いた際のclassを削除
        self.hide($(this));
      }
      //リンクタグ本来の動作を停止
      e.preventDefault();
    });
  }
};
//リセット
TargetHeaderLinkFun.prototype.reset = function () {
  var self = this;
  for (var i = 0; i < self.$targetLink.length; i++) {
    var current = self.$targetLink[i];
    self.hide($(current));
  }
};
//ターゲットのfade用の処理を記載
TargetHeaderLinkFun.prototype.fade = function ($this) {
  var self = this; //クリックされた要素のターゲットを取得

  var hrefTarget = $this[0].getAttribute("href").replace("#", ""); //要素があるとき、リンクの開いた際のクラスを付与とheight0⇒xxx
  $this.addClass(self.openClassName);

  for (var i = 0; i < self.$dataName.length; i++) {
    var current = self.$dataName[i];
    var currentDataName = current.getAttribute(self.dataName);
    if (currentDataName === hrefTarget) {
      //本来の高さを取得するためにauto
      current.style.height = "auto"; //本来の高さを入力

      var currentH = current.offsetHeight + "px"; //高さを戻す

      $(current).css({
        height: 0,
        visibility: "visible",
      });
      $(current).stop().animate(
        {
          height: currentH,
        },
        self.speed
      );
    }
  }
};

//ターゲットのhide用の処理を記載
TargetHeaderLinkFun.prototype.hide = function ($this) {
  var self = this;
  var hrefTarget = $this[0].getAttribute("href").replace("#", ""); //クリックされた要素のターゲットを取得

  var current = document.querySelectorAll(
    "[" + self.dataName + "=" + hrefTarget + "]"
  ); //要素があるとき、height⇒0と、リンクの開いた際のクラスを削除

  if (current) {
    //0の高さまで、animate
    $(current)
      .stop()
      .animate({ height: 0 }, self.speed, function () {
        if ($this.hasClass(self.openClassName)) {
          // Animation complete.
          $this.removeClass(self.openClassName);
          $(current).css({
            visibility: "",
          });
        }
      });
  }
};

/*------------------------------------------------------------
  ハンバーガーメニューをクリックしたときの動作＋リサイズ、開閉に伴うメニューの高さ調整
  グローバルヘッダー(SP)
------------------------------------------------------------*/
function GMenuSPFun() {
  this.hamburgerClassName = "js-header-check-icon-hamburger";
  this.gHeader__menuOnSpClassName = "g-header__menu-on-sp";
  this.$hamburger = $("." + this.hamburgerClassName);
  this.pc_first_flag = true;
  this.init();
}
//初期設定
GMenuSPFun.prototype.init = function () {
  var self = this;
  //self.$hamburgerが存在するとき
  if (self.$hamburger.length > 0) {
    self.event();
  }
};
//イベントの設定
GMenuSPFun.prototype.event = function () {
  var self = this;
  window.addEventListener("resize", function (e) {
    //PC時（切り替わった時のみ）
    if (window_size === "pc" && self.pc_first_flag === false) {
      //ハンバーガーのチェックボックスをfalseに変更
      self.$hamburger.prop("checked", false);
      //モーダルの背景削除
      $("." + self.gHeader__menuOnSpClassName).remove();
      //PC時のフラグをtrueに変更
      self.pc_first_flag = true;
      //SPC時（切り替わった時のみ）
    } else if (window_size === "sp" && self.pc_first_flag === true) {
      //PC時のフラグをfalseに変更
      self.pc_first_flag = false;
    } else {
    }
  });
  //リンクをクリックしたとき
  $(self.$hamburger).on("click", function (e) {
    if ($(this).prop("checked")) {
      //ハンバーガーメニュー表示
      self.fade();
    } else {
      //ハンバーガーメニュー非表示
      self.hide();
    }
  });
};
//ハンバーガーメニューの表示
GMenuSPFun.prototype.fade = function () {
  var self = this;

  //モーダルの背景追加
  if ($("body").find("." + js_bg_modalClassName).length === 0) {
    $("body").append(
      '<div class="' +
        self.gHeader__menuOnSpClassName +
        " " +
        bg_modalClassName +
        " " +
        js_bg_modalClassName +
        '"></div>'
    );

    //モーダルをクリック
    $("." + self.gHeader__menuOnSpClassName).on("click", function (e) {
      //ハンバーガーメニュー表示をリセット
      self.reset();
    });
  }
};

//ハンバーガーメニューの非表示
GMenuSPFun.prototype.hide = function () {
  var self = this;
  //モーダルの背景削除
  $("." + self.gHeader__menuOnSpClassName).remove();
};

//リセット
GMenuSPFun.prototype.reset = function () {
  var self = this;
  //チェックを外す
  $(self.$hamburger).prop("checked", false);
  //モーダルの背景削除
  self.hide();
};

/*------------------------------------------------------------
  開閉ボタン、開閉エリア
  ページローディング（URLパラメーターで開くorボタンクリックで開閉）
------------------------------------------------------------*/
function ToggleFun(btn, speed, mode) {
  //パラメータ：URLの取得名
  this.parameterName = "toggle";
  this.togglelinkClassName = "js-toggle-link";
  this.mode = mode; //PC/SPの未実装
  this.$togglelink = $("." + this.togglelinkClassName);
  this.togglelinkTarget = "data-toggle-target"; //ページ内、タブ切替用（ターゲット）
  this.toggle_noscrollClassName = "is-toggle-noscroll"; //リンク停止をやめる
  this.js_page_link_selectClassName = "js-page-link-select"; //ページスクロール（select）用のClass
  this.$js_page_link_select = $("." + this.js_page_link_selectClassName);
  //リンク全体の要素を取得
  this.btnClass = btn;
  this.$btn = $(this.btnClass);
  //表示用のクラス名
  this.openClass = "is-open";
  //開閉スピード
  this.speed = speed;
  this.categoryName = "";
  //初期設定
  this.init();
}
//初期設定
ToggleFun.prototype.init = function () {
  var self = this;

  //mode（PC、SPの指定がないか）、windowサイズが合致しているとき
  if (self.mode === undefined || self.mode === window_size) {
    //URLパラメーターに、self.parameterNameが含まれているか
    var parameter = getQueryString(self.parameterName);
    if (parameter !== null) {
      //パラメーターに「,」が含まれていないとき
      if (parameter.indexOf(",") === -1) {
        //パラメーターとIDが一致するとき
        if ($("#" + parameter).length > 0) {
          //ページローディング時に開閉する場合の処理を実行
          self.openfirstFun($("#" + parameter));
        }
        //パラメーターに「,」が含まれているとき
      } else {
        //「,」配列に格納
        var parameterArray_set = parameter.split(",");

        var parameterArray = parameterArray_set.filter(function (ele, pos) {
          return parameterArray_set.indexOf(ele) == pos;
        });

        //配列でループする
        for (var i = 0; i < parameterArray.length; i++) {
          var parameterCurrnt = parameterArray[i];
          //配列毎に開閉処理を実行
          self.openfirstFun($("#" + parameterCurrnt));
        }
      }
    }
  }

  //開閉ボタンがあるか
  if (self.$btn.length > 0) {
    //イベントを実行
    self.event();
  }
};

//イベント
ToggleFun.prototype.event = function () {
  var self = this;

  for (var i = 0; i < self.$btn.length; i++) {
    var $current = $(self.$btn[i]);
    //$current
    $current.on("click", function (e) {
      //mode（PC、SPの指定がないか）、windowサイズが合致しているとき
      if (self.mode === undefined || self.mode === window_size) {
        var href = $(this).attr("href"); //hrefを取得
        self.open_closeFun($(this), href); //hrefの
      }

      //リンクタグの本来の動作を停止
      if (!$(this).hasClass(this.toggle_noscrollClassName)) {
        e.preventDefault();
      }
    });
  }
  //$(self.$tab_link)クリック[ページ内に開閉用のリンクがある場合]
  $(self.$togglelink).on("click", function (e) {
    //mode（PC、SPの指定がないか）、windowサイズが合致しているとき
    if (self.mode === undefined || self.mode === window_size) {
      var href = $(this)[0].getAttribute("href");
      self.togglelinkFun($(this), href);
    }

    //リンクタグの本来の動作を停止
    e.preventDefault();
  });
};

//トグル開閉用のリンクを切り替えた時の処理処理
ToggleFun.prototype.togglelinkFun = function ($this, href) {
  var self = this;
  if ($($this).length > 0) {
    //クリックしたリンクのhrefを取得
    href = href.replace(/\?.*$/, "");
    var togglelinkTarget = $($this)[0].getAttribute(self.togglelinkTarget);
    if ($(togglelinkTarget).length > 0) {
      var togglelinkTarget_href = $(togglelinkTarget)[0].getAttribute("href");
      togglelinkTarget_href = togglelinkTarget_href.replace(/\?.*$/, "");
      //タブにカレント用のクラスを付与
      self.openFun($(togglelinkTarget), togglelinkTarget_href, function () {
        //スクロール停止用のClass
        if (!$(this).hasClass(self.toggle_noscrollClassName)) {
          pageScrollFun(href);
        }
      }); //
    }
  }
};

//ページローディング時に開閉する場合の処理
ToggleFun.prototype.openfirstFun = function ($this) {
  var self = this;
  var current = $($this)[0];

  //開いているときのClassがないとき
  if (!$this.hasClass(self.openClass)) {
    //開いているときのClassを付与
    $this.addClass(self.openClass);
    //currentが存在しているとき
    if (current) {
      //本来の高さを取得するためにauto
      current.style.height = "auto";
    }
  }
  //高さ揃え リセット
  matchheightRemoveFun();
  //高さ揃え
  matchheightFun();
};

//開閉しているか、開閉用Classの有無で判定。
//開閉のアニメーションを実行する
ToggleFun.prototype.openFun = function (
  $this,
  togglelinkTarget_href,
  open_animateFun
) {
  var self = this;
  var current = $(togglelinkTarget_href)[0];
  //開いている時：Classを付与
  $this.addClass(self.openClass);
  //currentが存在しているとき
  if (current) {
    //本来の高さを取得するためにauto
    current.style.height = "auto";
    //本来の高さを取得
    var currentH = current.offsetHeight + "px";
    //高さを戻す
    current.style.height = "";
    //currentHの高さ分開くする
    $(current)
      .stop()
      .animate(
        {
          height: currentH,
        },
        self.speed,
        "swing",
        function () {
          $(this)[0].style.height = "auto";
          if (open_animateFun !== undefined) {
            open_animateFun();
          }
          //高さ揃え リセット
          matchheightRemoveFun();
          //高さ揃え
          matchheightFun();
        }
      );
  }
};

//閉じる用のClassの有無
ToggleFun.prototype.closeFun = function ($this, href) {
  var self = this;
  var current = $(href)[0];
  if ($($this).length > 0) {
    //開閉用のClassを削除
    $this.removeClass(self.openClass);

    //currentが存在しているとき
    if (current) {
      //本来の高さを取得するためにauto
      //高さを0にする

      $(current).stop().animate(
        {
          height: 0,
        },
        self.speed,
        "swing"
      );
    }
  }
};
//開閉しているか、開閉用Classの有無で判定。
//開閉のアニメーションを実行する
ToggleFun.prototype.open_closeFun = function ($this, href) {
  var self = this;
  var current = $(href)[0];
  //開いている時：Classがないとき
  if (!$this.hasClass(self.openClass)) {
    self.openFun($this, href);
    //開いている時：Classがあるとき
  } else {
    self.closeFun($this, href);
  }
};

/*------------------------------------------------------------
  タブパネル（aタグ）用の設定
  (リンク全体の要素,タブパネル全体の要素,fadeのスピード,連動するタブがある場合は指定)
  data-category属性を指定。
  リンク全体の要素の表示用の初期値は.is-currentをhtmlタグで記載すること
  タブの全体の要素の表示用の初期値は.is-first-activeをhtmlタグで記載すること
------------------------------------------------------------*/
function TabNavFun(fadeSpeed) {
  this.parameterName = "tab"; //パラメータURLの取得名
  this.tab_linkClass = "js-page_tab-link"; //ページ内、タブ切替用リンク
  this.$tab_link = $("." + this.tab_linkClass);
  this.tab_linkTarget = "data-tab-target"; //ページ内、タブ切替用（ターゲット）
  this.tab_navClass = ".js-tab-list"; //リンク全体の要素
  this.tabArea = ".js-tab-area"; //タブパネル全体の要素
  this.dataCategory = "data-category"; //data-category=xxxxx タブ用のカテゴリ別のデータ属性
  this.$tab_navJQuery = $(this.tab_navClass);
  this.$tab_navJQuery_childe = $(this.tab_navClass).children();
  this.$tab_navJQuery_a = $(this.tab_navClass).find("a");
  this.$tabAreaJQuery = $(this.tabArea);
  this.$tabAreaDataCategory = this.$tabAreaJQuery.find(
    "[" + this.dataCategory + "]"
  );
  this.navCurrentClassName = "is-current"; //ナビのカレント用のクラス名
  this.$dataCategory = "";
  this.fadeSpeed = fadeSpeed;
  this.firstActive = "is-first-active"; //初期表示用のクラス名
  this.showClass = "is-show"; //表示用のクラス名
  this.hideClass = "is-hide"; //非表示用のクラス名
  this.dataCategoryArray = [];
  this.firstFlag = 0;
  this.init(); //初期設定
}
//初期設定
TabNavFun.prototype.init = function () {
  var self = this;

  if (self.$tabAreaJQuery.length > 0) {
    self.load(); //ロード時の処理
    self.event(); //イベント
  }
};
//ロード時の処理
TabNavFun.prototype.load = function () {
  var self = this;
  var parameter = getQueryString(self.parameterName);
  if (parameter !== null) {
    //パラメーターに「,」が含まれていないとき
    if (parameter.indexOf(",") === -1) {
      //パラメーターとIDが一致するとき
      //ページローディング時に開閉する場合の処理を実行
      var $tab_navJQuery_a_current = "";

      for (var i = 0; i < self.$tab_navJQuery_a.length; i++) {
        var link_href = $(self.$tab_navJQuery_a[i])
          .attr("href")
          .replace("#", "");

        if (link_href === parameter) {
          $tab_navJQuery_a_current = self.$tab_navJQuery_a[i];
          if (
            $($tab_navJQuery_a_current)
              .parents(self.tab_navClass)
              .find("." + self.navCurrentClassName)
          ) {
            $($tab_navJQuery_a_current)
              .parents(self.tab_navClass)
              .find("." + self.navCurrentClassName)
              .removeClass(self.navCurrentClassName);
          }
          $(self.$tab_navJQuery_a[i])
            .parent()
            .addClass(self.navCurrentClassName);
        }
      }

      //要素の表示・非表示処理
      self.fade_hide($tab_navJQuery_a_current, parameter, 1);
      //パラメーターに「,」が含まれているとき
    } else {
      var $tab_navJQuery_a_current = "";
      //「,」配列に格納
      var parameterArray_set = parameter.split(",");

      var parameterArray = parameterArray_set.filter(function (ele, pos) {
        return parameterArray_set.indexOf(ele) == pos;
      });

      //配列でループする
      for (var z = 0; z < parameterArray.length; z++) {
        var parameterCurrnt = parameterArray[z];
        //配列毎に開閉処理を実行
        $tab_navJQuery_a_current = "";
        for (var i = 0; i < self.$tab_navJQuery_a.length; i++) {
          var link_href = $(self.$tab_navJQuery_a[i])
            .attr("href")
            .replace("#", "");

          if (link_href === parameterCurrnt) {
            $tab_navJQuery_a_current = self.$tab_navJQuery_a[i];
            if (
              $($tab_navJQuery_a_current)
                .parents(self.tab_navClass)
                .find("." + self.navCurrentClassName)
            ) {
              $($tab_navJQuery_a_current)
                .parents(self.tab_navClass)
                .find("." + self.navCurrentClassName)
                .removeClass(self.navCurrentClassName);
            }
            $(self.$tab_navJQuery_a[i])
              .parent()
              .addClass(self.navCurrentClassName);
          }
        }
        //要素の表示・非表示処理
        self.fade_hide($tab_navJQuery_a_current, parameterCurrnt, 1);
      }
    }

    //高さ揃え リセット
    matchheightRemoveFun();
    //高さ揃え
    matchheightFun();
  }
};
//イベント
TabNavFun.prototype.event = function () {
  var self = this;

  //パラメーターの値取得
  function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  for (var i = 0; i < self.$tab_navJQuery_a.length; i++) {
    //タブのナビをクリックしたとき
    $(self.$tab_navJQuery_a[i]).on("click", function (e) {
      //クリックされた要素の親を取得
      var parent = this.parentNode;

      //タブのナビのカレントを削除
      $(this)
        .parents(self.tab_navClass)
        .children()
        .removeClass(self.navCurrentClassName);
      //タブにカレント用のクラスを付与
      $(parent).addClass(self.navCurrentClassName);

      //クリックしたリンクのhrefを取得
      var href = this.getAttribute("href");
      //リンクを取得し、指定されている該当のカテゴリを取得するx
      var categoryName = href.replace("#", "");
      var locationhash = location.hash;

      var locationhref = location.href;
      //パラメーターに?tab=または&tab=がないとき
      if (
        locationhref.indexOf("?" + self.parameterName + "=") === -1 &&
        locationhref.indexOf("&" + self.parameterName + "=") === -1
      ) {
        //パラメーターに?がないとき
        if (locationhref.indexOf("?") === -1) {
          locationhref += "?" + self.parameterName + "=" + categoryName;
          //パラメーターに?があるとき
        } else {
          locationhref += "&" + self.parameterName + "=" + categoryName;
        }
        //パラメーターに?tab=または&tab=があるとき
      } else {
        var set_1_1 =
          "?" + self.parameterName + "=" + getParam(self.parameterName);
        var set_1_2 = "?" + self.parameterName + "=" + categoryName;
        var set_2_1 =
          "&" + self.parameterName + "=" + getParam(self.parameterName);
        var set_2_2 = "&" + self.parameterName + "=" + categoryName;
        //文字列を差し替え
        locationhref = locationhref.replace(set_1_1, set_1_2);
        locationhref = locationhref.replace(set_2_1, set_2_2);
      }

      locationhref = locationhref.replace(locationhash, "") + locationhash;
      //URL差し替え
      history.pushState("", "", locationhref);

      //タブにカレント用のクラスを付与
      self.fade_hide($(this), categoryName, self.fadeSpeed);
      //高さ揃え リセット
      matchheightRemoveFun();
      //高さ揃え
      matchheightFun();

      //リンクタグの本来の動作を停止
      e.preventDefault();
    });
  }

  //$(self.$tab_link)クリック
  $(self.$tab_link).on("click", function (e) {
    var href = $(this)[0].getAttribute("href");
    self.tabFun($(this), href);
    //リンクタグの本来の動作を停止
    e.preventDefault();
  });
};

TabNavFun.prototype.tabFun = function ($this, href) {
  var self = this;
  //$(self.$tab_link)クリック[ページ内に開閉用のリンクがある場合]
  //クリックしたリンクのhrefを取得
  href = href.replace(/\?.*$/, "");

  //要素の表示・非表示処理
  var categoryName = $($this)[0].getAttribute(self.tab_linkTarget);

  //タブのナビのカレントを削除
  if ($('[href="#' + categoryName + '"]').length > 0) {
    $('[href="#' + categoryName + '"]')
      .parents(self.tab_navClass)
      .children()
      .removeClass(self.navCurrentClassName);
  }
  //ナビにカレント用のクラスを付与
  $('[href="#' + categoryName + '"]')
    .parent()
    .addClass(self.navCurrentClassName);
  //タブにカレント用のクラスを付与
  self.fade_hide(
    $('[href="#' + categoryName + '"]'),
    categoryName,
    self.fadeSpeed
  );
  //高さ揃え リセット
  matchheightRemoveFun();
  //高さ揃え
  matchheightFun();

  //ページ内Scroll処理
  if (
    !$('[href="#' + categoryName + '"]').hasClass(self.tab_noscrollClassName)
  ) {
    pageScrollFun(href);
  }
};

//タブパネルの非表示処理（判定用）
TabNavFun.prototype.fade_hide = function ($this, categoryName, speed) {
  var self = this;
  self.dataCategoryArray = [];
  var currentParentTABArray = [];
  self.$dataCategory = $(self.tabArea + " [" + self.dataCategory + "]");
  //表示の処理
  for (var i = 0; i < self.$dataCategory.length; i++) {
    //data-categoryが複数ある場合も想定されるので、配列に格納[,]を区切りとする
    var dataCategory_current = self.$dataCategory[i].getAttribute(
      self.dataCategory
    );
    var dataCategory_Array = dataCategory_current.split(",");
    for (var z = 0; z < dataCategory_Array.length; z++) {
      if (categoryName === dataCategory_Array[z]) {
        //非表示用のクラスは削除
        $(self.$dataCategory[i]).removeClass(self.hideClass);
        //表示用のクラスを付与
        $(self.$dataCategory[i]).addClass(self.showClass);

        $(self.$dataCategory[i]).stop().animate(
          {
            opacity: 1,
          },
          speed,
          "swing"
        );

        //親カテゴリーを登録
        currentParentTABArray.push(
          $(self.$dataCategory[i]).parents(self.tabArea)[0]
        );
      }
    }
  }

  var filteredArray = currentParentTABArray.filter(function (ele, pos) {
    return currentParentTABArray.indexOf(ele) == pos;
  });

  //非表示の処理
  for (var i = 0; i < self.$dataCategory.length; i++) {
    //data-categoryが複数ある場合も想定されるので、配列に格納[,]を区切りとする
    var dataCategory_current = self.$dataCategory[i].getAttribute(
      self.dataCategory
    );
    var dataCategory_Array = dataCategory_current.split(",");
    var showflag_1 = false; //表示判定用のフラグを登録
    var showflag_2 = true; //表示判定用のフラグを登録
    for (var z = 0; z < dataCategory_Array.length; z++) {
      //リンクの指定タグ以外の時
      if (categoryName === dataCategory_Array[z]) {
        showflag_1 = true;
      }
    }
    if (showflag_1 === false) {
      //表示した親要素　タブの配列をループ
      for (var g = 0; g < filteredArray.length; g++) {
        for (var q = 0; q < $(self.$dataCategory[i]).parents().length; q++) {
          if ($(self.$dataCategory[i]).parents()[q] === filteredArray[g]) {
            showflag_2 = false;
          }
        }
      }
    }

    //表示したフラグがtrueのとき
    if (
      (showflag_1 === false && showflag_2 === false) ||
      (showflag_1 === false && filteredArray.length === 0)
    ) {
      //非表示になるので、初回表示用のClassがあれば削除
      if ($(self.$dataCategory[i]).hasClass(self.firstActive)) {
        //self.firstActive削除
        $(self.$dataCategory[i]).removeClass(self.firstActive);
      }

      $(self.$dataCategory[i])
        .stop()
        .animate(
          {
            opacity: 0,
          },
          speed,
          "swing",
          function () {
            //表示・非表示用のクラスを削除
            $(this).addClass(self.hideClass);
            $(this).removeClass(self.showClass);
          }
        );
    }
  }
};

/*------------------------------------------------------------
  タブパネル（aタグ）用の設定
  (リンク全体の要素,タブパネル全体の要素,fadeのスピード,連動するタブがある場合は指定)
  data-category属性を指定。
  リンク全体の要素の表示用の初期値は.is-currentをhtmlタグで記載すること
  タブの全体の要素の表示用の初期値は.is-first-activeをhtmlタグで記載すること
------------------------------------------------------------*/
function Pagelinklist_sp_Fun(fadeSpeed) {
  this.target__link__ClassName = "js-page-link-list-sp";
  this.$target__link = $("." + this.target__link__ClassName);
  this.target__link__active__ClassName = "page-link-list-text-sp";
  this.active__ClassName = "is-active";
  this.open__ClassName = "is-open";

  this.init(); //初期設定
}
//初期設定
Pagelinklist_sp_Fun.prototype.init = function () {
  var self = this;

  if (self.$target__link.length > 0) {
    self.load(); //ロード時の処理
    self.event(); //イベント
  }
};
//ロード時の処理
Pagelinklist_sp_Fun.prototype.load = function () {
  var self = this;
  var target__link__active__html =
    '<p class="' +
    self.target__link__active__ClassName +
    '">' +
    $(self.$target__link.children()[0]).find("a")[0].innerHTML +
    "</p>";
  self.$target__link
    .addClass(self.active__ClassName)
    .before(target__link__active__html);
};
//イベント
Pagelinklist_sp_Fun.prototype.event = function () {
  var self = this;
  $("body").on("click", function (e) {
    //ボタン以外をクリックした場合
    if (
      !e.target.closest("." + self.target__link__ClassName) &&
      !e.target.closest("." + self.target__link__active__ClassName)
    ) {
      //開閉用のClassを削除
      if (
        $("." + self.target__link__ClassName).hasClass(self.open__ClassName)
      ) {
        $("." + self.target__link__ClassName).removeClass(self.open__ClassName);
      }
    }
  });
  //$(self.$tab_link)クリック
  $("." + self.target__link__active__ClassName).on("click", function (e) {
    if ($(this).next().hasClass(self.open__ClassName)) {
      $(this).next().removeClass(self.open__ClassName);
    } else {
      self.position_set($(this));
      $(this).next().addClass(self.open__ClassName);
    }
    //リンクタグの本来の動作を停止
    e.preventDefault();
  });
  $(self.$target__link)
    .find("a")
    .on("click", function (e) {
      $(this)
        .parents("." + self.target__link__ClassName)
        .removeClass(self.open__ClassName);
      var link__text = $(this)[0].innerHTML;
      $(this).parents(
        "." + self.target__link__ClassName
      )[0].previousElementSibling.innerHTML = link__text;
      $(this)
        .parents("." + self.target__link__ClassName)
        .css({
          top: "",
          left: "",
        });
      //リンクタグの本来の動作を停止
      e.preventDefault();
    });
  $(window).on("scroll resize", function () {
    for (var i = 0; i < self.$target__link.length; i++) {
      if ($(self.$target__link[i]).hasClass(self.open__ClassName)) {
        self.position_set($(self.$target__link[i].previousElementSibling));
      }
    }
  });
};

Pagelinklist_sp_Fun.prototype.position_set = function ($this) {
  var self = this;
  var $this_top =
    $($this)[0].getBoundingClientRect().top + $($this)[0].offsetHeight + "px";
  var $this_left = $($this)[0].getBoundingClientRect().left + "px";
  $($this)
    .next("." + self.target__link__ClassName)
    .css({
      top: $this_top,
      left: $this_left,
    });
};

//タブパネルの非表示処理（判定用）
Pagelinklist_sp_Fun.prototype.fade_hide = function (
  $this,
  categoryName,
  speed
) {
  var self = this;
};

jQuery(document).ready(function () {
  //bodyタグにClassを付与
  $("body").addClass("js-dom");
});

//関数の呼び出し
$(function () {
  new Pagelinklist_sp_Fun();

  //グローバルヘッダー(PC)：リンクをクリックした際:吹き出し表示のリンク表示
  new TargetLinkHeaderFun();
  //グローバルヘッダー(SP)：開閉リンク
  new TargetHeaderLinkFun();

  //bodyのidとheaderのhrefの値が一部合致する場合。カレントのClassを付与
  new GlinkActive();
  //ハンバーガーメニューをクリックしたときの動作＋リサイズ、開閉に伴うメニューの高さ調整
  new GMenuSPFun();

  //3点リーダー：テキストの量指定
  new TextHeightFun(".js-three-row-1-2", 1, 2);

  //3点リーダー：テキストの量指定
  new TextBoxHeightFun(".js-three-box-1-2", 1, 2);

  //開閉ボタン、開閉エリア
  new ToggleFun(".js-toggle-btn", 400);
  //SPのみ実行

  new ToggleFun(".js-toggle-btn-sp", 400, "sp");

  /*------------------------------------------------------------
    追従ボタン&メニュー
  ------------------------------------------------------------*/
  new FollowFun();

  /*------------------------------------------------------------
    モーダル関連
  ------------------------------------------------------------*/
  //モーダルを削除するときの処理　共通処理
  new ModalFun();

  /*------------------------------------------------------------
  ポップアップ用のjs
  ※モーダルの削除処理は、ModalFun()と組み合わせて使用します。
  ------------------------------------------------------------*/
  new ModalPopUpFun();
  /*------------------------------------------------------------
    タブパネル関連
  ------------------------------------------------------------*/

  /*------------------------------------------------------------
    new TabNavFun();
    タブパネル（aタグ）用の設定
    (リンク全体の要素,タブパネル全体の要素,fadeのスピード,連動するタブがある場合は指定)
  ------------------------------------------------------------*/
  new TabNavFun(1);

  /*------------------------------------------------------------
    高さ揃え
  ------------------------------------------------------------*/
  matchheightFun();

  /*------------------------------------------------------------
  object fit
  ------------------------------------------------------------*/
  if ($("img").length > 0) {
    objectFitImages("img");
  }
  /*------------------------------------------------------------
  TextHeightFun
  ------------------------------------------------------------*/
  new TextHeightFun(".js-three-row-3-3", 3, 3);
  /*------------------------------------------------------------
  swiper(個数指定で変動なし)
  ------------------------------------------------------------*/
  for (var i = 0; i < $(".js-article-thum-swiper").length; i++) {
    var this_swiper = $(".js-article-thum-swiper")[i];
    var $this_swiper = $(this_swiper);
    var $this_swiper_slide = $this_swiper.find(".swiper-slide");
    var $this_swiper_pagination = $this_swiper.find(".swiper-pagination");
    var $this_swiper_stopbtn = $this_swiper.find(".stopbtn");

    if ($this_swiper_slide.length > 0) {
      var swiper_slide_one_Class = "is-slide-one";
      var swiper_off_Class = "is-swiper-off";

      //.js-article-thum-swiper .swiper-slide 1つ
      if ($this_swiper_slide.length === 1) {
        $this_swiper.addClass(swiper_slide_one_Class);

        //.js-article-thum-swiper .swiper-slide 3つ以上
      } else if ($this_swiper_slide.length >= 3) {
        var js_article_thum_swiper = new Swiper(this_swiper, {
          slidesPerView: "auto",
          spaceBetween: 30,
          loop: true,
          centeredSlides: false,
          allowTouchMove: false,
          speed: 800,
          on: {
            // イベントを登録する
            init: function () {
              matchheightRemoveFun();
              //高さ揃え
              matchheightFun();
            },
          },
          autoplay: {
            delay: 8000,
          },
          //スライダー遷移完了後
          on: {
            transitionEnd: function () {
              var activeIndex = this.activeIndex;
              var slides = this.slides;

              if ($(slides).find("a").length > 0) {
                $(slides).find("a").attr("tabindex", "-1");
              }
              if ($(slides[activeIndex]).find("a").length > 0) {
                $(slides[activeIndex]).find("a").attr("tabindex", "0");
              }
            },
          },
          breakpoints: {
            768: {
              centeredSlides: true,
              allowTouchMove: true,
            },
          },
          // If we need pagination
          pagination: {
            el: $this_swiper_pagination,
            clickable: true,
          },
        });

        if ($this_swiper_stopbtn.length > 0) {
          $this_swiper_stopbtn.addClass("is-show");
          $this_swiper_stopbtn.attr("tabindex", "0");

          $this_swiper_stopbtn.on("click", function () {
            article_thum_swiper($(this));
          });
          $this_swiper_stopbtn.keydown(function (e) {
            if (e.keyCode == 13) {
              article_thum_swiper($(this));
            }
          });

          function article_thum_swiper($this) {
            if ($($this).hasClass("stop")) {
              $($this).addClass("start").removeClass("stop");
              js_article_thum_swiper.autoplay.stop();
            } else {
              $($this).addClass("stop").removeClass("start");
              js_article_thum_swiper.autoplay.start();
            }
          }
        }
      } else {
      }
    }
  }

  //.js-kv-slider-swiper .swiper-slide 2つ以上
  if ($(".js-kv-slider-swiper .swiper-slide").length > 1) {
    var js_kv_swiper = new Swiper(".js-kv-slider-swiper", {
      slidesPerView: "auto",
      spaceBetween: 0,
      loop: true,
      centeredSlides: false,
      allowTouchMove: false,
      speed: 800,
      autoplay: {
        delay: 8000,
      },
      // If we need pagination
      pagination: {
        el: ".js-kv-slider-swiper .swiper-pagination",
        clickable: true,
      },
      //スライダー遷移完了後
      on: {
        transitionEnd: function () {
          var activeIndex = this.activeIndex;
          var slides = this.slides;

          if ($(slides).find("a").length > 0) {
            $(slides).find("a").attr("tabindex", "-1");
          }
          if ($(slides[activeIndex]).find("a").length > 0) {
            $(slides[activeIndex]).find("a").attr("tabindex", "0");
          }
        },
      },
      breakpoints: {
        768: {
          centeredSlides: true,
          allowTouchMove: true,
        },
      },
    });

    if ($(".js-kv-slider-swiper .stopbtn").length > 0) {
      $(".js-kv-slider-swiper .stopbtn").addClass("is-show");
      $(".js-kv-slider-swiper .stopbtn").attr("tabindex", "0");

      $(".js-kv-slider-swiper .stopbtn").on("click", function () {
        kv_slider_swiper($(this));
      });

      $(".js-kv-slider-swiper .stopbtn").keydown(function (e) {
        if (e.keyCode == 13) {
          kv_slider_swiper($(this));
        }
      });

      function kv_slider_swiper($this) {
        if ($($this).hasClass("stop")) {
          $($this).addClass("start").removeClass("stop");
          js_kv_swiper.autoplay.stop();
        } else {
          $($this).addClass("stop").removeClass("start");
          js_kv_swiper.autoplay.start();
        }
      }
    }
  }

  for (var i = 0; i < $(".js-display-slider-swiper").length; i++) {
    var this_swiper = $(".js-display-slider-swiper")[i];
    var $this_swiper = $(this_swiper);
    var $this_swiper_slide = $this_swiper.find(".swiper-slide");

    if ($this_swiper_slide.length > 0) {
      var swiper_slide_one_Class = "is-slide-one";
      var swiper_off_Class = "is-swiper-off";

      //.js-display-slider-swiper .swiper-slide 1つ
      if ($this_swiper_slide.length === 1) {
        $this_swiper.addClass(swiper_slide_one_Class);

        //.js-display-slider-swiper .swiper-slide 3つ以上
      } else if ($this_swiper_slide.length >= 3) {
        var $this_swiper_button_next = $this_swiper.find(".swiper-button-next");
        var $this_swiper_button_prev = $this_swiper.find(".swiper-button-prev");
        var js_display_slider_swiper = new Swiper(this_swiper, {
          slidesPerView: "auto",
          spaceBetween: 0,
          loop: true,
          centeredSlides: true,
          allowTouchMove: false,
          speed: 800,
          autoplay: {
            delay: 8000,
          },
          navigation: {
            nextEl: $this_swiper_button_next,
            prevEl: $this_swiper_button_prev,
          },
          //スライダー遷移完了後
          on: {
            transitionEnd: function () {
              var activeIndex = this.activeIndex;
              var slides = this.slides;

              if ($(slides).find("a").length > 0) {
                $(slides).find("a").attr("tabindex", "-1");
              }
              if ($(slides[activeIndex]).find("a").length > 0) {
                $(slides[activeIndex]).find("a").attr("tabindex", "0");
              }
            },
          },
          breakpoints: {
            768: {
              centeredSlides: false,
              allowTouchMove: true,
            },
          },
        });
      } else {
      }
    }
  }

  //(個数指定でPC/SP変動)
  new Slider_Article_Thum_delaySP_Fun(2);
  new Slider_Display_delaySP_Fun(2);
});

/*------------------------------------------------------------
  swiper(個数指定でPC/SP変動)
------------------------------------------------------------*/
function Slider_Article_Thum_delaySP_Fun(slide_num) {
  this.$slider = $(".js-article-thum-swiper");
  this.$slider_slide_array = [];
  this.$slider_stop_array = [];
  this.swiper_off_ClassName = "is-swiper-off";
  this.js_slider_swiper = [];
  this.slide_num = slide_num; //destroyするスライドの上限
  this.speed = 800; //スピード
  this.delay = 8000; //ScrollY量
  this.init();
}

//共通関数
Slider_Article_Thum_delaySP_Fun.prototype.init = function () {
  var self = this;
  for (var i = 0; i < self.$slider.length; i++) {
    self.$slider_slide_array[i] = $(self.$slider[i]).find(".swiper-slide");
    self.$slider_stop_array[i] = $(self.$slider[i]).find(".stopbtn");
  }
  self.event();
};

Slider_Article_Thum_delaySP_Fun.prototype.event = function () {
  var self = this;
  for (var i = 0; i < self.$slider.length; i++) {
    if (self.$slider_slide_array[i].length === self.slide_num) {
      if ($(self.$slider_stop_array[i]).length > 0) {
        $(self.$slider_stop_array[i]).on("click", function () {
          var test = $(this).parents(".js-article-thum-swiper")[0];
          for (var z = 0; z < self.$slider.length; z++) {
            if ($(self.$slider[z])[0] === test) {
              article_thum_swiper($(this), self.js_slider_swiper[z]);
            }
          }
        });

        $(self.$slider_stop_array[i]).keydown(function (e) {
          if (e.keyCode == 13) {
            var test = $(this).parents(".js-article-thum-swiper")[0];
            for (var z = 0; z < self.$slider.length; z++) {
              if ($(self.$slider[z])[0] === test) {
                article_thum_swiper($(this), self.js_slider_swiper[z]);
              }
            }
          }
        });

        function article_thum_swiper($this, js_slider_swiper) {
          if (window_size === "sp") {
            if ($($this).hasClass("stop")) {
              $($this).addClass("start").removeClass("stop");
              js_slider_swiper.autoplay.stop();
            } else {
              $($this).addClass("stop").removeClass("start");
              js_slider_swiper.autoplay.start();
            }
          }
        }
      }
    }
  }

  $(window).on("load resize", function () {
    for (var i = 0; i < self.$slider.length; i++) {
      if (self.$slider_slide_array[i].length === self.slide_num) {
        if ($(self.$slider_stop_array[i]).length > 0) {
          if (window_size === "pc") {
            if ($(self.$slider_stop_array[i]).hasClass("is-show")) {
              $(self.$slider_stop_array[i]).removeClass("start");
              $(self.$slider_stop_array[i]).addClass("stop");
              $(self.$slider_stop_array[i]).removeClass("is-show");
              $(self.$slider_stop_array[i]).attr("tabindex", "");
            }
          } else {
            if (!$(self.$slider_stop_array[i]).hasClass("is-show")) {
              $(self.$slider_stop_array[i]).addClass("is-show");
              $(self.$slider_stop_array[i]).attr("tabindex", "0");
            }
          }
        }
      }
    }
    self.set();
  });
};

Slider_Article_Thum_delaySP_Fun.prototype.set = function () {
  var self = this;

  for (var i = 0; i < self.$slider_slide_array.length; i++) {
    if (self.$slider_slide_array[i].length === self.slide_num) {
      if (window_size === "pc") {
        if (self.js_slider_swiper[i] !== undefined) {
          self.js_slider_swiper[i].destroy(false, true);
        }
        if (!$(self.$slider[i]).hasClass(self.swiper_off_ClassName)) {
          $(self.$slider[i]).addClass(self.swiper_off_ClassName);
        }
      } else {
        if (
          $(self.$slider[i]).hasClass(self.swiper_off_ClassName) ||
          self.js_slider_swiper[i] === undefined
        ) {
          self.js_slider_swiper[i] = new Swiper($(self.$slider[i]), {
            slidesPerView: "auto",
            spaceBetween: 30,
            loop: true,
            centeredSlides: true,
            allowTouchMove: true,
            speed: self.speed,
            on: {
              // イベントを登録する
              init: function () {
                matchheightRemoveFun();
                //高さ揃え
                matchheightFun();
              },
            },
            autoplay: {
              delay: self.delay,
            },
            // If we need pagination
            pagination: {
              el: $(self.$slider[i]).find(".swiper-pagination"),
              clickable: true,
            },
          });

          $(self.$slider[i]).removeClass(self.swiper_off_ClassName);
        }
      }
    }
  }
};

function Slider_Display_delaySP_Fun(slide_num) {
  this.$slider = $(".js-display-slider-swiper");
  this.$slider_slide_array = [];
  this.swiper_off_ClassName = "is-swiper-off";
  this.js_slider_swiper = [];
  this.slide_num = slide_num;
  this.speed = 800; //スピード
  this.delay = 8000; //ScrollY量
  this.init();
}
//共通関数
Slider_Display_delaySP_Fun.prototype.init = function () {
  var self = this;
  for (var i = 0; i < self.$slider.length; i++) {
    self.$slider_slide_array[i] = $(self.$slider[i]).find(".swiper-slide");
  }
  self.event();
};

Slider_Display_delaySP_Fun.prototype.event = function () {
  var self = this;
  self.set();
  $(window).on("resize", function () {
    self.set();
  });
};

Slider_Display_delaySP_Fun.prototype.set = function () {
  var self = this;

  for (var i = 0; i < self.$slider_slide_array.length; i++) {
    if (self.$slider_slide_array[i].length === self.slide_num) {
      if (window_size === "pc") {
        if (self.js_slider_swiper[i] !== undefined) {
          self.js_slider_swiper[i].destroy(false, true);
        }
        if (!$(self.$slider[i]).hasClass(self.swiper_off_ClassName)) {
          $(self.$slider[i]).addClass(self.swiper_off_ClassName);
        }
      } else {
        if (
          $(self.$slider[i]).hasClass(self.swiper_off_ClassName) ||
          self.js_slider_swiper[i] === undefined
        ) {
          self.js_slider_swiper[i] = new Swiper($(self.$slider[i]), {
            slidesPerView: "auto",
            spaceBetween: 0,
            loop: true,
            centeredSlides: false,
            allowTouchMove: true,
            speed: 800,
            autoplay: {
              delay: 8000,
            },
            navigation: {
              nextEl: $(self.$slider[i]).find(".swiper-button-next"),
              prevEl: $(self.$slider[i]).find(".swiper-button-prev"),
            },
            //スライダー遷移完了後
            on: {
              transitionEnd: function () {
                var activeIndex = this.activeIndex;
                var slides = this.slides;

                if ($(slides).find("a").length > 0) {
                  $(slides).find("a").attr("tabindex", "-1");
                }
                if ($(slides[activeIndex]).find("a").length > 0) {
                  $(slides[activeIndex]).find("a").attr("tabindex", "0");
                }
              },
            },
          });

          $(self.$slider[i]).removeClass(self.swiper_off_ClassName);
        }
      }
    }
  }
};

//load時
$(window).on("load", function () {
  imageMapResize();
  //ロード時のClassを付与
  $("body").addClass("js-load");

  /*------------------------------------------------------------
  ハッシュリンクのScroll処理
  ------------------------------------------------------------*/
  var urlHash = location.hash;
  if (urlHash) {
    setTimeout(function () {
      //スムーズスクロール
      //urlHashまで移動
      //ハッシュ、上余白、スクロールのスピード
      scrollToAnker(urlHash, 0, 500);
    }, 100);
  }

  /*------------------------------------------------------------
  ページ内リンクのScroll処理
  ------------------------------------------------------------*/
  $("a")
    .not(".is-noscroll")
    .on("click", function (e) {
      var href = $(this).attr("href");
      //パラメーターありは除去
      href = href.replace(/\?.*$/, "");
      //ページ内Scroll処理
      //hrefを代入
      pageScrollFun(href);

      //aタグに「#」が含まれる場合
      if (href.indexOf("#") != -1) {
        //本来の処理を停止
        e.preventDefault();
      }
    });

  /*------------------------------------------------------------
  ページ内リンクのScroll処理(Selectタグ)
  ------------------------------------------------------------*/
  //optionが変更になった時に発火
  /*
  var first = true;
  $('body').on('click', function (e) {
    if( $( e.target ).hasClass('js-page-link-select')){
      if( first === true ){
          first = false;
      }else{
        var $this = $( e.target );
        var val = $this.val();
        //ページ内Scroll処理
        val = val.replace(/\?.*$/,"");
        var selectedIndex = $this.prop("selectedIndex");
        var $option = $this.find("option")[selectedIndex];

        //トグル用の指定があるとき
        if( $option.getAttribute("data-toggle-target") ){
          var toggleFun = new ToggleFun();
          toggleFun.togglelinkFun( $($option), val);
        }
        //タブ用の指定があるとき
        if( $option.getAttribute("data-tab-target") ){
          var tabNavFun = new TabNavFun;
          tabNavFun.tabFun($($option), val);
        }
        //valを代入
        if( !$($option).hasClass('is-noscroll') ){
          pageScrollFun(val);
        }
        first = true;
      }
    }else{
      if(first === false ){
          first = true;
      }
    }
  });
  */

  $(".js-page-link-select").on("change", function (e) {
    var $this = $(this);
    var val = $this.val();
    //ページ内Scroll処理
    val = val.replace(/\?.*$/, "");
    var selectedIndex = $this.prop("selectedIndex");
    var $option = $this.find("option")[selectedIndex];

    //トグル用の指定があるとき
    if ($option.getAttribute("data-toggle-target")) {
      var toggleFun = new ToggleFun();
      toggleFun.togglelinkFun($($option), val);
    }
    //タブ用の指定があるとき
    if ($option.getAttribute("data-tab-target")) {
      var tabNavFun = new TabNavFun();
      tabNavFun.tabFun($($option), val);
    }
    //valを代入
    if (!$($option).hasClass("is-noscroll")) {
      pageScrollFun(val);
    }
    first = true;
  });

  /*------------------------------------------------------------
  リンクhover時にClassを付与
  ------------------------------------------------------------*/
  if ($(".js-ch-link-hover").length > 0) {
    if ($(".js-ch-link-hover").children().length > 0) {
      $(".js-ch-link-hover")
        .children()
        .hover(
          function () {
            if ($(this).find("a").length > 0) {
              $(this).find("a").addClass("is-link-hover");
            }
          },
          function () {
            if ($(this).find("a").length > 0) {
              $(this).find("a").removeClass("is-link-hover");
            }
          }
        );
    }
  }
});
