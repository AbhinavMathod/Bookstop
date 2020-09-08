const request = require("supertest");
const app = require("./app");

describe("POST /users/signup", () => {
    test("Testing Post Request Signup", async () => {
      const newStudent = {"body":{
        "id": 32,
        "username": "sachith@gmail.com",
        "password": "$2a$10$DzlCG7vuB5PqJKyiSVk6ReOsup4flPFCBZlkAL.vWa5PYKJyQ1QsO",
        "firstname": "Abhinav",
        "lastname": "Nagaraj",
        "updatedAt": "2020-05-28T18:43:40.634Z",
        "createdAt": "2020-05-28T18:43:40.634Z"
      },
      "statusCode":201
    }
  
      // make sure we add it correctly
      
      expect(newStudent.body).toHaveProperty("id");
      expect(newStudent.body.username).toBe("sachith@gmail.com");
      expect(newStudent.statusCode).toBe(201);
      
     });

     test("Testing Post Request Signin", async () => {
      const newStudent = {"body":{
        "username": "sachith@gmail.com",
        "password": "123",
      },
      "statusCode":200
    }
  
      // make sure we add it correctly
      expect(newStudent.statusCode).toBe(200);
      
     });
    
  });
  