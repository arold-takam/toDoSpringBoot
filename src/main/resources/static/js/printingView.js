// Variable globale pour stocker la liste des tâches actuellement affichée (non filtrée, non triée)
let currentFilter = 'all'; // 'all', 'done'
let currentSortOrder = 'default'; // 'default', 'recent'

let allBtn, doneBtn, orderBtn;

// -----------------------------------LOADING TASKS O HOME_PAGE WITH FILTERING MANAGEMENT---------------

document.addEventListener("DOMContentLoaded", async () => {
        setupFilteringAndSorting();

        await applyFiltersAndSort();
});

function screenRefresh(taskListToDisplay) {
        const screenList = document.querySelector(".taskList ul");
        console.log("Élément UL de la liste de tâches:", screenList);

        screenList.innerHTML = ""; // Vide le contenu de la liste, string vide, pas d'espace

        if (taskListToDisplay.length === 0) {
                screenList.innerHTML = `
            <h2>No task yet, you can add them now</h2>
            <p>Happy Browse !</p>
        `;
                return; // Arrête la fonction si aucune tâche à afficher
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
                <p>${task.details}</p> </div>
            <div class="timing">
                <div class="date">
                    <b>ON: </b>
                    <span class="dating">${task.limitationDate}</span> </div>
                <div class="time">
                    <b>AT: </b>
                    <span class="time">${task.limitationTime}</span> </div>
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

// Nouvelle fonction pour gérer les filtres et le tri de manière centralisée------------------------------------------------

async function applyFiltersAndSort() {
                let listToDisplay = [];

                if (currentFilter === 'all') {
                        if (currentSortOrder === "default"){
                                listToDisplay = await loadTasks();
                        } else {
                                listToDisplay = await loadAllSortedTasks();
                        }
                } else if (currentFilter === 'done') {
                        if (currentSortOrder === "default"){
                                listToDisplay = await loadTasksCompleted();
                        } else {
                                listToDisplay = await loadAllCompletedSortedTasks();
                        }
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

        // Fonction pour appliquer les styles des boutons

        // Fonction pour appliquer les filtres et les tris

        // Attache les écouteurs d'événements UNE SEULE FOIS
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
                await applyFiltersAndSort(); // <<< --- CORRECTION : AJOUT DE 'AWAIT'
        });

        // Applique les styles initiaux au chargement
        updateButtonStyles();
}

// ------------------------------TASKS LOADING------------------------------------------------------------------------

async function loadTasks() {
        try {
                const response = await fetch('http://localhost:8080/api/task/get');
                if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
                }
                const taskList = await response.json();
                return taskList;
        } catch (e) {
                console.error("Erreur lors du chargement des tâches: ", e);
                const screenList = document.querySelector(".taskList ul");
                if (screenList) {
                        screenList.innerHTML = `<p style="color: red;">Impossible de charger les tâches. Veuillez réessayer plus tard.</p>`;
                }
                return [];
        }
}

async function loadTasksCompleted() {
        try {
                const response = await fetch('http://localhost:8080/api/task/get/completed');
                if (!response.ok) {
                        const errorText = await response.text();
                        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorText}`);
                }
                const taskListCompletes = await response.json();
                return taskListCompletes;
        } catch (e) {
                console.error("Erreur lors du chargement des tâches complétées: ", e);
                return [];
        }
}

async function loadAllSortedTasks() {
        try {
                const response = await fetch('http://localhost:8080/api/task/get/sorted');
                if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
        } catch (e) {
                console.error("Erreur lors du chargement de toutes les tâches triées: ", e);
                return [];
        }
}

async function loadAllCompletedSortedTasks() {
        try {
                const response = await fetch('http://localhost:8080/api/task/get/completed/sorted');
                if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                }
                return await response.json();
        } catch (e) {
                console.error("Erreur lors du chargement des tâches complétées triées: ", e);
                return [];
        }
}

async function getTaskByID(id) {
        try {
                const response = await fetch(`http://localhost:8080/api/task/get/${id}`);

                if (!response.ok){
                        throw new Error(`HTTP error! status: ${response.status}`);
                }

                const task = await response.json();

                return task;
        }catch (e) {
                console.error("Erreur lors du chargement des taches: ", e);
                return [];
        }
}

