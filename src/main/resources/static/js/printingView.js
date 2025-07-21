// 🌐 URL de ton backend Render
const API_BASE_URL = 'https://todo-app-28ry.onrender.com';

// Variable globale pour stocker la liste des tâches actuellement affichée (non filtrée, non triée)
let currentFilter = 'all'; // 'all', 'done'
let currentSortOrder = 'default'; // 'default', 'recent'

let allBtn, doneBtn, orderBtn;

// -----------------------------------LOADING TASKS ON HOME_PAGE WITH FILTERING MANAGEMENT---------------

document.addEventListener("DOMContentLoaded", async () => {
        setupFilteringAndSorting();
        await applyFiltersAndSort();
});

function screenRefresh(taskListToDisplay) {
        const screenList = document.querySelector(".taskList ul");
        screenList.innerHTML = "";

        if (taskListToDisplay.length === 0) {
                screenList.innerHTML = `
            <h2>No task yet, you can add them now</h2>
            <p>Happy Browse !</p>
        `;
                return;
        }

        taskListToDisplay.forEach((task) => {
                const taskItem = document.createElement("li");
                taskItem.dataset.taskId = task.id;

                const isCompleted = task.status === true || task.status === "completed";
                const statusImageSrc = isCompleted ? "images/done.png" : "images/loading.webp";
                const markDoneButtonDisabled = isCompleted ? 'disabled' : '';

                taskItem.innerHTML = `
            <div class="topTask">
                <h2>${task.title}</h2>
                <img src="${statusImageSrc}" alt="status image">
            </div>
            <div class="text">
                <p>${task.details}</p>
            </div>
            <div class="timing">
                <div class="date">
                    <b>ON: </b>
                    <span class="dating">${task.limitationDate}</span>
                </div>
                <div class="time">
                    <b>AT: </b>
                    <span class="time">${task.limitationTime}</span>
                </div>
            </div>
            <div class="btn">
                <button class="markDone" ${markDoneButtonDisabled}>
                    <img src="images/done.png" alt="done image">
                    <p>MARK AS DONE</p>
                </button>
                <button class="update">
                    <img src="images/update.png" alt="pencil image">
                    <p>UPDATE</p>
                </button>
                <button class="delete">
                    <img src="images/delete.png" alt="delete image">
                    <p>DELETE</p>
                </button>
            </div>
        `;

                screenList.appendChild(taskItem);
        });
}

// ----------------------------------------------------------------✔️ Fonction centrale qui applique filtre + tri--------------------------
async function applyFiltersAndSort() {
        let listToDisplay = [];

        if (currentFilter === 'all') {
                listToDisplay = currentSortOrder === "default"
                    ? await loadTasks()
                    : await loadAllSortedTasks();
        } else if (currentFilter === 'done') {
                listToDisplay = currentSortOrder === "default"
                    ? await loadTasksCompleted()
                    : await loadAllCompletedSortedTasks();
        }

        screenRefresh(listToDisplay);
        updateButtonStyles();
}

// ----------------------------------------------------✔️ Mise à jour visuelle des boutons de filtre------------------------------
function updateButtonStyles() {
        allBtn.style.background = currentFilter === 'all' ? "#004D3E" : "#fff";
        allBtn.style.color = currentFilter === 'all' ? "#fff" : "#000";

        doneBtn.style.background = currentFilter === 'done' ? "#004D3E" : "#fff";
        doneBtn.style.color = currentFilter === 'done' ? "#fff" : "#000";

        orderBtn.style.background = currentSortOrder === 'recent' ? "#004D3E" : "#fff";
        orderBtn.style.color = currentSortOrder === 'recent' ? "#fff" : "#000";
}

// ---------------------------------------------------------------- ✔️ Écouteurs des boutons de filtre/tri----------------------------------------
function setupFilteringAndSorting() {
        allBtn = document.querySelector(".filterZone button.all");
        doneBtn = document.querySelector(".filterZone button.done");
        orderBtn = document.querySelector(".filterZone button.order");

        allBtn.addEventListener('click', async () => {
                currentFilter = 'all';
                currentSortOrder = 'default';
                await applyFiltersAndSort();
        });

        doneBtn.addEventListener('click', async () => {
                currentFilter = 'done';
                currentSortOrder = 'default';
                await applyFiltersAndSort();
        });

        orderBtn.addEventListener('click', async () => {
                currentSortOrder = currentSortOrder === 'default' ? 'recent' : 'default';
                await applyFiltersAndSort();
        });

        updateButtonStyles();
}
