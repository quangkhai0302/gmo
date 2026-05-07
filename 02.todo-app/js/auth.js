$(function() {
    const $tabs = $('.auth-tab');
    const $forms = $('.auth-form');
    const $status = $('#auth-status');
    const $swapButtons = $('.swap-mode');

    function setMode(mode) {
        $tabs.removeClass('active');
        $tabs.filter(`[data-mode="${mode}"]`).addClass('active');
        $forms.addClass('hidden');
        $forms.filter(`[data-mode="${mode}"]`).removeClass('hidden');
        $('#auth-mode-label').text(mode === 'login' ? 'Đăng nhập' : 'Đăng ký');
        $status.text('Sẵn sàng kết nối API khi backend hoàn tất.');
    }

    function serializeForm($form) {
        const raw = $form.serializeArray();
        return raw.reduce((acc, item) => {
            acc[item.name] = item.value;
            return acc;
        }, {});
    }

    $tabs.on('click', function() {
        setMode($(this).data('mode'));
    });

    $swapButtons.on('click', function() {
        setMode($(this).data('target'));
    });

    $forms.on('submit', function(e) {
        e.preventDefault();
        const mode = $(this).data('mode');
        const payload = serializeForm($(this));

        $status.text('Đang chờ xử lý...');

        // TODO: thay fetch API o day
        console.log('Auth payload', mode, payload);

        setTimeout(function() {
            $status.text('Đã sẵn sàng kết nối API.');
        }, 600);
    });

    setMode('login');
});
