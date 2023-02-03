package com.fullstack.demo.student;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.javafaker.Faker;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Objects;

import static org.aspectj.bridge.MessageUtil.fail;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class StudentIT {

    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    ObjectMapper objectMapper;
    private final Faker faker = new Faker();

    @Test
    void itShouldRegisterNewStudent() throws Exception {
        String name = String.format("%s %s",
                faker.name().firstName(),
                faker.name().lastName());
        String email = String.format("%s@fv.com",
                StringUtils.trimAllWhitespace(name).trim().toLowerCase());
        //Given
        Student student = new Student(
                name,
                email,
                Gender.FEMALE
        );

        //When
        ResultActions studentResultActions = mockMvc.perform(post("/api/v1/students")
                .contentType(MediaType.APPLICATION_JSON)
                .content(Objects.requireNonNull(objectToJson(student))));
        //Then
        studentResultActions.andExpect(status().isOk());
        Boolean selectStudent = studentRepository.selectExistsEmail(student.getEmail());
        assertThat(selectStudent).isTrue();
    }

    @Test
    void itShouldDeleteStudent() throws Exception {
        //Given
        String name = String.format("%s %s",
                faker.name().firstName(),
                faker.name().lastName());
        String email = String.format("%s@fv.com",
                StringUtils.trimAllWhitespace(name).trim().toLowerCase());
        //Given
        Student student = new Student(
                name,
                email,
                Gender.FEMALE
        );

        mockMvc.perform(post("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(Objects.requireNonNull(objectToJson(student))))
                .andExpect(status().isOk());

        MvcResult getStudentsResult = mockMvc.perform(get("/api/v1/students")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andReturn();

        String contentAsString = getStudentsResult
                .getResponse()
                .getContentAsString();

        List<Student> students = objectMapper.readValue(
                contentAsString,
                new TypeReference<>() {
                }
        );

        Long id = students.stream()
                .filter(s -> s.getEmail().equals(student.getEmail()))
                .map(Student::getId)
                .findFirst()
                .orElseThrow(() -> new IllegalStateException("student with email: " + email + " not found"));

        //When
        ResultActions resultDeleteAction = mockMvc.perform(delete("/api/v1/students/" + id));

        resultDeleteAction.andExpect(status().isOk());

        boolean exists = studentRepository.existsById(id);
        assertThat(exists).isFalse();


    }

    private String objectToJson(Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            fail("Failed to convert object to json");
            return null;
        }
    }

}
