package com.takus.toDoApp.controllers;

import com.takus.toDoApp.models.Task;
import com.takus.toDoApp.services.TaskServices;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "/task")
// Optionnel : Ajoutez @CrossOrigin pour permettre les requêtes depuis votre frontend si sur un domaine/port différent
// @CrossOrigin(origins = "http://localhost:3000") // Remplacez 3000 par le port de votre frontend React/Vue/Angular
public class TaskController {
	
	private TaskServices taskServices;
	
	public TaskController(TaskServices taskServices) {
		this.taskServices = taskServices;
	}
	
//	----------------------------------------------------------------------------------------------------------------------------------------------------------------
	
	@PostMapping(path = "/add", consumes = APPLICATION_JSON_VALUE)
	public ResponseEntity<Task> add(@RequestBody @Valid Task task){
		Task createdTask = taskServices.addTask(task);
		
		return new ResponseEntity<>(createdTask, HttpStatus.CREATED);
	}
	
	@GetMapping(path = "/get/{id}", produces = APPLICATION_JSON_VALUE)
	public ResponseEntity<Task> get(@PathVariable int id){
		try {
			Task task = taskServices.getTaskID(id);
			return new ResponseEntity<>(task, HttpStatus.OK);
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping(path = "/get", produces = APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Task>> getAllTasks(){
		List<Task> taskList = taskServices.getAllTask();
		
		return new ResponseEntity<>(taskList, HttpStatus.OK);
	}
	
	@PutMapping(path = "/update/{id}",  consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
	public ResponseEntity<Task> update(@PathVariable int id, @RequestBody @Valid Task newTask){
		try {
			Task existingTask = taskServices.updateTaskID(id, newTask);
			return new ResponseEntity<>(existingTask, HttpStatus.OK);
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@DeleteMapping(path = "/delete/{id}")
	public ResponseEntity<Void> delete(@PathVariable int id){
		try {
			boolean deleted = taskServices.deleteTaskID(id);
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		} catch (IllegalArgumentException e) {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
	
	@GetMapping(path = "/get/completed", produces = APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Task>>getCompletedTasks (){
		List<Task>taskList = taskServices.getCompletedTasks();
		
		return new ResponseEntity<>(taskList, HttpStatus.OK);
	}
	
	//      ------------------------------------FILTERING MAPPING---------------------------------------------------------------------
	@GetMapping(path = "/get/sorted", produces = APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Task>> getAllSortedTasks(){
		List<Task> taskList = taskServices.getAllSortedTasks();
		
		return new ResponseEntity<>(taskList, HttpStatus.OK);
	}
	
	@GetMapping(path = "/get/completed/sorted", produces = APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Task>> getCompletedSortedTasks(){
		List<Task> taskList = taskServices.getCompletedSortedTasks();
		
		return new ResponseEntity<>(taskList, HttpStatus.OK);
	}
}