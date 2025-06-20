package com.takus.toDoApp.repositotiries;

import com.takus.toDoApp.models.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {

}
