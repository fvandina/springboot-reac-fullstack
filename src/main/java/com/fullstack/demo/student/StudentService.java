package com.fullstack.demo.student;

import com.fullstack.demo.exception.BadRequestException;
import com.fullstack.demo.exception.NotFoundException;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class StudentService {
    private final StudentRepository studentRepository;

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student addStudent(Student student) {
        Boolean existEmail = studentRepository.selectExistsEmail(student.getEmail());
        if (existEmail){
            throw new BadRequestException("Email " + student.getEmail() + " taken");
        }
        return studentRepository.save(student);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)){
            throw  new NotFoundException("Student with id " + id + " does not exists");
        }
        studentRepository.deleteById(id);
    }
}
