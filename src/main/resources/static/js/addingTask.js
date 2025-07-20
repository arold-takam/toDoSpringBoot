const API_BASE_URL = 'https://todo-app-28ry.onrender.com'; // Ton backend déployé

class Task {
        constructor(title, details, status, limitationDate, limitationTime) {
                this.title = title;
                this.details = details;
                this.status = status;
                this.limitationDate = limitationDate;
                this.limitationTime = limitationTime;
        }

        toString() {
                return `Task: ${this.title} about ${this.details} to do on ${this.limitationDate} at ${this.limitationTime}.`;
        }
}

// ------------------- ADD TASK FORM MANAGEMENT ----------------------

const formAdd = document.querySelector(".zone form");
const inputTitle = formAdd.querySelector(".title");
const inputDetails = formAdd.querySelector(".description");
const inputLimitationDate = formAdd.querySelector(".day");
const inputLimitationTime = formAdd.querySelector(".hour");

formAdd.addEventListener("submit", (e) => {
        e.preventDefault();

        let title = inputTitle.value.trim();
        let details = inputDetails.value.trim();
        let limitationDate = inputLimitationDate.value.trim();
        let limitationTime = inputLimitationTime.value.trim();

        let task = new Task(title, details, false, limitationDate, limitationTime);
        console.log("📤 Envoi de la tâche :", task.toString());

        addTask(task).then(created => {
                if (created) {
                        console.log("✅ Tâche ajoutée :", created);
                }
        });

        setTimeout(() => {
                formAdd.reset();
        }, 1500);
});

async function addTask(taskData) {
        try {
                const response = await fetch(`${API_BASE_URL}/api/task/add`, {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(taskData)
                });

                if (response.ok) {
                        const createdTask = await response.json();
                        return createdTask;
                } else {
                        let errorBody = await response.text();
                        try {
                                const parsedError = JSON.parse(errorBody);
                                if (parsedError.message) errorBody = parsedError.message;
                                else if (parsedError.errors && parsedError.errors.length > 0) {
                                        errorBody = parsedError.errors.map(err => err.defaultMessage).join('; ');
                                } else {
                                        errorBody = JSON.stringify(parsedError, null, 2);
                                }
                        } catch (e) {
                                // Pas du JSON
                        }
                        throw new Error(`❌ Erreur HTTP (${response.status}): ${errorBody}`);
                }
        } catch (e) {
                console.error("❌ Erreur réseau ou serveur :", e.message);
        }
}
