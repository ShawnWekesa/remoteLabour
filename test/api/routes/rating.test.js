import supertest from "supertest";
import { jest } from "@jest/globals"; // eslint-disable-line

import app from "../../../src/app.js";
import RatingService from "../../../src/services/rating.js";
import UserService from "../../../src/services/user.js";

jest.mock("../../../src/services/rating.js");
jest.mock("../../../src/services/user.js");

UserService.authenticateWithToken = jest
  .fn()
  .mockResolvedValue({ email: "test@example.com" });

describe("/api/v1/rating/", () => {
  test("anonymous requests are blocked", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/rating");
    expect(res.status).toBe(401);
  });

  test("GET lists all the models", async () => {
    const data = [{ name: "First" }, { name: "Second" }];
    RatingService.list = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get("/api/v1/rating")
      .set("Authorization", "token abc");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(data);
    expect(RatingService.list).toHaveBeenCalled();
  });

  test("POST creates a new Rating", async () => {
    const data = {
      category: "test",
      senderId: "614c2c2a29d7763052c63810",
      receiverId: "614c2c2a29d7763052c63810",
      rating: 3.141592,
    };

    RatingService.create = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .post("/api/v1/rating")
      .set("Authorization", "token abc")
      .send(data);

    expect(res.body).toEqual(data);
    expect(res.status).toBe(201);
    expect(RatingService.create).toHaveBeenCalledWith(data);
  });
});

describe("/api/v1/rating/:id", () => {
  test("getting a single result succeeds for authorized user", async () => {
    const data = { email: "test@example.com" };
    RatingService.get = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/rating/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(RatingService.get).toHaveBeenCalledWith("507f1f77bcf86cd799439011");
  });

  test("getting a single result fails for anonymous user", async () => {
    const req = supertest(app);
    const res = await req.get("/api/v1/rating/507f1f77bcf86cd799439011");
    expect(res.status).toBe(401);
  });

  test("request for nonexistent object returns 404", async () => {
    const id = "507f1f77bcf86cd799439011";
    RatingService.get = jest.fn().mockResolvedValue(null);
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/rating/${id}`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(404);
    expect(RatingService.get).toHaveBeenCalled();
  });

  test("request with incorrectly-formatted ObjectId fails", async () => {
    RatingService.get = jest.fn();
    const req = supertest(app);

    const res = await req
      .get(`/api/v1/rating/bogus`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(400);
    expect(RatingService.get).not.toHaveBeenCalled();
  });

  test("Rating update", async () => {
    const data = {};
    RatingService.update = jest.fn().mockResolvedValue(data);
    const req = supertest(app);

    const res = await req
      .put(`/api/v1/rating/507f1f77bcf86cd799439011`)
      .send(data)
      .set("Authorization", "token abc");

    expect(res.body).toEqual(data);
    expect(res.status).toBe(200);
    expect(RatingService.update).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011",
      data
    );
  });

  test("Rating deletion", async () => {
    RatingService.delete = jest.fn().mockResolvedValue(true);
    const req = supertest(app);

    const res = await req
      .delete(`/api/v1/rating/507f1f77bcf86cd799439011`)
      .set("Authorization", "token abc");

    expect(res.status).toBe(204);
    expect(RatingService.delete).toHaveBeenCalledWith(
      "507f1f77bcf86cd799439011"
    );
  });
});
