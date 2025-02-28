document.addEventListener("DOMContentLoaded", function () {
    const calendarGrid = document.getElementById("calendarGrid");
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const memoModal = document.getElementById("memoModal");
    const memoText = document.getElementById("memoText");
    const saveMemo = document.getElementById("saveMemo");
    const closeModal = document.getElementById("closeModal");
    const selectedDateDisplay = document.getElementById("selectedDate");
    const monthName = document.getElementById("monthName");

    let selectedDate = "";
    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let currentMonth = currentDate.getMonth();

    function updateCalendar(year, month) {
        calendarGrid.innerHTML = "";
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        monthName.textContent = `${year}年${month + 1}月`;
    
        for (let i = 0; i < firstDay; i++) {
            let emptyCell = document.createElement("div");
            emptyCell.classList.add("day-cell", "empty");
            calendarGrid.appendChild(emptyCell);
        }
    
        for (let i = 1; i <= daysInMonth; i++) {
            let dayCell = document.createElement("div");
            dayCell.classList.add("day-cell");
            dayCell.textContent = i;
    
            let formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
            dayCell.dataset.date = formattedDate;
    
            // 📌 曜日を取得
            let dayOfWeek = new Date(year, month, i).getDay();
            if (dayOfWeek === 6) dayCell.classList.add("saturday"); // 土曜日
            if (dayOfWeek === 0) dayCell.classList.add("sunday");   // 日曜日
    
            dayCell.addEventListener("click", function () {
                selectedDate = this.dataset.date;
                selectedDateDisplay.textContent = `メモ - ${selectedDate}`;
                memoText.value = "";
                memoModal.style.display = "flex";
            });
    
            calendarGrid.appendChild(dayCell);
        }
    
        loadMemos();
    }
    
    async function loadHolidays(year) {
        const response = await fetch(`/get_holidays/${year}/`);
        const holidays = await response.json();
        
        document.querySelectorAll('.day-cell').forEach(cell => {
            const date = cell.getAttribute('data-date'); // 例: "2025-01-01"
            if (holidays[date]) {
                cell.innerHTML += `<div class="holiday">${holidays[date]}</div>`;
                cell.style.backgroundColor = "#ffebee"; // 祝日背景色を設定
            }
        });
    }
    
    // ページ読み込み時に実行
    document.addEventListener("DOMContentLoaded", () => {
        const year = new Date().getFullYear();
        loadHolidays(year);
    });
    

    async function loadMemos() {
        try {
            const response = await fetch("/get_memos/");
            if (!response.ok) throw new Error("データの取得に失敗しました");
            const data = await response.json();
            const memos = data.memos;

            document.querySelectorAll(".day-cell").forEach(dayCell => {
                const date = dayCell.dataset.date;
                if (memos[date]) {
                    let memoIndicator = document.createElement("div");
                    memoIndicator.classList.add("memo-indicator");
                    memoIndicator.textContent = `${memos[date].length}件のメモあり`;
                    dayCell.appendChild(memoIndicator);
                    dayCell.classList.add("has-memo"); // メモがある日付にクラスを付与
                }
            });
        } catch (error) {
            console.error("メモの読み込みエラー:", error);
        }
    }

    saveMemo.addEventListener("click", async function () {
        if (!selectedDate) return;

        try {
            const response = await fetch("/save_memo/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ date: selectedDate, text: memoText.value }),
            });

            if (!response.ok) throw new Error("メモの保存に失敗しました");

            memoModal.style.display = "none";
            loadMemos(); // 🔥 カレンダー全体を更新せずにメモのみ更新
        } catch (error) {
            console.error("メモ保存エラー:", error);
        }
    });

    closeModal.addEventListener("click", function () {
        memoModal.style.display = "none";
    });

    prevMonthBtn.addEventListener("click", function () {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar(currentYear, currentMonth);
    });

    nextMonthBtn.addEventListener("click", function () {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        updateCalendar(currentYear, currentMonth);
    });

    updateCalendar(currentYear, currentMonth);
});

