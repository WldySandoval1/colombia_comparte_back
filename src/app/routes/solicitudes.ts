import { Router } from "express";
import { SolicitudController } from "../services/controller/solicitud";
import { verifyToken } from "../../middleware/auth";

const router = Router();
const controller = new SolicitudController();
router.get("/stats/total", verifyToken, (req, res) => controller.getTotal(req, res));
router.get("/stats/pendientes-por-pais", verifyToken, (req, res) => controller.getPendientesPorPais(req, res));
router.get("/", (req, res) => controller.getAll(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", verifyToken, (req, res) => controller.create(req, res));
router.put("/:id", verifyToken, (req, res) => controller.update(req, res));
router.delete("/:id", verifyToken, (req, res) => controller.delete(req, res));

export default router;
