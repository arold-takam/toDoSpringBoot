package com.takus.toDoApp.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "task")
public class Task {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	@Column(name = "title", nullable = false, unique = true)
	@NotBlank(message = "Title is required.")
	private String title;
	
	@Column(name = "details", nullable = false)
	@NotBlank(message = "Details are required.")
	private String details;
	
	@Column(name = "status", nullable = false)
	private boolean status;
	
	@Column(name = "limitation_date", nullable = true)
	private LocalDate limitationDate;
	
	@Column(name = "limitation_time", nullable = true)
	private LocalTime limitationTime;
	
	public Task() {
	}
	
	public Task(String title, String details, boolean status, LocalDate limitationDate, LocalTime limitationTime) {
		this.title = title;
		this.details = details;
		this.status = status;
		this.limitationDate = limitationDate;
		this.limitationTime = limitationTime;
	}
	
	public int getId() {
		return id;
	}
	
	public String getTitle() {
		return title;
	}
	
	public void setTitle(String title) {
		this.title = title;
	}
	
	public String getDetails() {
		return details;
	}
	
	public void setDetails(String details) {
		this.details = details;
	}
	
	public boolean isStatus() {
		return status;
	}
	
	public void setStatus(boolean status) {
		this.status = status;
	}
	
	public LocalDate getLimitationDate() {
		return limitationDate;
	}
	
	public void setLimitationDate(LocalDate limitationDate) {
		this.limitationDate = limitationDate;
	}
	
	public LocalTime getLimitationTime() {
		return limitationTime;
	}
	
	public void setLimitationTime(LocalTime limitationTime) {
		this.limitationTime = limitationTime;
	}
}
