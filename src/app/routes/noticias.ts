import { Router } from "express";
import { NoticiaController } from "../services/controller/noticia";
import { verifyToken } from "../../middleware/auth";

const router = Router();
const controller = new NoticiaController();

router.get("/", verifyToken, (req, res) => controller.getAll(req, res));
router.get("/:id", verifyToken, (req, res) => controller.getById(req, res));
router.post("/", verifyToken, (req, res) => controller.create(req, res));
router.put("/:id", verifyToken, (req, res) => controller.update(req, res));
router.delete("/:id", verifyToken, (req, res) => controller.delete(req, res));
router.get("/stats/total-publicados", verifyToken, (req, res) =>
  controller.getTotalPublicadas(req, res),
);
router.get("/stats/total-publicados-pais", verifyToken, (req, res) =>
  controller.getTotalNoticiasPais(req, res),
);
router.get("/stats/list/noticias/pais", verifyToken, (req, res) =>
  controller.getTotalListNoticiasPais(req, res),
);

export default router;
