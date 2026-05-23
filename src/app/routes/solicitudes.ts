import { Router } from "express";
import { SolicitudController } from "../services/controller/solicitud";
import { verifyToken } from "../../middleware/auth";

const router = Router();
const controller = new SolicitudController();

router.get("/", (req, res) => controller.getAll(req, res));
router.get("/pendiente", verifyToken, (req, res) => controller.getPendientes(req, res));
router.get("/gestionada", verifyToken, (req, res) => controller.getGestionadas(req, res));
router.get("/respondida", verifyToken, (req, res) => controller.getRespondidas(req, res));
router.get("/colombia", verifyToken, (req, res) => controller.getColombia(req, res));
router.get("/ecuador", verifyToken, (req, res) => controller.getEcuador(req, res));
router.get("/chile", verifyToken, (req, res) => controller.getChile(req, res));
router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", verifyToken, (req, res) => controller.create(req, res));
router.put("/:id", verifyToken, (req, res) => controller.update(req, res));
router.delete("/:id", verifyToken, (req, res) => controller.delete(req, res));

export default router;
