let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];
let currentFilter = 'all';

function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function getVisibleTasks() {
    const query = $('#search').val().toLowerCase().trim();
    
    return tasks.filter(task => {
        if (currentFilter === 'completed' && !task.completed) return false;
        if (currentFilter === 'pending' && task.completed) return false;
        if (query && !task.text.toLowerCase().includes(query)) return false;
        return true;
    })
}

function renderTasks() {
    const visible = getVisibleTasks();

    $("#todo-list").empty();

    if (visible.length === 0) {
        $('#empty-state').show();
    } else {
        $('#empty-state').hide();
    }

    visible.forEach(task => {
        let item = $(`
        <li class="todo-item" data-id="${task.id}">
            <span class="todo-text ${task.completed ? "done" : ""}"></span>
            <div class="actions">
                <button class="edit-btn">Sửa</button>
                <button class="delete-btn">Xóa</button>
            </div>
        </li>
        `)

        item.find('.todo-text').text(task.text);
        $('#todo-list').append(item);
    })

    updateProgress();
    updateStats();
}

// Thêm tính năng chỉnh sửa
$(document).on('click', '.edit-btn', function() {
    const row = $(this).closest('.todo-item');
    const textEl = row.find('.todo-text');
    const currentText = textEl.text();

    // Tránh tạo input nhiều lần
    if (row.find('.edit-input').length) return;

    const input = $(`<input type="text" class="edit-input" />`).val(currentText);
    textEl.replaceWith(input);
    input.focus();
    input[0].setSelectionRange(currentText.length, currentText.length);
})

// Lưu chỉnh sửa khi blur hoặc nhấn Enter
$(document).on('blur', '.edit-input', function() {
    const id = $(this).closest('.todo-item').data('id');
    const newValue = $(this).val().trim();

    tasks = tasks.map(task => {
        if (task.id === id) {
            if (newValue !== "") task.text = newValue;
        }
        return task;
    })

    saveTasks();
    renderTasks();
})

// Enter để lưu
$(document).on('keypress', '.edit-input', function(e) {
    if (e.which === 13) {
        $(this).blur();
    }
})

// Nhấn Esc để hủy
$(document).on('keydown', '.edit-input', function(e) {
    if (e.key === 'Escape') {
        renderTasks();
    }
})

// Thêm tính năng cập nhật tiến độ
function updateProgress() {
    if (tasks.length === 0) {
        $('#progress-fill').css('width', '0%');
        $('.progress-info').text('0% hoàn thành');
        return;
    }

    let doneTasks = tasks.filter(task => task.completed).length;
    let percent = Math.round((doneTasks / tasks.length) * 100);

    console.log(percent);
    $('#progress-fill').css('width', `${percent}%`);
    $('.progress-info   ').text(`${percent}% hoàn thành`);
}

// Thêm tính năng thống kê
function updateStats() {
    let total = tasks.length;
    let done = tasks.filter(task => task.completed).length;
    let pending = total - done;

    $('#total').text(total);
    $('#done').text(done);
    $('#pending').text(pending);

    let percent = total === 0 ? 0 : Math.round((done / total) * 100);
    $('#progress-fill').css('width', `${percent}%`);
}

$("#add-btn").click(function(e) {
    e.preventDefault();

    let value = $("#todo-input").val();

    if (value.trim() === "") {
        alert("Vui lòng nhập công việc!");
        return;
    }

    let newTask = {
        id: Date.now(),
        text: value,
        completed: false
    }

    tasks.push(newTask);
    saveTasks();
    renderTasks();

    $("#todo-input").val("");
})

$(document).on('click', '.delete-btn', function() {
    let id = $(this).closest('.todo-item').data('id');

    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
})

$('#search').on('input', function() {
    renderTasks();
})

$('.filter button').click(function() {
    currentFilter = $(this).data('filter');

    $('.filter button').removeClass('active');
    $(this).addClass('active');

    renderTasks();
})

// Handler click vào chữ để toggle done
$(document).on('click', '.todo-text', function() {
    let id = $(this).closest('.todo-item').data('id');

    tasks = tasks.map(task => {
        if (task.id === id) task.completed = !task.completed;
        return task;
    })

    saveTasks();
    renderTasks();
})

renderTasks();