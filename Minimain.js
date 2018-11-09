function getTimeDifferential(e) {
    0 === arguments.length && (e = new Date);
    var i = Math.abs(releaseDate - e) / 1e3,
        a = 86400,
        n = Math.floor(i / a);
    i -= n * a;
    var t = 3600,
        s = Math.floor(i / t);
    i -= s * t;
    var o = 60,
        u = Math.floor(i / o);
    return i -= u * o, {
        days: n,
        hours: s,
        minutes: u,
        seconds: Math.floor(i)
    }
}

function daysFromPublish() {
    return daysUntilReleaseFromPublish - getTimeDifferential().days
}

function getDayPercentDifference() {
    return daysFromPublish() / daysUntilReleaseFromPublish
}

function dayInitialization() {
    $("#mountains").append('<img src="Images/MountainsDay.png"  class="foreground"/>'), $("#valley").append('<img src="Images/ValleyDay.png" class="foreground"/>'), isRaining ? $("body").css("background", "url(Images/CloudsDay.png)") : $("body").css("background", "url(Images/Daysky.jpg)")
}

function nightInitialization() {
    $("#mountains").append('<img src="Images/MountainsNight.png"  class="foreground"/>'), $("#valley").append('<img src="Images/ValleyNight.png" class="foreground"/>'), isRaining ? $("body").css("background", "url(Images/CloudsNight.png)") : $("body").css("background", "url(Images/NightSky.jpg)")
}

function disableSetting() {
    $(".foreground").children().remove()
}

function updateTime() {
    var e = getTimeDifferential();
    e.seconds % 10 == 0 && document.getElementById("clockTick").play(), $("#display_text").empty().append("-" + e.days + " Day" + (e.days > 1 ? "s" : "") + ", " + e.hours + " Hour" + (e.hours > 1 ? "s" : "") + ", <br />&emsp;&emsp;&emsp;" + e.minutes + " Minute" + (e.minutes > 1 ? "s" : "") + ", " + e.seconds + " Second" + (e.seconds > 1 ? "s" : "") + " Remain-"), document.title = e.days + " Days, " + e.hours + " Hours Remain"
}

function checkIsDaytime() {
    var e = getTimeDifferential();
    isDaytime = e.hours <= daylightHours.morning && e.hours > daylightHours.evening
}

function getDayVariation(e) {
    var i = {
            1: "st",
            2: "nd",
            3: "rd"
        },
        a = e % 10;
    return i.hasOwnProperty("" + a) ? i["" + a] : "th"
}

function setTransitionText() {
    var e = getTimeDifferential();
    $("#transitionSupertitle").empty().append((isDaytime ? "Dawn" : "Night") + " of"), $("#transitionTitle").empty().append("The " + (daysFromPublish() === getTimeDifferential(publishDate).days ? "Final" : daysFromPublish() + "<sup>" + getDayVariation(daysFromPublish())) + "</sup> Day"), $("#transitionSubtitle").empty().append("-" + (24 * e.days + e.hours) + " Hours Remain-")
}

function triggerTransition() {
    $(".transitionOverlay").css("visibility", "visible"), setTransitionText(), document.getElementById("transitionclocksound").play(), setTimeout(function() {
        $(".transitionOverlay").css("visibility", "hidden")
    }, 4e3), isDaytime ? (disableSetting(), dayInitialization()) : (disableSetting(), nightInitialization()), null === musicPlaying || muted || songOfTheDay()
}

function moonSizePaddingAdjustment(e) {
    return 1.15 * e * getDayPercentDifference()
}

function setMoonSize() {
    var e = {
            height: 167.5,
            width: 161
        },
        i = {
            right: 5,
            top: 3
        },
        a = {
            right: 1,
            top: 2
        };
    $("#moon").css({
        height: e.height + moonSizePaddingAdjustment(e.height) + "px ",
        width: e.width + moonSizePaddingAdjustment(e.width) + "px"
    }), $("#moonOverlay").css({
        height: e.height + moonSizePaddingAdjustment(e.height) + "px ",
        width: e.width + moonSizePaddingAdjustment(e.width) + "px"
    });
    var n = i.right - moonSizePaddingAdjustment(a.right),
        t = i.top - moonSizePaddingAdjustment(a.top);
    $("#moon").css({
        top: t + "em",
        right: n + "em",
        visibility: "visible"
    }), $("#moonOverlay").css({
        top: t + "em",
        right: n + "em",
        visibility: "visible"
    })
}