async function updateTask(id, updatedTask){
        try {
                const response = await fetch(`http://localhost:8080/api/task/update/${id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedTask)
                });

                if (response.ok){
                        const result = await  response.json();
                        console.log("Tache mise a jour: ", result);
                }else {
                        console.error("Erreur lors de la mise a jour: ", response.status);
                }
        }catch (e){
                console.error("Echec de la requete: "+e);
        }
}

async function deleteTask(id){
        try {
                const response = await fetch(`http://localhost:8080/api/task/delete/${id}`,
                    {method: 'DELETE'}
                );

                if (!response.ok){
                        console.error("Erreur lors de ma mise a jour: ", response.status);
                }

                return response.ok;
        }catch (e){
                console.error("Echec de la requete: "+e);
        }
}

// --------------------------UPDATE FORM MANAGEMENT-----------------------
const updateZone = document.querySelector(".upd");
let currentUpdatingTaskID = null;

const updateForm = document.querySelector(".upd form");

const inputTitle = updateForm.querySelector(".title");
const inputDetails = updateForm.querySelector(".description");
const inputDate = updateForm.querySelector(".chrono .day");
const inputTime = updateForm.querySelector(".chrono .hour");

const  statusYesRadio = updateForm.querySelector("#yes");
const  statusNoRadio = updateForm.querySelector("#no");


document.querySelector(".taskList ul").addEventListener("click", async (e) => {
        if (e.target.closest(".update")) {
                updateZone.style.opacity = "1";
                updateZone.style.scale = "1";

                const liElement = e.target.closest("li");
                const taskID = parseInt(liElement.dataset.taskId);

                currentUpdatingTaskID = taskID;

                const taskFound = await getTaskByID(taskID);

                if (!taskFound) {
                        // Gérer l'erreur si la tâche n'est pas trouvée (ex: afficher un message)
                        alert("Tâche non trouvée ou erreur de chargement. Veuillez réessayer.");
                        updateZone.style.opacity = "0"; // Cacher le formulaire
                        updateZone.style.scale = "0";
                        return;
                }

                // const submitBtn = updateForm.querySelector(".btn .ok");

                // console.log(updateForm, inputTitle, inputDetails, inputDate, inputTime, submitBtn);

                inputTitle.value = taskFound.title;
                inputDetails.value = taskFound.details;
                inputDate.value = taskFound.limitationDate;
                inputTime.value = taskFound.limitationTime.substring(0, 5);

                if (taskFound.status === true){
                        statusYesRadio.checked = true;
                        statusNoRadio.checked = false;
                }else {
                        statusNoRadio.checked = true;
                        statusYesRadio.checked = false;
                }

        }

        if (e.target.closest(".delete")){
                const itemSelected = e.target.closest("li");
                let itemID = parseInt(itemSelected.dataset.taskId);
                console.log(itemID);

                await (async () => {
                        const task = await deleteTask(itemID);

                        itemSelected.remove();

                        console.log(task);
                })();
        }

});

updateForm.addEventListener("submit",  async (e)=>{
        e.preventDefault();

        // Vérifier si nous avons un ID de tâche à mettre à jour
        if (currentUpdatingTaskID === null) {
                console.error("Erreur: Aucun ID de tâche à mettre à jour !");
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

        console.log("Updating task: ", taskDataToSend);

        await updateTask(currentUpdatingTaskID, taskDataToSend);

        // Après la mise à jour (que updateTask gère en partie)
        // Vous voulez probablement cacher le formulaire et rafraîchir la liste ici
        updateZone.style.opacity = "0";
        updateZone.style.scale = "0";
        currentUpdatingTaskID = null; // Réinitialise l'ID
        await applyFiltersAndSort();
});
