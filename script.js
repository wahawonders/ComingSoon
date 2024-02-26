document.addEventListener("DOMContentLoaded", function () {
    const calendarDaysInput = document.getElementById("calendar-days");
    const calendar = document.getElementById("calendar");
    const categoryFilter = document.getElementById("category-filter");
    const cityFilter = document.getElementById("city-filter");

    calendarDaysInput.addEventListener("input", updateCalendarDays);
    categoryFilter.addEventListener("change", updateFilters);
    cityFilter.addEventListener("change", updateFilters);

    updateCalendarDays(); // Initialize with default number of days
});

function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.textContent);
    e.dataTransfer.setData("category", e.target.dataset.category);
    e.dataTransfer.setData("city", e.target.dataset.city);
    e.dataTransfer.setData("duration", e.target.dataset.duration);
    e.dataTransfer.setData("cost", e.target.dataset.cost);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const category = e.dataTransfer.getData("category");
    const city = e.dataTransfer.getData("city");
    const duration = parseInt(e.dataTransfer.getData("duration"), 10) || 1; // Default duration if not specified
    const cost = parseInt(e.dataTransfer.getData("cost"), 10) || 0; // Default cost if not specified

    const dropTarget = getDropTarget(e.target);

    if (dropTarget) {
        // Check if the location is already present in the day's itinerary
        const existingLocation = Array.from(dropTarget.children)
            .find(child => child.textContent.includes(data));

        if (!existingLocation) {
            const draggedItem = document.createElement("div");
            draggedItem.className = "draggable-item";
            draggedItem.textContent = `${data} (${duration} hours)\n${category} - ${city}\nCost: ${cost} AED`;
            draggedItem.setAttribute("data-duration", duration);
            draggedItem.setAttribute("data-city", city);
            draggedItem.setAttribute("data-category", category);
            draggedItem.setAttribute("data-cost", cost);

            // Add a delete button to each draggable-item
            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.addEventListener("click", () => deleteItem(draggedItem));

            draggedItem.appendChild(deleteButton);

            dropTarget.appendChild(draggedItem);
        }
    }

    updateTotalDurationAndCost();
}

function getDropTarget(element) {
    while (element) {
        if (element.classList.contains("droppable-container")) {
            return element;
        }
        element = element.parentElement;
    }
    return null;
}

// ... (previous script.js code) ...

function updateFilters() {
    const selectedCategory = document.getElementById("category-filter").value;
    const selectedCity = document.getElementById("city-filter").value;
    const selectedChooseHotel = document.getElementById("choose-hotel-filter").value;
    const draggableItems = document.querySelectorAll("#Hotel-container .draggable-item");

    draggableItems.forEach(item => {
        const category = item.dataset.category;
        const city = item.dataset.city;

        // Assume that "Experience Stay" and "Standard Stay" are hotel categories
        const isExperienceStay = category === "Experience Stay";
        const isStandardStay = category === "Standard Stay";

        const categoryMatch = selectedCategory === "all" || selectedCategory === category;
        const cityMatch = selectedCity === "all" || selectedCity === city;
        const chooseHotelMatch = selectedChooseHotel === "all" || 
                                (selectedChooseHotel === "Experience Stay" && isExperienceStay) ||
                                (selectedChooseHotel === "Standard Stay" && isStandardStay);

        if (categoryMatch && cityMatch && chooseHotelMatch) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });

    // Update the locations filter as well
    const selectedLocationCategory = document.getElementById("category-filter").value;
    const selectedLocationCity = document.getElementById("city-filter").value;
    const draggableLocationItems = document.querySelectorAll("#locations-container .draggable-item");

    draggableLocationItems.forEach(item => {
        const category = item.dataset.category;
        const city = item.dataset.city;

        const categoryMatch = selectedLocationCategory === "all" || selectedLocationCategory === category;
        const cityMatch = selectedLocationCity === "all" || selectedLocationCity === city;

        if (categoryMatch && cityMatch) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
}






// ... (remaining script.js code) ...


function updateTotalDurationAndCost() {
    const calendarDays = document.querySelectorAll(".droppable-container");

    calendarDays.forEach(day => {
        const totalDuration = Array.from(day.children)
            .filter(item => item.classList.contains("draggable-item"))
            .reduce((sum, item) => sum + parseInt(item.dataset.duration, 10) || 0, 0);

        const totalCost = Array.from(day.children)
            .filter(item => item.classList.contains("draggable-item"))
            .reduce((sum, item) => sum + parseInt(item.dataset.cost, 10) || 0, 0);

        const totalDurationElement = document.createElement("div");
        totalDurationElement.className = "total-duration";
        totalDurationElement.textContent = `Total: ${totalDuration || 0} hours, Total Cost: ${totalCost || 0} AED`;

        // Remove existing total duration if any
        const existingTotalDuration = day.querySelector(".total-duration");
        if (existingTotalDuration) {
            day.removeChild(existingTotalDuration);
        }

        day.appendChild(totalDurationElement);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // ... (existing code)

    document.getElementById("export-btn").addEventListener("click", exportToCSV);
	const chooseHotelFilter = document.getElementById("choose-hotel-filter");

    chooseHotelFilter.addEventListener("change", updateFilters);
});

function exportToCSV() {
    const calendarDays = document.querySelectorAll(".droppable-container");

    if (calendarDays.length === 0) {
        console.warn("No data to export.");
        return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    calendarDays.forEach((day, index) => {
        const dayItems = Array.from(day.children)
            .filter(item => item.classList.contains("draggable-item"));

        dayItems.forEach(item => {
            const data = [
                `Day ${index + 1}`,
                item.textContent.trim(),
                item.dataset.duration,
                item.dataset.city,
                item.dataset.category,
                item.dataset.cost
            ];
            csvContent += data.join(",") + "\n";
        });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "calendar_data.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "calendar_data.csv".
}


function deleteItem(item) {
    const parentContainer = item.parentNode;
    parentContainer.removeChild(item);
    updateTotalDurationAndCost();
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

    // Apply event listeners to draggable items
    const draggableItems = document.querySelectorAll(".draggable-item");
    draggableItems.forEach(item => {
        item.draggable = true;
        item.addEventListener("dragstart", dragStart);
    });
}
