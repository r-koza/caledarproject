// カレンダーを表示するための関数
const calendarGrid = document.getElementById("calendarGrid");
const monthName = document.getElementById("monthName");

let currentDate = new Date();

// 日付を表示する関数
function displayCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    monthName.textContent = `${year}年${month + 1}月`;

    const firstDayOfWeek = firstDay.getDay(); // 1日の曜日
    const lastDate = lastDay.getDate(); // 月末の日付

    // カレンダーグリッドをクリア
    calendarGrid.innerHTML = '';

    // 1日までの空白を追加
    for (let i = 0; i < firstDayOfWeek; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.classList.add("day-cell");
        calendarGrid.appendChild(emptyCell);
    }

    // 実際の日付を追加
    for (let date = 1; date <= lastDate; date++) {
        const dayCell = document.createElement("div");
        dayCell.classList.add("day-cell");
        dayCell.textContent = date;

        // 保存されたメモがあれば「メモあり」と表示
        const savedMemo = localStorage.getItem(`memo-${year}-${month + 1}-${date}`);
        if (savedMemo) {
            const memoIndicator = document.createElement("span");
            memoIndicator.classList.add("memo-indicator");  // メモありの表示にスタイルを適用
            memoIndicator.textContent = "メモあり";  // 「メモあり」のテキスト
            dayCell.appendChild(memoIndicator);  // メモありの表示を日付の下に追加
        }

        dayCell.addEventListener("click", () => openMemoModal(date));
        calendarGrid.appendChild(dayCell);
    }
}

// メモ入力モーダルを開く関数
function openMemoModal(date) {
    const modal = document.getElementById("memoModal");
    const memoText = document.getElementById("memoText");
    const saveMemoButton = document.getElementById("saveMemo");
    const closeModalButton = document.getElementById("closeModal");

    modal.style.display = "flex"; // モーダルを表示
    memoText.value = localStorage.getItem(`memo-${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${date}`) || '';

    saveMemoButton.onclick = function () {
        const memoContent = memoText.value;
        localStorage.setItem(`memo-${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${date}`, memoContent);
        modal.style.display = "none"; // モーダルを閉じる
        displayCalendar(); // カレンダーを再描画
    };

    closeModalButton.onclick = function () {
        modal.style.display = "none"; // モーダルを閉じる
    };
}

// 月を切り替える関数
document.getElementById("prevMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    displayCalendar();
});

document.getElementById("nextMonth").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    displayCalendar();
});

// 初期カレンダー表示
displayCalendar();
