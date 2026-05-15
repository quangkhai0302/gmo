/* ============================================================
   SCRIPT.JS — Login Logic
   jQuery + jQuery UI Dialog
   ============================================================ */

$(function () {

  /* ===========================================================
     HÀM HIỂN THỊ DIALOG
     - Dùng jQuery UI Dialog
     - Button OK nằm giữa
     - Nhấn OK: đóng dialog → gọi callback
     =========================================================== */
  function showDialog(message, callback) {
    // Đặt nội dung message (hiển thị màu đỏ theo CSS)
    $("#dialogMsg").text(message);

    // Mở jQuery UI Dialog
    $("#dialog").dialog({
      modal: true,            // Có overlay mờ phía sau
      width: 360,             // Chiều rộng dialog
      draggable: false,       // Không cho kéo
      resizable: false,       // Không cho resize
      buttons: {
        "Ok": function () {
          $(this).dialog("close");   // Đóng dialog
          if (callback) callback();  // Gọi callback nếu có
        }
      }
    });
  }

  /* ===========================================================
     HÀM HIỂN THỊ TOAST (cho thông báo thành công)
     - Toast xuất hiện góc phải trên
     - Tự biến mất sau 3 giây
     =========================================================== */
  function showToast(message) {
    var $toast = $(
      '<div class="toast-custom">' +
        '<i class="fa-solid fa-circle-check toast-icon"></i>' +
        '<span>' + message + '</span>' +
      '</div>'
    );

    $("body").append($toast);

    // Tự đóng sau 3 giây
    setTimeout(function () {
      $toast.addClass("is-leaving");
      setTimeout(function () {
        $toast.remove();
      }, 350);
    }, 3000);
  }

  /* ===========================================================
     NÚT HIỆN/ẨN MẬT KHẨU
     - Click icon mắt → chuyển type password ↔ text
     - Đổi icon fa-eye ↔ fa-eye-slash
     =========================================================== */
  $("#togglePassword").on("click", function () {
    var $input = $("#password");
    var $icon  = $(this).find("i");

    if ($input.attr("type") === "password") {
      $input.attr("type", "text");
      $icon.removeClass("fa-eye").addClass("fa-eye-slash");
    } else {
      $input.attr("type", "password");
      $icon.removeClass("fa-eye-slash").addClass("fa-eye");
    }
  });

  /* ===========================================================
     XỬ LÝ ĐĂNG NHẬP
     Khi submit form:
     1. Nếu username HOẶC password rỗng → Dialog lỗi
     2. Nếu đúng admin/admin → Toast thành công → hiện table
     3. Nếu sai → Dialog lỗi + hiệu ứng rung
     =========================================================== */
  $("#loginFormInner").on("submit", function (e) {
    e.preventDefault();

    var $btn = $("#loginBtn");
    var user = $.trim($("#username").val());
    var pass = $.trim($("#password").val());

    // --- Trường hợp 1: Username hoặc password rỗng ---
    if (user === "" || pass === "") {
      showDialog("Vui lòng nhập username và password!", function () {
        // Sau khi nhấn OK: focus vào username, xóa dữ liệu
        $("#username").val("").focus();
        $("#password").val("");
      });
      return;
    }

    // Hiệu ứng loading trên nút
    $btn.addClass("is-loading").prop("disabled", true);

    // Giả lập gọi API (1.5 giây)
    setTimeout(function () {
      $btn.removeClass("is-loading").prop("disabled", false);

      // --- Trường hợp 2: Đăng nhập thành công ---
      if (user === "admin" && pass === "admin") {
        showDialog("Đăng nhập thành công!", function () {
          // Không cần xóa, sẽ chuyển trang
        });

        // Sau 3 giây: ẩn form login, hiện table
        setTimeout(function () {
          $("#loginForm").fadeOut(400, function () {
            $("#usernameDisplay").text(user);
            $("#tableSection").fadeIn(400);
          });
        }, 3000);

      // --- Trường hợp 3: Sai thông tin ---
      } else {
        showDialog("Thông tin đăng nhập không chính xác.", function () {
          // Sau khi nhấn OK: focus username, xóa dữ liệu
          $("#username").val("").focus();
          $("#password").val("");
        });

        // Hiệu ứng rung card
        $(".login-card").css("animation", "none");
        setTimeout(function () {
          $(".login-card").css("animation", "shake 0.5s ease");
        }, 10);
      }
    }, 1500);
  });

  /* ===========================================================
     SOCIAL LOGIN
     Click icon → mở trang mới
     =========================================================== */
  $("#gg").on("click", function () {
    window.open("https://www.google.com", "_blank");
  });

  $("#fb").on("click", function () {
    window.open("https://www.facebook.com", "_blank");
  });

  $("#tw").on("click", function () {
    window.open("https://www.twitter.com", "_blank");
  });

  /* ===========================================================
     QUÊN MẬT KHẨU
     =========================================================== */
  $("#forgotPassword").on("click", function (e) {
    e.preventDefault();
    showDialog("Liên kết đặt lại mật khẩu đã được gửi đến email của bạn.");
  });

  /* ===========================================================
     ENTER KEY — nhấn Enter ở username → chuyển qua password
     =========================================================== */
  $("#username").on("keypress", function (e) {
    if (e.which === 13) {
      e.preventDefault();
      $("#password").focus();
    }
  });

});
