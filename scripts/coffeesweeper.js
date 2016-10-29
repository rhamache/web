function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function CoffeesweeperGame(gameAreaId) {
    this.$gameArea = $("#" + gameAreaId);
    this.mineArr = [[]];
    this.mineCounts = [[]];
    this.width = 0;
    this.height = 0;
    this.mineCount = 0;
    this.revealedCount = 0;
    this.timer = new Stopwatch();

    this.init = function () {
        this.createOptionsArea();
    };

    this.createOptionsArea = function () {
        var self = this;

        var html = "<div class='row form-horizontal'>\
                    <div class='form-group'>\
                        <label class='col-sm-2'>Width</label>\
                        <div class='col-sm-10'>\
                            <input type='text' id='gameWidth' value='10'/>\
                        </div>\
                    </div>\
                    <div class='form-group'>\
                        <label class='col-sm-2'>Height</label>\
                        <div class='col-sm-10'>\
                            <input type='text' id='gameHeight' value='10'/>\
                        </div>\
                    </div>\
                    <div class='form-group'>\
                        <label class='col-sm-2'>Number of Mines</label>\
                        <div class='col-sm-10'>\
                            <input type='text' id='gameMineCount' value='20'/>\
                        </div>\
                    </div>\
                    <div class='form-group'>\
                        <div class='col-sm-10 col-sm-offset-2'>\
                            <div class='btn-group'>\
                                <button id='gameEasy' type='button' class='btn btn-primary'>Easy</button>\
                                <button id='gameMed' type='button' class='btn btn-primary'>Medium</button>\
                                <button id='gameHard' type='button' class='btn btn-primary'>Hard</button>\
                            </div>\
                        </div>\
                    </div>\
                    <div class='form-group'>\
                        <div class='col-sm-10 col-sm-offset-2'>\
                            <button class='btn btn-primary' id='gameStart'>Start</button>\
                        </div>\
                    </div>\
                </div>\
                <div class='row'>\
                    <div class='col-sm-12' id='gameBoard'></div>\
                </div>";


        self.$gameArea.append(html);
        $("#gameStart").click(function () {
            var w = self.width = $("#gameWidth").val();
            var h = self.height = $("#gameHeight").val();
            var mines = self.mineCount = $("#gameMineCount").val();
            if (w > 50) {
                alert("Width must be less than or equal to 50 cells.");
                return;
            }
            if (w < 5) {
                alert("Width must be greater than or equal to 5 cells.");
                return;
            }
            if (h > 50) {
                alert("Height must be less than or equal to 50 cells.");
                return;
            }
            if (h < 5) {
                alert("Height must be greater than or equal to 5 cells.");
                return;
            }
            if (mines < 1) {
                alert("You must have at least 1 mine!");
                return;
            }
            if (mines > (w*h)) {
                alert("Cannot fit " + mines + " mines into the cells!");
                return;
            }

            self.createGameArea();
        });
        $("#gameEasy").click(function () {
            $("#gameWidth").val(10);
            $("#gameHeight").val(10);
            $("#gameMineCount").val(20);
        });
        $("#gameMed").click(function () {
            $("#gameWidth").val(20);
            $("#gameHeight").val(20);
            $("#gameMineCount").val(50);
        });
        $("#gameHard").click(function () {
            $("#gameWidth").val(30);
            $("#gameHeight").val(30);
            $("#gameMineCount").val(100);
        });
    };

    this.createGameArea = function () {
        var self = this;

        self.revealedCount = 0;
        self.width = $("#gameWidth").val();
        self.height = $("#gameHeight").val();
        self.mineCount = $("#gameMineCount").val();
        var width = self.width;
        var height = self.height;
        var mineCount = self.mineCount;

        var halfWidth = width / 2;

        self.mineCounts = new Array(height);
        self.mineArr = new Array(height);
        var html = "<table><thead><tr><th colspan='" + Math.floor(halfWidth) + "'><span id='mineDisplay'></span></th><th class='text-right' colspan='" + Math.ceil(halfWidth) + "'><span id='timeDisplay'></span></th><tr><thead><tbody>";
        for (var i = 0; i < height; ++i) {
            self.mineArr[i] = new Array(width);
            self.mineCounts[i] = new Array(width);

            html += "<tr>";
            for (var j = 0; j < width; ++j) {
                self.mineArr[i][j] = false;
                self.mineCounts[i][j] = 0;
                html += "<td><button class='btn btn-xs btn-default gamebtn' data-row='" + i + "' data-col='" + j + "'></button></td>";
            }
            html += "</tr>";
        }
        html += "</tbody></table>";

        for (var mi = 0; mi < mineCount; ++mi) {
            var minePlaced = false;
            while (!minePlaced) {
                var row = getRandomInt(0, height - 1);
                var col = getRandomInt(0, width - 1);
                if (self.mineArr[row][col] === false) {
                    self.mineArr[row][col] = true;
                    minePlaced = true;

                    var left = Math.max(0, col - 1);
                    var top = Math.max(0, row - 1);
                    var right = Math.min(self.width - 1, col + 1);
                    var bottom = Math.min(self.height - 1, row + 1);

                    var count = 0;
                    for (var i = top; i <= bottom; ++i) {
                        for (var j = left; j <= right; ++j) {
                            if (i === row && j === col) {
                                continue;
                            }

                            self.mineCounts[i][j] += 1;
                        }
                    }
                }
            }
        }

        $("#gameBoard").html(html);
        $('#mineDisplay').text(mineCount);
        self.timer.reset();
        self.timer.start();
        $("#timeDisplay").text(self.timer.time())
        setInterval(function () {
            $("#timeDisplay").text(self.timer.time());
        }, 1000);
        $(".gamebtn").click(function () {
            self.gameButtonClicked($(this));
        });
        $(".gamebtn").on('longTouch', function () {
            self.gameButtonRightClicked($(this));
        });
        $(".gamebtn").bind("contextmenu", function (e) {
            e.preventDefault();
            self.gameButtonRightClicked($(this));
        });
    }

    this.gameButtonClicked = function (theButton) {
        var self = this;
        if (theButton.hasClass("fa-flag")) {
            return;
        }

        var row = theButton.data("row");
        var col = theButton.data("col");
        if (self.mineArr[row][col] === true) {
            self.timer.stop();
            theButton.removeClass("btn-default");
            theButton.addClass("btn-danger fa fa-coffee");



            $.each($(".gamebtn"), function (i, v) {
                var $btn = $(v);
                $btn.addClass("disabled");
                $btn.attr("disabled", "true");

                if (self.mineArr[$btn.data("row")][$btn.data("col")] === true) {
                    $btn.removeClass("btn-default");
                    $btn.addClass("btn-danger fa fa-coffee");
                }
            });

            alert("You lost!");
        } else {
            self.checkButton(theButton);

            if (self.revealedCount === (self.width * self.height) - self.mineCount) {
                self.timer.stop();
                $.each($(".gamebtn"), function (i, v) {
                    var $btn = $(v);
                    $btn.addClass("disabled");
                    $btn.attr("disabled", "true");

                    if (self.mineArr[$btn.data("row")][$btn.data("col")] === true) {
                        $btn.addClass("fa fa-flag");
                    }
                });
                alert("You win! Time elapsed: " + self.timer.time());
            }
        }
    }

    this.checkButton = function (theButton) {
        if (theButton.hasClass("revealed")) {
            return;
        }
        theButton.removeClass("fa fa-question fa-flag");
        theButton.addClass("revealed");
        theButton.addClass("active");

        var self = this;
        self.revealedCount++;
        var row = theButton.data("row");
        var col = theButton.data("col");

        var adjacentMineCount = self.mineCounts[row][col];

        if (adjacentMineCount !== 0) {
            theButton.text(adjacentMineCount);
            theButton.addClass(adjacentMineCount);
        } else {
            var left = Math.max(0, col - 1);
            var top = Math.max(0, row - 1);
            var right = Math.min(self.width - 1, col + 1);
            var bottom = Math.min(self.height - 1, row + 1);

            for (var i = top; i <= bottom; ++i) {
                for (var j = left; j <= right; ++j) {
                    if (i === row && j === col) {
                        continue;
                    }
                    var btn = $(".gamebtn[data-row='" + i + "'][data-col='" + j + "']");
                    self.checkButton(btn);
                }
            }
        }
    }

    this.getAdjacentMineCount = function (row, col) {
        var self = this;
        var left = Math.max(0, col - 1);
        var top = Math.max(0, row - 1);
        var right = Math.min(self.width - 1, col + 1);
        var bottom = Math.min(self.height - 1, row + 1);

        var count = 0;
        for (var i = top; i <= bottom; ++i) {
            for (var j = left; j <= right; ++j) {
                if (i === row && j === col) {
                    continue;
                }

                if (self.mineArr[i][j] === true) {
                    ++count;
                }
            }
        }

        return count;
    }

    this.gameButtonRightClicked = function (theButton) {
        var currentCount = +$('#mineDisplay').text();

        if (theButton.hasClass("fa-flag")) {
            $('#mineDisplay').text(currentCount + 1);
            theButton.removeClass("fa-flag");
            theButton.addClass("fa-question");
        } else if (theButton.hasClass("fa-question")) {
            theButton.removeClass("fa-question");
            theButton.removeClass("fa");
        } else {
            $('#mineDisplay').text(currentCount - 1);
            theButton.addClass("fa");
            theButton.addClass("fa-flag");
        }

        var newCount = +$('#mineDisplay').text();
        if (newCount < 0) {
            $('#mineDisplay').addClass("text-danger");
        } else {
            $('#mineDisplay').removeClass("text-danger");
        }
    }
}

