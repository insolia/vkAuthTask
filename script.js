var expR = new RegExp('expires_in=(\\d*)&');
var resR = new RegExp('access_token=(\\w*)&');

function setCookie(key, value, expiresT) {
    var expires = new Date();
    expires.setTime(expires.getTime() + expiresT);
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

function checkAT() {
    var results = resR.exec(window.location.href);
    if (results !== null) {
        var expire = expR.exec(window.location.href);

        document.location.hash = '';
        var token = decodeURI(results[1]);
        setCookie('token', token, expire);
        return token
    }
    else {
        results = getCookie('token');
        if (results === null) {
            return 0
        } else {
            return results
        }
    }
}


function getFriends(token) {
    var url = 'https://api.vk.com/method/friends.get?order=hints&fields=nickname&name_case=nom&access_token=' + token + '&v=5.84';
    $.ajax({
        url: url,
        dataType: "jsonp",
        success: function (response) {
            $(".friends-container").append("<b>5 Ваших лучших друзей:</b> <br>");
            response.response.items.slice(0, 5000).forEach(function (t) {
                $(".friends-container").append(t.first_name + " " + t.last_name + "<br>")
            });
        }
    });
}

$(document).ready(function () {
    var b = $("button");
    b.on("click", function (event) {
        window.location.replace("https://oauth.vk.com/authorize?client_id=5164278&display=page&redirect_uri=https://insolia.github.io/vkAuthTask&scope=friends&response_type=token&v=5.84&state=123456");
    });
    var token = checkAT();
    if (token !== 0) {
        getFriends(token)
    } else {
        b.show();
    }

});

