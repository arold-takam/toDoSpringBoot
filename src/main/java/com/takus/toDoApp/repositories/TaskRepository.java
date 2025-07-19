package com.takus.toDoApp.repositories; // Correction: devrions être 'repositories'

import com.takus.toDoApp.models.Task;
import org.springframework.data.domain.Sort; // Gardez l'import pour findByStatus(boolean, Sort)
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query; // Importez @Query
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {
	
	List<Task>findAllByStatusTrue();
	
	boolean existsById(Integer taskID);
	
	List<Task> findByStatus(boolean completed, Sort sort);
	
	// --- NOUVELLES MÉTHODES AVEC @Query POUR LE TRI COMPLEXE ---
	
	// Requête pour toutes les tâches triées avec gestion des nulls
	@Query("SELECT t FROM Task t ORDER BY t.limitationDate DESC NULLS LAST, t.limitationTime DESC NULLS LAST, t.title ASC")
	List<Task> findAllSortedComplex();
	
	// Requête pour les tâches complétées triées avec gestion des nulls
	// Assurez-vous que 'status' est le nom du champ dans votre entité Task
	@Query("SELECT t FROM Task t WHERE t.status = :status ORDER BY t.limitationDate DESC NULLS LAST, t.limitationTime DESC NULLS LAST, t.title ASC")
	List<Task> findByStatusSortedComplex(@org.springframework.data.repository.query.Param("status") boolean status);
	// Si votre champ est une String (ex: "completed"), remplacez boolean par String et true par "completed"
	// List<Task> findByStatusSortedComplex(@org.springframework.data.repository.query.Param("status") String status);
}