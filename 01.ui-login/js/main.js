$(function() {
    // Hiển thị dialog khi click vào nút "Show Dialog"
    function showDiaLog(message, callback) {
        $("#dialogMsg").text(message);

        $("#dialog").dialog({
            modal: true,
            buttons: {
                "OK": function(){
                    $(this).dialog("close");
                    if (callback) callback();
                },
            }
        })
    }

    $("#loginBtn").click(function() {
        let user = $("#username").val().trim();
        let pass = $("#password").val().trim();

        if (user === "" && pass === "") {
            showDiaLog("Vui lòng nhập username và password!", function() {
                $("#username").val("").focus();
                $("#password").val("");
            })
        } else if (user === "admin" && pass === "admin") {
            showDiaLog("Đăng nhập thành công!");

            setTimeout(function() {
                $("#loginForm").hide();
                $("#tableSection").show();
                $("#usernameDisplay").text(user);
            }, 1000);
        } else {
            showDiaLog("Đăng nhập thất bại! Vui lòng thử lại.", function() {
                $("#username").val("").focus();
                $("#password").val("");
            })
        }
    });

    $("#fb").click(() => window.open("https://www.facebook.com", "_blank"));
    $("#tw").click(() => window.open("https://www.twitter.com", "_blank"));
    $("#gg").click(() => window.open("https://www.google.com", "_blank"));
})