package com.fullstack.demo.student;

import com.fullstack.demo.exception.BadRequestException;
import com.fullstack.demo.exception.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;
    private StudentService underTest;

    @BeforeEach
    void setUp() {
        underTest = new StudentService(studentRepository);
    }


    @Test
    void itShouldGetAllStudents() {
        //Given
        //When
        underTest.getAllStudents();

        //Then
        verify(studentRepository).findAll();
    }

    @Test
    void itShouldAddStudent() {
        //Given
        Student student = new Student(
                "Jamila",
                "jamila@gmail.com",
                Gender.FEMALE
        );
        //When
        underTest.addStudent(student);

        //Then
        ArgumentCaptor<Student> studentArgumentCaptor = ArgumentCaptor.forClass(Student.class);
        verify(studentRepository).save(studentArgumentCaptor.capture());

        Student capturedStudent = studentArgumentCaptor.getValue();
        assertThat(capturedStudent).isEqualTo(student);
    }

    @Test
    void itShouldThrowAddStudentWhenEmailIsTaken() {
        //Given
        Student student = new Student(
                "Jamila",
                "jamila@gmail.com",
                Gender.FEMALE
        );
        given(studentRepository.selectExistsEmail(anyString()))
                .willReturn(true);
        //When
        //Then
        assertThatThrownBy(() -> underTest.addStudent(student))
                .isInstanceOf(BadRequestException.class)
                .hasMessageContaining("Email " + student.getEmail() + " taken");

        verify(studentRepository,never()).save(any());
    }

    @Test
    void itShouldDeleteStudent() {
        //Given
        Long id = 1L;
        given((studentRepository.existsById(id)))
                .willReturn(true);

        //When
        underTest.deleteStudent(id);

        //Then
        verify(studentRepository).deleteById(id);

    }

    @Test
    void itShouldThrowDeleteStudentWhenIdNotExists() {
        //Given
        Long id = 1L;

        //When
        //Then
        assertThatThrownBy(() -> underTest.deleteStudent(id))
                .isInstanceOf(NotFoundException.class)
                .hasMessageContaining("Student with id " + id + " does not exists");

        verify(studentRepository, never()).deleteById(anyLong());

    }
}