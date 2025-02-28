document.addEventListener("DOMContentLoaded", function () {
    const prevMonthBtn = document.getElementById("prevMonth");
    const nextMonthBtn = document.getElementById("nextMonth");
    const monthName = document.getElementById("monthName");
    const calendarGrid = document.getElementById("calendarGrid");
    const memoModal = document.getElementById("memoModal");
    const saveMemoBtn = document.getElementById("saveMemo");
    const closeModalBtn = document.getElementById("closeModal");
    const memoText = document.getElementById("memoText");

    let currentDate = new Date();
    let selectedDate = null;
    let memos = JSON.parse(localStorage.getItem("memos")) || {};

    function renderCalendar(date) {
        const month = date.getMonth();
        const year = date.getFullYear();
        monthName.textContent = `${year}年${month + 1}月`;

        const firstDay = new Date(year, month, 1);
        const firstDayOfWeek = firstDay.getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const days = [];
        for (let i = 0; i < firstDayOfWeek; i++) {
            days.push("");
        }
        for (let i = 1; i <= lastDate; i++) {
            days.push(i);
        }
        while (days.length % 7 !== 0) {
            days.push("");
        }

        calendarGrid.innerHTML = "";
        let dayIndex = 0;

        for (let row = 0; row < days.length / 7; row++) {
            for (let col = 0; col < 7; col++) {
                const dayCell = document.createElement("div");
                dayCell.classList.add("day-cell");
                const day = days[dayIndex] || "";

                dayCell.textContent = day;

                if (day !== "" && memos[`${year}-${month + 1}-${day}`]) {
                    const memoIndicator = document.createElement("span");
                    memoIndicator.classList.add("memo-indicator");
                    memoIndicator.textContent = "メモあり";
                    dayCell.appendChild(memoIndicator);
                }

                if (col === 0) {
                    dayCell.classList.add("sunday");
                } else if (col === 6) {
                    dayCell.classList.add("saturday");
                }

                if (day !== "") {
                    dayCell.addEventListener("click", () => {
                        selectedDate = day;
                        openMemoModal(year, month, day);
                    });
                }

                calendarGrid.appendChild(dayCell);
                dayIndex++;
            }
        }
    }

    function openMemoModal(year, month, day) {
        memoModal.style.display = "flex";
        selectedDate = `${year}-${month + 1}-${day}`;
        memoText.value = memos[selectedDate] || "";

        saveMemoBtn.onclick = function () {
            const memoContent = memoText.value;
            if (memoContent.trim() === "") {
                delete memos[selectedDate];
            } else {
                memos[selectedDate] = memoContent;
            }
            localStorage.setItem("memos", JSON.stringify(memos));
            memoModal.style.display = "none";
            renderCalendar(currentDate);
        };

        closeModalBtn.onclick = function () {
            memoModal.style.display = "none";
        };
    }

    function closeMemoModal() {
        memoModal.style.display = "none";
    }

    prevMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthBtn.addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    window.addEventListener("click", (e) => {
        if (e.target === memoModal) {
            closeMemoModal();
        }
    });

    renderCalendar(currentDate);
});

