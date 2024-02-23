document.addEventListener("DOMContentLoaded", function () {
    const draggableItems = document.querySelectorAll(".draggable-item");
    const droppableContainers = document.querySelectorAll(".droppable-container");

    draggableItems.forEach(item => {
        item.draggable = true;
        item.addEventListener("dragstart", dragStart);
    });

    droppableContainers.forEach(container => {
        container.addEventListener("dragover", dragOver);
        container.addEventListener("drop", drop);
    });
});

function dragStart(e) {
    e.dataTransfer.setData("text/plain", e.target.textContent);
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text/plain");
    const duration = e.target.dataset.duration || 1; // Default duration if not specified

    const draggedItem = document.createElement("div");
    draggedItem.className = "draggable-item";
    draggedItem.textContent = `${data} (${duration} days)`;

    e.target.appendChild(draggedItem);
}
