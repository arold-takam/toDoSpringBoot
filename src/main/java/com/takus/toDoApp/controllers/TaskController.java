package com.takus.toDoApp.controllers;

import com.takus.toDoApp.models.Task;
import com.takus.toDoApp.services.TaskServices;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.springframework.util.MimeTypeUtils.APPLICATION_JSON_VALUE;

@RestController
@RequestMapping(path = "/task")
public class TaskController {
	
	private TaskServices taskServices;
	
	public TaskController(TaskServices taskServices) {
		this.taskServices = taskServices;
	}
	
	
	@PostMapping(path = "/add", consumes = APPLICATION_JSON_VALUE)
	public ResponseEntity<Task> add(@RequestBody @Valid Task task){
		taskServices.addTask(task);
		
		return new ResponseEntity<>(task, HttpStatus.CREATED);
	}
	
	@GetMapping(path = "/get/{id}", produces = APPLICATION_JSON_VALUE)
	public ResponseEntity<Task> get(@PathVariable int id){
		Task task = taskServices.getTaskID(id);
		
		if (task == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
		return new ResponseEntity<>(task, HttpStatus.OK);
	}
	
	@GetMapping(path = "/get", produces = APPLICATION_JSON_VALUE)
	public ResponseEntity<List<Task>> getAllTasks(){
		if (taskServices.getAllTask().isEmpty()){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
		return new ResponseEntity<>(taskServices.getAllTask(), HttpStatus.OK);
	}
	
	@PutMapping(path = "/update/{id}",  consumes = APPLICATION_JSON_VALUE, produces = APPLICATION_JSON_VALUE)
	public ResponseEntity<Task> update(@PathVariable int id, @RequestBody @Valid Task newTask){
		if (newTask == null){
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
		
		Task existingTask = taskServices.updateTaskID(id, newTask);
		
		return new ResponseEntity<>(existingTask, HttpStatus.OK);
	}
	
	@DeleteMapping(path = "/delete/{id}")
	public ResponseEntity<Void> delete(@PathVariable int id){
		boolean delete = taskServices.deleteTaskID(id);
		
		if (delete){
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}

