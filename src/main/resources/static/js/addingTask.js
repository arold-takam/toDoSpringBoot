class Task {
        constructor(title, details, status, limitationDate, limitationTime) {
                this.title = title;
                this.details = details;
                this.status = status;
                this.limitationDate = limitationDate;
                this.limitationTime = limitationTime;
        }

       toString(){
                return `Task: ${this.title} about ${this.details} to do on ${this.limitationDate} at ${this.limitationTime}.`;
        }
}

// -------------------------------------------------------------------tASK ADDING MANAGEMENT--------------------------------
const formAdd = document.querySelector(".zone form");
const inputTitle = formAdd.querySelector(".title");
const inputDetails = formAdd.querySelector(".description");
const inputLimitationDate = formAdd.querySelector(".day");
const inputLimitationTime = formAdd.querySelector(".hour");
const btnSubmit = formAdd.querySelector(".btn .ok");

formAdd.addEventListener("submit", (e)=>{
        e.preventDefault();

        let title = inputTitle.value.trim();
        let details = inputDetails.value.trim();
        let limitationDate = inputLimitationDate.value.trim();
        let limitationTime = inputLimitationTime.value.trim();
        console.log(title, details, limitationDate, limitationTime);

        let task = new Task(title, details, false, limitationDate, limitationTime);
        console.log(task.toString());

        addTask(task.title, task.details, task.status, task.limitationDate, task.limitationTime).then(r => {});

        setTimeout(()=>{
                formAdd.reset();
        },1500);
} );

async function addTask(title, details, status, limitationDate, limitationTime) {
        const taskData = new Task(title, details, status, limitationDate, limitationTime);

        try {
                const response = await fetch('http://localhost:8080/api/task/add', {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(taskData)
                });

                if (response.ok) {
                        const createdTask = await response.json(); // Utilise await
                        console.log("Tâche ajoutée avec succès :", createdTask);
                        return createdTask;
                } else {
                        let errorBody = await response.text(); // Lis toujours comme texte si json() échoue
                        try {
                                // Tente de parser en JSON si le Content-Type le suggère
                                const parsedError = JSON.parse(errorBody);
                                if (parsedError.message) errorBody = parsedError.message; // Si Spring a renvoyé un objet erreur avec 'message'
                                else if (parsedError.errors && parsedError.errors.length > 0) { // Pour les erreurs de validation
                                        errorBody = parsedError.errors.map(err => err.defaultMessage).join('; ');
                                } else {
                                        errorBody = JSON.stringify(parsedError, null, 2); // Affiche tout l'objet JSON formaté
                                }
                        } catch (e) {
                                // Ce n'était pas du JSON, errorBody contient déjà le texte brut
                        }
                        throw new Error(`Erreur HTTP lors de l'ajout (Statut: ${response.status}): ${errorBody}`);
                }
        } catch (e) {
                console.error(`Erreur réseau ou du serveur lors de l'ajout de tâche: ${e}`);
        }
}