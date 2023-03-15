import { Router } from "express";

import RatingService from "../../services/rating.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/rating.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Rating
 *   description: API for managing Rating objects
 *
 * /rating:
 *   get:
 *     tags: [Rating]
 *     summary: Get all the Rating objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Rating objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Rating'
 */
router.get("", async (req, res, next) => {
  try {
    const results = await RatingService.list();
    res.json(results);
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /rating:
 *   post:
 *     tags: [Rating]
 *     summary: Create a new Rating
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rating'
 *     responses:
 *       201:
 *         description: The created Rating object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rating'
 */
router.post("", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await RatingService.create(req.validatedBody);
    res.status(201).json(obj);
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /rating/{id}:
 *   get:
 *     tags: [Rating]
 *     summary: Get a Rating by id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rating object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rating'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await RatingService.get(req.params.id);
    if (obj) {
      res.json(obj);
    } else {
      res.status(404).json({ error: "Resource not found" });
    }
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

/** @swagger
 *
 * /rating/{id}:
 *   put:
 *     tags: [Rating]
 *     summary: Update Rating with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Rating'
 *     responses:
 *       200:
 *         description: The updated Rating object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Rating'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await RatingService.update(req.params.id, req.validatedBody);
      if (obj) {
        res.status(200).json(obj);
      } else {
        res.status(404).json({ error: "Resource not found" });
      }
    } catch (error) {
      if (error.isClientError()) {
        res.status(400).json({ error });
      } else {
        next(error);
      }
    }
  }
);

/** @swagger
 *
 * /rating/{id}:
 *   delete:
 *     tags: [Rating]
 *     summary: Delete Rating with the specified id
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *        description: OK, object deleted
 */
router.delete("/:id", requireValidId, async (req, res, next) => {
  try {
    const success = await RatingService.delete(req.params.id);
    if (success) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: "Not found, nothing deleted" });
    }
  } catch (error) {
    if (error.isClientError()) {
      res.status(400).json({ error });
    } else {
      next(error);
    }
  }
});

export default router;
