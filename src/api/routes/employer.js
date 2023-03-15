import { Router } from "express";

import EmployerService from "../../services/employer.js";
import { requireUser } from "../middlewares/auth.js";
import { requireSchema, requireValidId } from "../middlewares/validate.js";
import schema from "../schemas/employer.js";

const router = Router();

router.use(requireUser);

/** @swagger
 *
 * tags:
 *   name: Employer
 *   description: API for managing Employer objects
 *
 * /employer:
 *   get:
 *     tags: [Employer]
 *     summary: Get all the Employer objects
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of Employer objects
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Employer'
 */
router.get("", async (req, res, next) => {
  try {
    const results = await EmployerService.list();
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
 * /employer:
 *   post:
 *     tags: [Employer]
 *     summary: Create a new Employer
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Employer'
 *     responses:
 *       201:
 *         description: The created Employer object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employer'
 */
router.post("", requireSchema(schema), async (req, res, next) => {
  try {
    const obj = await EmployerService.create(req.validatedBody);
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
 * /employer/{id}:
 *   get:
 *     tags: [Employer]
 *     summary: Get a Employer by id
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
 *         description: Employer object with the specified id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employer'
 */
router.get("/:id", requireValidId, async (req, res, next) => {
  try {
    const obj = await EmployerService.get(req.params.id);
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
 * /employer/{id}:
 *   put:
 *     tags: [Employer]
 *     summary: Update Employer with the specified id
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
 *             $ref: '#/components/schemas/Employer'
 *     responses:
 *       200:
 *         description: The updated Employer object
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employer'
 */
router.put(
  "/:id",
  requireValidId,
  requireSchema(schema),
  async (req, res, next) => {
    try {
      const obj = await EmployerService.update(
        req.params.id,
        req.validatedBody
      );
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
 * /employer/{id}:
 *   delete:
 *     tags: [Employer]
 *     summary: Delete Employer with the specified id
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
    const success = await EmployerService.delete(req.params.id);
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
