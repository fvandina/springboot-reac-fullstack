import "unfetch/polyfill";

const headers = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const checkStatus = (response) => {
  if (response.ok) {
    return response;
  }
  // convert non-2xx HTTP responses into errors:
  const error = new Error(response.statusText);
  error.response = response;
  return Promise.reject(error);
};

export const getAllStudents = async () =>
  await fetch("/api/v1/students", {
    headers: headers,
    method: "GET",
  }).then(checkStatus);

export const addNewStudent = async (student) =>
  await fetch("api/v1/students", {
    headers: headers,
    method: "POST",
    body: JSON.stringify(student),
  }).then(checkStatus);

export const deleteStudent = async(id) =>
  await fetch(`api/v1/students/${id}`, {
    headers: headers,
    method: "DELETE",
  }).then(checkStatus);

export const editStudent = async (student) =>
  await fetch("api/v1/students", {
    headers: headers,
    method: "PUT",
    body: JSON.stringify(student),
  }).then(checkStatus);
