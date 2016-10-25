$(function () {

    // scroll effect for anchors
    $('a[href*="#"]:not([href="#"],[href="#code-carousel"])').click(function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            var nav = $("nav")
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top - nav.height()
                }, 1000);
                return false;
            }
        }
    });

    $(window).on('scroll', function () {
        var y = window.pageYOffset;
        var portrait = $(".portrait");
        var portraitTop = portrait.offset().top;
        var portraitHeight = portrait.outerHeight();

        if (y > (portraitTop - 350)) {
            portrait.addClass("zoomout");
        } else {
            portrait.removeClass("zoomout");
        }

        var wndH = $(window).height() - 200;

        $("#abilities ul li span.fa").each(function (i, el) {
            var idx = i % 5;
            var el = $(el);
            var top = el.offset().top
            if (y > top - wndH) {
                el.addClass("slidein" + idx);
            } else {
                el.removeClass("slidein" + idx);
            }
        });
    });
});