var Stopwatch = function () {
    var startAt = 0;
    var lapTime = 0;

    var now = function () {
        return (new Date()).getTime();
    };

    this.start = function () {
        startAt = startAt ? startAt : now();
    };

    this.stop = function () {
        lapTime = startAt ? lapTime + now() - startAt : lapTime;
        startAt = 0;
    };

    this.reset = function () {
        lapTime = startAt = 0;
    };

    this.time = function () {
        var time = lapTime + (startAt ? now() - startAt : 0);
        var h = m = s = ms = 0;
        var newTime = '';

        time = time % (60 * 60 * 1000);
        m = Math.floor(time / (60 * 1000));
        time = time % (60 * 1000);
        s = Math.floor(time / 1000);

        newTime = this.pad(m, 2) + ':' + this.pad(s, 2);
        return newTime;
    };

    this.pad = function (num, size) {
        var s = "0000" + num;
        return s.substr(s.length - size);
    }
};

var onlongtouch;
var timer;
var touchduration = 800;
var longTouchEvent = new Event('longTouch');

function touchstart() {
    timer = setTimeout(onlongtouch, touchduration); 
}

function touchend() {
    if (timer)
        clearTimeout(timer);
}

onlongtouch = function () {
    window.dispatchEvent(longTouchEvent);
};

document.addEventListener("DOMContentLoaded", function (event) {
    window.addEventListener("touchstart", touchstart, false);
    window.addEventListener("touchend", touchend, false);
});