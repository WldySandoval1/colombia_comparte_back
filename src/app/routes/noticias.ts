import { Router } from "express";
import { NoticiaController } from "../services/controller/noticia";
import { verifyToken } from "../../middleware/auth";

const router = Router();
const controller = new NoticiaController();

router.get("/stats/total-publicados", (req, res) => controller.getTotalPublicadas(req, res));
router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", verifyToken, (req, res) => controller.create(req, res));
router.put("/:id", verifyToken, (req, res) => controller.update(req, res));
router.delete("/:id", verifyToken, (req, res) => controller.delete(req, res));

export default router;
