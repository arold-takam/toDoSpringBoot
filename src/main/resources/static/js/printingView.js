// URL de base du backend
const API_BASE_URL = 'https://todo-app-28ry.onrender.com';

// Variables globales
let currentFilter = 'all'; // 'all', 'done'
let currentSortOrder = 'default'; // 'default', 'recent'

let allBtn, doneBtn, orderBtn;

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

async function applyFiltersAndSort() {
        let listToDisplay = [];

        if (currentFilter === 'all') {
                listToDisplay = (currentSortOrder === "default")
                    ? await loadTasks()
                    : await loadAllSortedTasks();
        } else if (currentFilter === 'done') {
                listToDisplay = (currentSortOrder === "default")
                    ? await loadTasksCompleted()
                    : await loadAllCompletedSortedTasks();
        }

        screenRefresh(listToDisplay);
        updateButtonStyles();
}

function updateButtonStyles() {
        allBtn.style.background = currentFilter === 'all' ? "#004D3E" : "#fff";
        allBtn.style.color = currentFilter === 'all' ? "#fff" : "#000";

        doneBtn.style.background = currentFilter === 'done' ? "#004D3E" : "#fff";
        doneBtn.style.color = currentFilter === 'done' ? "#fff" : "#000";

        orderBtn.style.background = currentSortOrder === 'recent' ? "#004D3E" : "#fff";
        orderBtn.style.color = currentSortOrder === 'recent' ? "#fff" : "#000";
}

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

// --- API Fetch Functions ---

async function loadTasks() {
        try {
                const res = await fetch(`${API_BASE_URL}/task/get`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.json();
        } catch (e) {
                console.error("Erreur chargement tâches:", e);
                document.querySelector(".taskList ul").innerHTML = `<p style="color:red;">Impossible de charger les tâches.</p>`;
                return [];
        }
}

async function loadTasksCompleted() {
        try {
                const res = await fetch(`${API_BASE_URL}/task/get/completed`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.json();
        } catch (e) {
                console.error("Erreur chargement tâches complétées:", e);
                return [];
        }
}

async function loadAllSortedTasks() {
        try {
                const res = await fetch(`${API_BASE_URL}/task/get/sorted`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.json();
        } catch (e) {
                console.error("Erreur chargement tâches triées:", e);
                return [];
        }
}

async function loadAllCompletedSortedTasks() {
        try {
                const res = await fetch(`${API_BASE_URL}/task/get/completed/sorted`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.json();
        } catch (e) {
                console.error("Erreur chargement tâches complétées triées:", e);
                return [];
        }
}

async function getTaskByID(id) {
        try {
                const res = await fetch(`${API_BASE_URL}/task/get/${id}`);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.json();
        } catch (e) {
                console.error("Erreur chargement tâche:", e);
                return null;
        }
}

async function updateTask(id, updatedTask) {
        try {
                const res = await fetch(`${API_BASE_URL}/task/update/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedTask)
                });
                if (!res.ok) {
                        const text = await res.text();
                        throw new Error(`HTTP ${res.status}: ${text}`);
                }
                const result = await res.json();
                console.log("Tâche mise à jour:", result);
                return result;
        } catch (e) {
                console.error("Erreur updateTask:", e);
                return null;
        }
}

async function deleteTask(id) {
        try {
                const res = await fetch(`${API_BASE_URL}/task/delete/${id}`, { method: 'DELETE' });
                if (!res.ok) {
                        const text = await res.text();
                        throw new Error(`HTTP ${res.status}: ${text}`);
                }
                console.log(`Tâche ${id} supprimée.`);
                return true;
        } catch (e) {
                console.error("Erreur deleteTask:", e);
                return false;
        }
}

// -------------- Update Form Management --------------

const updateZone = document.querySelector(".upd");
let currentUpdatingTaskID = null;

const updateForm = document.querySelector(".upd form");

const inputTitle = updateForm.querySelector(".title");
const inputDetails = updateForm.querySelector(".description");
const inputDate = updateForm.querySelector(".chrono .day");
const inputTime = updateForm.querySelector(".chrono .hour");

const statusYesRadio = updateForm.querySelector("#yes");
const statusNoRadio = updateForm.querySelector("#no");

document.querySelector(".taskList ul").addEventListener("click", async (e) => {
        if (e.target.closest(".update")) {
                updateZone.style.opacity = "1";
                updateZone.style.scale = "1";

                const liElement = e.target.closest("li");
                currentUpdatingTaskID = parseInt(liElement.dataset.taskId);

                const taskFound = await getTaskByID(currentUpdatingTaskID);

                if (!taskFound) {
                        alert("Tâche non trouvée ou erreur de chargement. Veuillez réessayer.");
                        updateZone.style.opacity = "0";
                        updateZone.style.scale = "0";
                        return;
                }

                inputTitle.value = taskFound.title;
                inputDetails.value = taskFound.details;
                inputDate.value = taskFound.limitationDate;
                inputTime.value = taskFound.limitationTime?.substring(0, 5) || "";

                if (taskFound.status === true) {
                        statusYesRadio.checked = true;
                        statusNoRadio.checked = false;
                } else {
                        statusNoRadio.checked = true;
                        statusYesRadio.checked = false;
                }
        }

        if (e.target.closest(".delete")) {
                const liElement = e.target.closest("li");
                const itemID = parseInt(liElement.dataset.taskId);

                const deleted = await deleteTask(itemID);
                if (deleted) liElement.remove();
        }
});

updateForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (currentUpdatingTaskID === null) {
                alert("Impossible de mettre à jour la tâche: ID manquant.");
                return;
        }

        const updatedTitle = inputTitle.value.trim();
        const updatedDetails = inputDetails.value.trim();
        const updatedLimitationDate = inputDate.value.trim();
        const updatedLimitationTime = inputTime.value.trim();
        const updatedStatus = statusYesRadio.checked;

        if (!updatedTitle || !updatedDetails) {
                alert("Le titre et les détails ne peuvent pas être vides.");
                return;
        }

        const taskDataToSend = {
                title: updatedTitle,
                details: updatedDetails,
                status: updatedStatus,
                limitationDate: updatedLimitationDate,
                limitationTime: updatedLimitationTime
        };

        await updateTask(currentUpdatingTaskID, taskDataToSend);

        updateZone.style.opacity = "0";
        updateZone.style.scale = "0";
        currentUpdatingTaskID = null;
        await applyFiltersAndSort();
});
