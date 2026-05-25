import { Request, Response } from "express";
import { NoticiaModel } from "../../models/noticia";
import { NoticiaService } from "../interfaces/noticia";

export class NoticiaController implements NoticiaService {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const data = req.body;

      // Si el usuario no es superadmin y tiene país asignado, forzamos el pais
      if (req.user && req.user.rol !== "superadmin") {
        data.pais = req.user.pais;
      }

      const noticia = await NoticiaModel.create({ ...data });
      return res.status(201).json({ ok: true, noticia });
    } catch (error) {
      console.error("Error creating noticia:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al crear noticia" });
    }
  }

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const filter: any = {};
      // Si el usuario no es superadmin, mostrar solo su país
      if (req.user && req.user.rol !== "superadmin")
        filter.pais = req.user.pais;

      // Filtros opcionales por estado
      if (req.query.estado) filter.estado = req.query.estado;

      // Sólo permitir filtrar por país desde query si el usuario es superadmin
      if (req.query.pais && req.user && req.user.rol === "superadmin") {
        filter.pais = req.query.pais;
      }

      const noticias = await NoticiaModel.find(filter).sort({
        fecha_creacion: -1,
      });
      return res.status(200).json({ ok: true, noticias });
    } catch (error) {
      console.error("Error getting noticias:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al obtener noticias" });
    }
  }

  async getById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const noticia = await NoticiaModel.findById(id);
      if (!noticia)
        return res
          .status(404)
          .json({ ok: false, error_message: "Noticia no encontrada" });

      // Si el usuario no es superadmin, asegurar que la noticia pertenezca a su país
      if (
        req.user &&
        req.user.rol !== "superadmin" &&
        req.user.pais !== noticia.pais
      ) {
        return res
          .status(403)
          .json({ ok: false, error_message: "Acceso denegado a esta noticia" });
      }

      return res.status(200).json({ ok: true, noticia });
    } catch (error) {
      console.error("Error getting noticia by id:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al obtener noticia" });
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const updates = req.body;

      const noticia = await NoticiaModel.findById(id);
      if (!noticia)
        return res
          .status(404)
          .json({ ok: false, error_message: "Noticia no encontrada" });

      if (
        req.user &&
        req.user.rol !== "superadmin" &&
        req.user.pais !== noticia.pais
      ) {
        return res
          .status(403)
          .json({ ok: false, error_message: "Acceso denegado" });
      }

      // Evitar cambiar país si no es superadmin
      if (req.user && req.user.rol !== "superadmin") delete updates.pais;

      const updated = await NoticiaModel.findByIdAndUpdate(id, updates, {
        new: true,
      });
      return res.status(200).json({ ok: true, noticia: updated });
    } catch (error) {
      console.error("Error updating noticia:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al actualizar noticia" });
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const noticia = await NoticiaModel.findById(id);
      if (!noticia)
        return res
          .status(404)
          .json({ ok: false, error_message: "Noticia no encontrada" });

      if (
        req.user &&
        req.user.rol !== "superadmin" &&
        req.user.pais !== noticia.pais
      ) {
        return res
          .status(403)
          .json({ ok: false, error_message: "Acceso denegado" });
      }

      await NoticiaModel.findByIdAndDelete(id);
      return res.status(200).json({ ok: true, message: "Noticia eliminada" });
    } catch (error) {
      console.error("Error deleting noticia:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al eliminar noticia" });
    }
  }

  async getTotalPublicadas(req: Request, res: Response): Promise<any> {
    try {
      const filter: any = { estado: "publicado" };

      // Si el usuario no es superadmin, contar solo del su país
      if (req.user && req.user.rol !== "superadmin") {
        filter.pais = req.user.pais;
      }

      const total = await NoticiaModel.countDocuments(filter);
      return res
        .status(200)
        .json({ ok: true, total, pais: filter.pais ?? "todos" });
    } catch (error) {
      console.error("Error getting total publicadas:", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al obtener total de noticias publicadas",
      });
    }
  }
  async getTotalNoticiasPais(req: Request, res: Response): Promise<any> {
    try {
      let filter: any = {};

      //  Si viene un país en la query, usarlo
      const paisQuery = req.query.pais as string;

      if (paisQuery) {
        filter.pais = paisQuery;
      } else if (req.user && req.user.rol !== "superadmin") {
        filter.pais = req.user.pais;
      }

      const total = await NoticiaModel.countDocuments(filter);

      return res.status(200).json({
        ok: true,
        total,
        pais: filter.pais ?? "todos",
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al obtener total de testimonios por país",
      });
    }
  }
  async getTotalListNoticiasPais(req: Request, res: Response): Promise<any> {
    try {
      let filter: any = {};

      const paisQuery = req.query.pais as string;

      if (paisQuery) {
        filter.pais = paisQuery;
      } else if (req.user && req.user.rol !== "superadmin") {
        filter.pais = req.user.pais;
      }

      // Obtener todos los testimonios sin paginación
      const noticia = await NoticiaModel.find(filter).sort({
        fecha_creacion: -1,
      });

      return res.status(200).json({
        ok: true,
        noticia,
        // total: noticia.length,
        pais: filter.pais ?? "todos",
      });
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al obtener testimonios por país",
      });
    }
  }
}
