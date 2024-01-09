$(function () {
    var pagetop = $('#page_top');
    pagetop.hide();
    var burger = $('#burger-btn');
    var footer_nav = $('#footer_nav');
    if (!footer_nav.length) $("footer").addClass("nav_none");
    footer_nav.addClass("active");
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            pagetop.fadeIn();
            burger.addClass("active");
            // footer_nav.addClass("active");
        } else {
            pagetop.fadeOut();
            if (!burger.hasClass("close")) burger.removeClass("active");
            // footer_nav.removeClass("active");
        }
    });
    pagetop.click(function () {
        $('body, html').animate({
            scrollTop: 0
        }, 500);
        return false;
    });
});

$(function () {
    // if (window.matchMedia('(max-width: 750px)').matches) {
    let s = 0;
    $('.burger-btn').on('click', function () {
        s = s ? s : $(window).scrollTop();
        console.log(s)
        $('.burger-btn').toggleClass('close');
        $('.nav-wrapper').fadeToggle(700);
        $('body').toggleClass('fixed');
        $('html').toggleClass('noscroll');

        if ($(this).hasClass("close")) {
            var close = $(this).children('img').attr('src').replace('humburger', 'close');
            $(this).children('img').attr('src', close);
            if ($(window).width() < 769) {
                $("#footer_nav").css({
                    "opacity": 1
                });
                $("body").css({
                    // "height": $(window).height()+"px",
                    // "top": $(window).scrollTop()*-1+"px",
                    "position": "fixed",
                    "overflow": "hidden"
                });
            }
        } else {
            var humburger = $(this).children('img').attr('src').replace('close', 'humburger');
            $(this).children('img').attr('src', humburger);
            if ($(window).width() < 769) {
                $("#footer_nav").css({
                    "opacity": ""
                });
                $("body").css({
                    // "height": "",
                    // "top": "",
                    "position": "",
                    "overflow": ""
                });
                $(window).scrollTop(s);
                s = 0;
            }
        }
    });
    if (window.matchMedia && window.matchMedia('(max-device-width: 480px)').matches) {
        $('.nav-wrapper ul a[href]').on('click', function (event) {
            $('.burger-btn').trigger('click');
        });
    }
    // }
})
$(function () {
    $('a[href^="#"]').click(function () {
        let speed = 500;
        let href = $(this).attr("href");
        let target = $(href == "#" || href == "" ? 'html' : href);
        let position = target.offset().top - 10;
        $("html, body").animate({
            scrollTop: position
        }, speed, "swing");
        if ($("#burger-btn").hasClass("close")) {
            console.log("A")
            $("#burger-btn").removeClass("close");
            $("#burger-btn").children("img").attr("src", "/assets/common/img/humburger.png");
            $("#burger-btn").next(".nav-wrapper").hide();
        }
        return false;
    });
    $('a[href*="#"]').click(function () {
        if ($("#burger-btn").hasClass("close")) {
            $("#burger-btn").removeClass("close");
            $("#burger-btn").children("img").attr("src", "/assets/common/img/humburger.png");
            $("#burger-btn").next(".nav-wrapper").hide();
        }
    });
});

//アコーディオン
$(function () {
    // $('.ac-parent').on('click', function () {
    //     $(this).next().slideToggle();
    //     $(this).toggleClass("active");
    // });
    if (window.matchMedia('(max-width: 768px)').matches) {
        $('.ac-parent').on('click', function () {
            $(this).nextAll('.ac-child').first().slideToggle();
            $(this).toggleClass("active");
        });


        $('.headernav_parent-ac').on('click', function () {
            $(this).nextAll('.headernav_child-ac').first().slideToggle(200);
            $(this).toggleClass("active");
        });
    }
    $('.ac-parent_all').on('click', function () {
        $(this).nextAll('.ac-child_all').first().slideToggle();
        $(this).toggleClass("active");
        $(this).parent('.language').toggleClass("active");
    });


    //header_search
    var search = $('.search_section');
    $('header .search_js').on('click', function () {
        search.slideToggle();
        $(this).toggleClass("active");

        if ($(this).hasClass("active")) {
            $(this).children('img').attr('src', '/assets/common/img/close_white.svg');
        } else {
            $(this).children('img').attr('src', '/assets/common/img/search.svg');
        }
    });

    $('header .fit_search_js').on('click', function () {
        search.slideToggle();
        $(this).toggleClass("active");

        if ($(this).hasClass("active")) {
            var close_white = $(this).children('img').attr('src').replace('search_black', 'close_white');
            $(this).children('img').attr('src', close_white);
        } else {
            var search_black = $(this).children('img').attr('src').replace('close_white', 'search_black');
            $(this).children('img').attr('src', search_black);
        }
    });
});

