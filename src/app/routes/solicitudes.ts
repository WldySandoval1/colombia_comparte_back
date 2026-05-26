import { Router } from "express";
import { SolicitudController } from "../services/controller/solicitud";
import { verifyToken } from "../../middleware/auth";

const router = Router();
const controller = new SolicitudController();

router.get("/", verifyToken, (req, res) => controller.getAll(req, res));
router.get("/pendiente", verifyToken, (req, res) =>
  controller.getPendientes(req, res),
);
router.get("/gestionada", verifyToken, (req, res) =>
  controller.getGestionadas(req, res),
);
router.get("/respondida", verifyToken, (req, res) =>
  controller.getRespondidas(req, res),
);

router.get("/:id", (req, res) => controller.getById(req, res));
router.post("/", verifyToken, (req, res) => controller.create(req, res));
router.put("/:id", verifyToken, (req, res) => controller.update(req, res));
router.delete("/:id", verifyToken, (req, res) => controller.delete(req, res));
router.get("/stats/total", verifyToken, (req, res) =>
  controller.getTotal(req, res),
);
router.get("/stats/pendientes-por-pais", verifyToken, (req, res) =>
  controller.getPendientesPorPais(req, res),
);
router.get("/stats/total-publicados-pais", verifyToken, (req, res) =>
  controller.getTotalSolicitudPais(req, res),
);
router.get("/stats/total-pendientes-pais/pais", verifyToken, (req, res) =>
  controller.getTotalSolicitudPaisPenientes(req, res),
);
router.post("/public", (req, res) => controller.createPublic(req, res));

export default router;
