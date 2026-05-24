import { Router } from "express";
import { TestimonioController } from "../services/controller/testimonio";
import { verifyToken } from "../../middleware/auth";

const router = Router();
const controller = new TestimonioController();

router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", verifyToken, (req, res) => controller.create(req, res));
router.put("/:id", verifyToken, (req, res) => controller.update(req, res));
router.delete("/:id", verifyToken, (req, res) => controller.delete(req, res));
router.get("/stats/total-publicados", (req, res) =>
  controller.getTotalPublicados(req, res),
);
router.get("/stats/total-publicados-pais", verifyToken, (req, res) =>
  controller.getTotalTestimoniosPais(req, res),
);

export default router;