//kv_video
$(function () {
    var kv_video = $('.kv_video');

    $('.video_close').on('click', function () {
        kv_video.hide();
    });
});


$(function () {
    // KV動画のモーダル開閉
    function videoModalToggle() {
        const videoModal = document.getElementById("js-video-modal");
        const thumbnail = document.getElementById("js-thumbnail");
        const closeBtn = document.getElementById("js-close-btn");

        if (closeBtn) {
            closeBtn.addEventListener("click", function (e) {
                videoModal.classList.remove("is-active");
                e.stopPropagation();
            });
        }

        if (thumbnail) {
            thumbnail.addEventListener("click", function () {
                videoModal.classList.add("is-active");
            });
        }
    }
    videoModalToggle();
});
// Youtube API
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
var ytPlayer;
window.addEventListener('load', function () {
    // if(document.getElementById("ytplayer")) {
    var ytFrame = document.getElementById("ytplayer");
    // ytID = ytFrame.dataset.ytid;
    function onYouTubeIframeAPIReady() {
        ytPlayer = new YT.Player('ytplayer', {
            videoId: ytFrame.dataset.ytid,
            playerVars: {
                playsinline: 1,
                autoplay: 1,
                fs: 0,
                rel: 0,
                controls: 0,
                modestbranding: 1,
                iv_load_policy: 3,
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange
            }
        });
    }

    function onPlayerReady(event) {
        event.target.mute();
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        var ytStatus = event.target.getPlayerState();
        if (ytStatus == YT.PlayerState.ENDED) {
            ytPlayer.playVideo();
        }
    }
    if (ytFrame) onYouTubeIframeAPIReady();
    // }
});

$(function () {
    // iframe モーダル
    if ($(".cboxElement").length) {
        $(".cboxElement").colorbox({
            iframe: true,
            width: "100%",
            height: "80%",
            innerWidth: "95%",
            maxWidth: "1140px",
            maxHeight: "80%",
            opacity: 0.8,
            className: "iframe-modal01",
            onComplete: function () {
                $("body").css({
                    "height": $(window).height() + $(window).scrollTop() + "px",
                    "top": $(window).scrollTop() * -1 + "px",
                    "position": "fixed",
                    "overflow": "hidden"
                });
                const h = $($.colorbox.element()).attr("href"),
                    $iframe = $("#colorbox").find(".cboxIframe");
                if (!$iframe.attr("src")) $iframe.attr("src", h);
            },
            onClosed: function () {
                const s = $("body").css("top").slice(0, -2);
                $("body").css({
                    "height": "",
                    "top": "",
                    "position": "",
                    "overflow": ""
                });
                $(window).scrollTop(s * -1);
            },
        });
    }
});