function rumbleMoon() {
    document.getElementById("moonRumble").play(), $("#mountains").addClass("smallEarthquake"), $("#valley").addClass("smallEarthquakeAlt"), setTimeout(function() {
        $("#mountains").removeClass("smallEarthquake").addClass("bigEarthquake")
    }, 1500), setTimeout(function() {
        $("#valley").removeClass("smallEarthquakeAlt").addClass("bigEarthquakeAlt")
    }, 1500), setTimeout(function() {
        $("#mountains").removeClass("bigEarthquake").addClass("smallEarthquake")
    }, 5500), setTimeout(function() {
        $("#valley").removeClass("bigEarthquakeAlt").addClass("smallEarthquakeAlt")
    }, 5500), setTimeout(function() {
        $("#mountains").removeClass("smallEarthquake")
    }, 8500), setTimeout(function() {
        $("#valley").removeClass("smallEarthquakeAlt")
    }, 8500)
}

function generateDropSize(e) {
    var i = Math.floor(getRandomFromRange(1, 50)),
        a = Math.ceil(getRandomFromRange(1, 2) / e),
        n = Math.floor(getRandomFromRange(50, 150) / e),
        t = getRandomFromRange(5, 15) / 10,
        s = getRandomFromRange(0, screen.width),
        o = 200 - getRandomFromRange(1, 1.2) * i * 36;
    return {
        hieght: n + "px",
        width: a + "px",
        "animation-duration": t + "s",
        "-webkit-animation-duration": t + "s",
        "-moz-animation-duration": t + "s",
        left: s,
        top: o,
        position: "absolute"
    }
}

function makeItRain() {
    isRaining = !0, thunderStruck(), rainSound.start("rain"), $("body").css(isDaytime ? {
        background: 'url("Images/CloudsDay.png") repeat scroll 0% 0% transparent'
    } : {
        background: 'url("Images/CloudsNight.png") repeat scroll 0% 0% transparent'
    });
    for (var e = 0; maxRaindrops > e; e++) {
        var i = getRandomFromRange(1, 3),
            a = generateDropSize(i);
        $("#rain" + i).append('<div id="rainDrop' + e + '"></div>'), $("#rainDrop" + e).css(a).addClass("rain")
    }
}

function removeRain() {
    isRaining = !1, rainSound.stop(), $("body").css(isDaytime ? {
        background: 'url("Images/Daysky.jpg") repeat scroll 0% 0% transparent'
    } : {
        background: 'url("Images/NightSky.jpg") repeat scroll 0% 0% transparent'
    }), $("#rain1").empty(), $("#rain2").empty(), $("#rain3").empty()
}

function isItSupposedToRainToday() {
    return 1 == getTimeDifferential().days
}

function thunderStruck() {
    $("#thunderDisplay").css({
        visbility: "visible"
    }).addClass("firstFlash"), setTimeout(function() {
        $("#thunderDisplay").removeClass("firstFlash")
    }, 100), setTimeout(function() {
        $("#thunderDisplay").addClass("secondFlash")
    }, 150), setTimeout(function() {
        $("#thunderDisplay").removeClass("secondFlash")
    }, 300), setTimeout(function() {
        document.getElementById("thunderCrash").play()
    }, 1e3)
}

function startDayOneMusic() {
    dayOneMusic.start("dayOne")
}

function startDayTwoMusic() {
    dayTwoMusic.start("dayTwo")
}

function startDayThreeMusic() {
    dayThreeMusic.start("dayThree")
}

function stopDayOneMusic() {
    dayOneMusic.stop()
}

function stopDayTwoMusic() {
    dayTwoMusic.stop()
}

function stopDayThreeMusic() {
    dayThreeMusic.stop()
}

function songOfTheDay() {
    var e = getTimeDifferential().days;
    return releaseDate < new Date ? (musicPlaying = excitedMusic, void musicPlaying.start("excited")) : (2 == e && musicPlaying !== dayOneMusic && (null !== musicPlaying && musicPlaying.stop(), startDayOneMusic(), musicPlaying = dayOneMusic), 1 == e && musicPlaying !== dayTwoMusic && (null !== musicPlaying && musicPlaying.stop(), startDayTwoMusic(), musicPlaying = dayTwoMusic), void(0 == e && musicPlaying !== dayThreeMusic && (null !== musicPlaying && musicPlaying.stop(), startDayThreeMusic(), musicPlaying = dayThreeMusic)))
}

