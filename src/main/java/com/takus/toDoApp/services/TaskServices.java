package com.takus.toDoApp.services;


import com.takus.toDoApp.models.Task;
import com.takus.toDoApp.repositotiries.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskServices {
	private TaskRepository taskRepository;
	
	public TaskServices(TaskRepository taskRepository) {
		this.taskRepository = taskRepository;
	}
	
	
	public Task addTask(Task task){
		if (task.getTitle().isBlank() || task.getDetails().isBlank()){
			throw new IllegalArgumentException("This task is invalid, try again.");
		}
		
		for (Task task1: taskRepository.findAll()){
			if (task1.getTitle().equals(task.getTitle())){
				throw new IllegalArgumentException("It already has an existing task with this title.");
			}
		}
		
		return taskRepository.save(task);
	}
	
	public Task getTaskID(int id){
		Optional<Task> optionalTask = taskRepository.findById(id);
		
		if (optionalTask.isEmpty()){
			throw new IllegalArgumentException("No task found at this ID: "+id);
		}
		
		return optionalTask.get();
	}
	
	public List<Task> getAllTask(){
		List<Task> taskList = taskRepository.findAll();
		
		if (taskList.isEmpty()){
			throw new IllegalArgumentException("No Task existing yet.");
		}
		
		return taskList;
	}
	
	public Task updateTaskID(int id, Task newTask){
		Optional<Task>optionalTask = taskRepository.findById(id);
		
		if (optionalTask.isEmpty()){
			throw new IllegalArgumentException ("No Task found at this ID:  "+id);
		}
		
		if (newTask.getTitle().isBlank() || newTask.getDetails().isBlank()){
			throw new IllegalArgumentException("This task is invalid, try again.");
		}
		
		Task existingTask = optionalTask.get();
		
		for (Task task1: taskRepository.findAll()){
			if (task1.getTitle().equals(newTask.getTitle())){
				throw new IllegalArgumentException("It already has an existing task with this title: "+task1.getTitle());
			}
		}
		
		existingTask.setTitle(newTask.getTitle());
		existingTask.setDetails(newTask.getDetails());
		existingTask.setStatus(newTask.isStatus());
		existingTask.setLimitationDate(newTask.getLimitationDate());
		existingTask.setLimitationTime(newTask.getLimitationTime());
		
		return taskRepository.save(existingTask);
	}
	
	public boolean deleteTaskID(int id){
		Optional<Task>optionalTask = taskRepository.findById(id);
		
		if (optionalTask.isEmpty()){
			throw new IllegalArgumentException ("No Task found at this ID:  "+id);
		}
		
		taskRepository.deleteById(id);
		
		return true;
	}
}
