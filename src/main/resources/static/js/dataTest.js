class Task {
        constructor(title, details, status, limitationDate, limitationTime){
                this.title = title;
                this.details = details;
                this.status = status;
                this.limitationDate = limitationDate;
                this.limitationTime = limitationTime;
        }
}

document.addEventListener("DOMContentLoaded", async () => {
        const listOfTask = await loadTasks();
        console.log(listOfTask);

        // await addTask("Nouvelle tâche", "Détails ici", false, "2025-07-15", "08:00");

        // updateTask(9, new Task("Nouvelle tâche ", "Détails ici", true, "2025-07-15", "08:00"));

        // await (async () => {
        //         const task = await getTaskByID(10);
        //         console.log(task);
        // })();

        // await (async () => {
        //         const task = await deleteTask(12);
        //         console.log(task);
        // })();


        const updatedListOfTask = await loadTasks();
        console.log("Liste des tâches après ajout :", updatedListOfTask);
});



async function addTask(title, details, status, limitationDate, limtationTime) {
        const taskData = new Task(title, details, status, limitationDate, limtationTime);

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

async function loadTasks(){
        try {
                const response = await fetch('http://localhost:8080/api/task/get');

                if (!response.ok){
                        throw new Error(`HTTP error! status: ${response.status}`);
                }

                const taskList = await  response.json();

                return taskList;

        }catch (e) {
                console.error("Erreur lors du chargement des taches: ", e);
                return [];
        }
}