function toggleMusic() {
    null === musicPlaying ? (songOfTheDay(), muted = !1, $("#musicToggle").css({
        "background-color": "rgba(255,255,255,0.55)"
    })) : (muted = !0, musicPlaying.stop(), $("#musicToggle").css({
        "background-color": "rgba(255,255,255,0)"
    }), musicPlaying = null)
}

function songOfStorms() {
    songOfStorm = !0, null !== musicPlaying && (musicPlaying.stop(), musicPlaying = null), document.getElementById("SOSocarina").play(), setTimeout(function() {
        makeItRain(), muted || songOfTheDay()
    }, 4500), isItSupposedToRainToday() || setTimeout(function() {
        removeRain(), songOfStorm = !1
    }, 15e3)
}

function skullKidLaughs() {
    document.getElementById("laughSK").play()
}

function happyMaskLaugh() {
    document.getElementById("laughHMS").play()
}

function randSkullKidLaugh() {
    1 === getRandomFromRange(0, 1e4) && skullKidLaughs()
}

function randHappyMaskLaugh() {
    1 === getRandomFromRange(0, 1e4) && happyMaskLaugh()
}

function triggerAwesome() {
    null !== musicPlaying && musicPlaying.stop(), musicPlaying = excitedMusic, musicPlaying.start("excited"), $("#finalOverlay").css({
        visibility: "visible"
    }), $("#ocarina").css({
        "z-index": "1"
    }), final = !0
}

function getRandomFromRange(e, i) {
    return Math.floor(Math.random() * (i - e + 1) + e)
}

function updateAndCheck() {
    updateTime();
    var e = getTimeDifferential();
    checkIsDaytime(), e.hours != daylightHours[0] && e.hours != daylightHours[1] || 0 != e.minutes || 0 != e.seconds ? e.days <= getTimeDifferential(commenceRumblingDate).days && e.minutes % 5 === 0 && 59 === e.seconds && rumbleMoon() : triggerTransition(), !isRaining && isItSupposedToRainToday() ? makeItRain() : !isRaining || isItSupposedToRainToday() || songOfStorm || removeRain(), setTimeout(randSkullKidLaugh, getRandomFromRange(100, 1e4)), setTimeout(randHappyMaskLaugh, getRandomFromRange(100, 1e4)), 0 !== e.days || 0 !== e.hours || 0 !== e.minutes || 0 !== e.seconds || final || triggerAwesome()
}
var releaseDate = new Date(2015, 1, 13, 6),
    publishDate = new Date(2015, 1, 10),
    commenceRumblingDate = new Date(2015, 1, 12),
    daylightHours = {
        morning: 24,
        evening: 12
    },
    isDaytime = !1,
    maxRaindrops = 150,
    isRaining = !1,
    songOfStorm = !1,
    final = !1,
    muted = !1,
    musicPlaying = null,
    rainSound = new SeamlessLoop,
    dayOneMusic = new SeamlessLoop,
    dayTwoMusic = new SeamlessLoop,
    dayThreeMusic = new SeamlessLoop,
    excitedMusic = new SeamlessLoop;
rainSound.addUri("http://s1.vocaroo.com/media/download_temp/Vocaroo_s1iIl81mxHXF.mp3", 19e3, "rain"), dayOneMusic.addUri("http://s0.vocaroo.com/media/download_temp/Vocaroo_s0VnjTrQTov1.mp3", 52427, "dayOne"), dayTwoMusic.addUri("http://s1.vocaroo.com/media/download_temp/Vocaroo_s1hjgoM7ziut.mp3", 46071, "dayTwo"), dayThreeMusic.addUri("http://s0.vocaroo.com/media/download_temp/Vocaroo_s0vkb5v18tSG.mp3", 31992, "dayThree"), excitedMusic.addUri("http://s1.vocaroo.com/media/download_temp/Vocaroo_s1v6UVCs3sBB.mp3", 21114, "excited");
var daysUntilReleaseFromPublish = getTimeDifferential(publishDate).days;
$(function() {
    releaseDate < new Date ? triggerAwesome() : (checkIsDaytime(), isDaytime ? dayInitialization() : nightInitialization(), setInterval(updateAndCheck, 1e3), setMoonSize(), songOfTheDay())
});
