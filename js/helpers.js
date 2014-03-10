/* Variable to detect mobile devices*/
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

/* Check transition support*/
function supportsTransitions() {
    var b = document.body || document.documentElement;
    var s = b.style;
    var p = 'transition';
    if(typeof s[p] == 'string') {return true; }

    // Tests for vendor specific prop
    v = ['Moz', 'webkit', 'Webkit', 'Khtml', 'O', 'ms'],
        p = p.charAt(0).toUpperCase() + p.substr(1);
    for(var i=0; i<v.length; i++) {
        if(typeof s[v[i] + p] == 'string') { return true; }
    }
    return false;
}
/*Wait for the moment when event is finished*/
var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
        if (!uniqueId) {
            uniqueId = "Don't call this twice without a uniqueId";
        }
        if (timers[uniqueId]) {
            clearTimeout(timers[uniqueId]);
        }
        timers[uniqueId] = setTimeout(callback, ms);
    };
})();