$(function () {
    let video = "";
    const checkSize = function () {
        return $(window).width() < 768 ? true : false;
    };
    // js-videomodal_pc
    $(".js-videomodal_pc").on("click", function () {
        if (checkSize()) return;
        $(this).next(".js-videomodalElement").addClass("is-active");
        video = $(this).next(".js-videomodalElement").find("iframe").clone();
        return false;
    });
    $(".js-videomodalClose_pc").on("click", function () {
        if (checkSize()) return;
        const $parent = $(this).closest(".js-videomodalElement").find("iframe").parent();
        $(this).closest(".js-videomodalElement").removeClass("is-active");
        $(this).closest(".js-videomodalElement").find("iframe").remove();
        $parent.append(video);
        return false;
    });

    $(".js-videomodal").on("click", function () {
        $(this).next(".js-videomodalElement").addClass("is-active");
        video = $(this).next(".js-videomodalElement").find("iframe").clone();
        return false;
    });
    $(".js-videomodalClose").on("click", function () {
        const $parent = $(this).closest(".js-videomodalElement").find("iframe").parent();
        $(this).closest(".js-videomodalElement").removeClass("is-active");
        $(this).closest(".js-videomodalElement").find("iframe").remove();
        $parent.append(video);
        return false;
    });
    $(".js-videoHidden").on("click", function () {
        const $parent = $(this).closest(".js-video");
        $parent.remove();
        return false;
    });

    // youtube colorbox
    $(".js-colorboxVideo").on("click", function () {
        const $btn = $(this);
        console.log($btn.colorbox())
        $btn.colorbox({
            inline: true,
            width: "100%",
            innerWidth: "95%",
            maxWidth: "960px",
            maxHeight: "90%",
            opacity: 0.8,
            className: "facilities-slide",
            current: ""
        });
    });
    $(".js-colorboxVideo_pc").on("click", function () {
        if (checkSize()) return;
        const $btn = $(this);
        console.log($btn.colorbox())
        $btn.colorbox({
            inline: true,
            width: "100%",
            innerWidth: "95%",
            maxWidth: "960px",
            maxHeight: "90%",
            opacity: 0.8,
            className: "facilities-slide",
            current: ""
        });
    });
});

$(function () {
    // let image = "";
    // js-imagemodal
    $(".js-imagemodal").on("click", function () {
        $(this).next(".js-imagemodalElement").addClass("is-active");
        // image = $(this).next(".js-imagemodalElement").find("iframe").clone();
        return false;
    });
    $(".js-imagemodalClose").on("click", function () {
        // const $parent = $(this).closest(".js-imagemodalElement").find("iframe").parent();
        $(this).closest(".js-imagemodalElement").removeClass("is-active");
        // $(this).closest(".js-imagemodalElement").find("iframe").remove();
        // $parent.append(image);
        return false;
    });
});

$(function () {
    $(".js-tabSwitch").on("click", function () {
        const $btn = $(this)
        $acc = $("#" + $btn.attr("data-tab"));
        $(".js-tabSwitch").removeClass("is-active");
        $(".js-tabElement").removeClass("is-active");
        $btn.addClass("is-active");
        $acc.addClass("is-active");
    });

    $(".js-passwordSwich").click(function () {
        const $btn = $(this),
            $ipt = $btn.prev();
        $ipt.attr("type", ($ipt.attr("type") == "password" ? "text" : "password"));
    });

    $(".js-confirmEnglish").on("click", function () {
        $("#ConfirmEnglish").addClass("is-active");
        return false;
    });
    $(".js-confirmEnglishClose").on("click", function () {
        $("#ConfirmEnglish").removeClass("is-active");
    });

    $(".js-mocal01Open").on("click", function () {
        $(".js-mocal01Element").addClass("is-active");
        return false;
    });
    $(".js-mocal01Close").on("click", function () {
        $(this).closest(".js-mocal01Element").removeClass("is-active");
    });

    var mo_isActive = false;
    if ($(".js-mocal01Element").length) {
        const sKey = $(".js-mocal01Element").attr("data-session");
        if (sessionStorage.getItem(sKey) != "true") {
            sessionStorage.setItem(sKey, true);
            mo_isActive = true;
            //$(".js-mocal01Element").addClass("is-active");
        }
    }

    // 画像読み込みしてからモーダル表示
    if (document.readyState !== "loading") {
        if (mo_isActive) {
            $(".js-mocal01Element").addClass("is-active");
        }
    } else {
        window.addEventListener('DOMContentLoaded', function () {
            let $img = $('#js-mocal01Element-img');
            // パスを取得
            let $img_src = $img.attr('src');
            // console.log($img_src);
            // src属性を空に
            $img.attr('src', '');
            // 読み込みを監視
            $img.on('load', function () {
                // console.log('画像の読み込みが完了しました');
                // console.log("load");
                if (mo_isActive) {
                    $(".js-mocal01Element").addClass("is-active");
                }
            });
            // パスを再設定
            $img.attr('src', $img_src);
        });
    }
});