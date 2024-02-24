document.addEventListener("DOMContentLoaded", function () {
    const draggableItems = document.querySelectorAll(".draggable-item");
    const calendar = document.getElementById("calendar");
    const calendarDaysInput = document.getElementById("calendar-days");
    const categoryFilter = document.getElementById("category-filter");

    draggableItems.forEach(item => {
        item.draggable = true;
        item.addEventListener("dragstart", dragStart);
    });

    calendar.addEventListener("dragover", dragOver);
    calendar.addEventListener("drop", drop);

    calendarDaysInput.addEventListener("input", updateCalendarDays);
    categoryFilter.addEventListener("change", updateCategoryFilter);
    updateCalendarDays(); // Initialize with default number of days
});

function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.textContent);
    e.dataTransfer.setData("category", e.target.dataset.category);
    e.dataTransfer.setData("duration", e.target.dataset.duration);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const category = e.dataTransfer.getData("category");
    const duration = parseInt(e.dataTransfer.getData("duration"), 10) || 1; // Default duration if not specified

    // Check if the location is already present in the day's itinerary
    const existingLocation = Array.from(e.target.children)
        .find(child => child.textContent.includes(data));

    if (!existingLocation) {
        const draggedItem = document.createElement("div");
        draggedItem.className = "draggable-item";
        draggedItem.textContent = `${data} (${duration} hours)\n${category}`;
        draggedItem.setAttribute("data-duration", duration);

        e.target.appendChild(draggedItem);
    }

    updateTotalDuration();
}

function updateCalendarDays() {
    const calendarDaysInput = document.getElementById("calendar-days");
    const calendar = document.getElementById("calendar");

    // Clear existing calendar content
    calendar.innerHTML = "";

    // Add new calendar days
    const numDays = parseInt(calendarDaysInput.value, 10);
    for (let i = 1; i <= numDays; i++) {
        const dayContainer = document.createElement("div");
        dayContainer.className = "droppable-container";
        dayContainer.textContent = `Day ${i}`;
        dayContainer.addEventListener("dragover", dragOver);
        dayContainer.addEventListener("drop", drop);
        calendar.appendChild(dayContainer);
    }
}

function updateCategoryFilter() {
    const selectedCategory = document.getElementById("category-filter").value;
    const draggableItems = document.querySelectorAll(".draggable-item");

    draggableItems.forEach(item => {
        const category = item.dataset.category;

        if (selectedCategory === "all" || selectedCategory === category) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}

function updateTotalDuration() {
    const calendarDays = document.querySelectorAll(".droppable-container");

    calendarDays.forEach(day => {
        const totalDuration = Array.from(day.children)
            .filter(item => item.classList.contains("draggable-item"))
            .reduce((sum, item) => sum + parseInt(item.dataset.duration, 10) || 0, 0);

        const totalDurationElement = document.createElement("div");
        totalDurationElement.className = "total-duration";
        totalDurationElement.textContent = `Total: ${totalDuration || 0} hours`;

        // Remove existing total duration if any
        const existingTotalDuration = day.querySelector(".total-duration");
        if (existingTotalDuration) {
            day.removeChild(existingTotalDuration);
        }

        day.appendChild(totalDurationElement);
    });
}

