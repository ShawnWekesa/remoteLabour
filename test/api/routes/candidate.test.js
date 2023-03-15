import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import CandidateService from "../../../src/services/candidate.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/candidate.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/candidate/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/candidate");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    CandidateService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/candidate")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(CandidateService.list).toHaveBeenCalled();
  });

  test("POST creates a new Candidate", async () => {
    const data = {
      email: "test@example.com",
      password: "test",
      name: "test",
      gender: "test",
      acceptedJobs: 3.141592,
      rejectedJobs: 3.141592,
      userId: "614c2c2a29d7763052c63810",
      skills: "test",
      rating: "test",
      resume: "test",
      profile: "test",
      contactEmail: "test",
      contactNumber: "test",
    };

    CandidateService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/candidate")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(CandidateService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Candidate without required attributes fails", async () => {
    const data = {};

    CandidateService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/candidate")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(CandidateService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/candidate/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    CandidateService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/candidate/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(CandidateService.get).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011"
    );
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/candidate/507f1f77bcf86cd799439011");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "507f1f77bcf86cd799439011";
    CandidateService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/candidate/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(CandidateService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    CandidateService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/candidate/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(CandidateService.get).not.toHaveBeenCalled();
  });

  test("Candidate update", async () => {
    const data = {
      email: "test@example.com",
      password: "test",
      name: "test",
      gender: "test",
    };
    CandidateService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/candidate/507f1f77bcf86cd799439011`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(CandidateService.update).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      data
    );
  });

  test("Candidate deletion", async () => {
    CandidateService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/candidate/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(CandidateService.delete).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011"
    );
  });
});
