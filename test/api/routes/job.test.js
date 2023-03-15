import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import JobService from "../../../src/services/job.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/job.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/job/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/job");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    JobService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req.get("/api/v1/job").set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(JobService.list).toHaveBeenCalled();
  });

  test("POST creates a new Job", async () => {
    const data = {
      title: "test",
      amount: 3.141592,
      jobType: "test",
      location: "test",
      description: "test",
      created: "2001-01-01T00:00:00Z",
      email: "test",
      userId: "614c2c2a29d7763052c63810",
      maxApplicants: 3.141592,
      maxPositions: 3.141592,
      activeApplications: 3.141592,
      acceptedCandidates: "test",
      dateOfPosting: "2001-01-01T00:00:00Z",
      skillsets: "test",
      duration: 3.141592,
      salary: 3.141592,
      rating: 3.141592,
    };

    JobService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/job")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(JobService.create).toHaveBeenCalledWith(data);
  });

  test("creating a new Job without required attributes fails", async () => {
    const data = {};

    JobService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/job")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
    expect(JobService.create).not.toHaveBeenCalled();
  });
});

describe("/api/v1/job/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    JobService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/job/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(JobService.get).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/job/507f1f77bcf86cd799439011");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "507f1f77bcf86cd799439011";
    JobService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/job/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(JobService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    JobService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/job/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(JobService.get).not.toHaveBeenCalled();
  });

  test("Job update", async () => {
    const data = {
      title: "test",
      amount: 3.141592,
      jobType: "test",
      location: "test",
      description: "test",
      email: "test",
      userId: "614c2c2a29d7763052c63810",
    };
    JobService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/job/507f1f77bcf86cd799439011`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(JobService.update).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      data
    );
  });

  test("Job deletion", async () => {
    JobService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/job/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(JobService.delete).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
  });
});
