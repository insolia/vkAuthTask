function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function checkAT() {
    var results = new RegExp('access_token=(\\w*)&').exec(window.location.href);
    if (results !== null) {
        document.location.hash = '';
        return decodeURI(results[1]) || 0;
    }
    else {
        results = getCookie('at');
        if (results === null) {
            return 0
        } else {
            return results
        }
    }
}


function getFriends(at) {
    var url = 'https://api.vk.com/method/friends.get?order=hints&fields=nickname&name_case=nom&access_token=' + at + '&v=5.84';
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: function (response) {
            $(".friends-container").append("<b>5 Ваших лучших друзей:</b> <br>");
            response.response.items.slice(0, 5).forEach(function (t) {
                $(".friends-container").append(t.first_name + " " + t.last_name + "<br>")
            });

        }
    });
}

$(document).ready(function () {
    var b = $("button");
    b.on("click", function (event) {
        window.location.replace("https://oauth.vk.com/authorize?client_id=5164278&display=page&redirect_uri=http://localhost:63342/jobHunt/vkAuth/index.html&scope=friends&response_type=token&v=5.84&state=123456");
    });
    var at = checkAT();
    if (at !== 0) {
        setCookie('at', at);
        getFriends(at)
    } else {
        b.show();
    }

});
