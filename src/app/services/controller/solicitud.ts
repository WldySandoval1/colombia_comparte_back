import { Request, Response } from "express";
import { SolicitudModel } from "../../models/solicitud";
import { SolicitudService } from "../interfaces/solicitud";

export class SolicitudController implements SolicitudService {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const data = req.body;
      if (req.user && req.user.rol !== "superadmin") data.pais = req.user.pais;

      const solicitud = await SolicitudModel.create({ ...data });
      return res.status(201).json({ ok: true, solicitud });
    } catch (error) {
      console.error("Error creating solicitud:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al crear solicitud" });
    }
  }

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const filter: any = {};
      if (req.user && req.user.rol !== "superadmin")
        filter.pais = req.user.pais;
      if (req.query.estado) filter.estado = req.query.estado;
      if (req.query.pais && req.user && req.user.rol === "superadmin") {
        filter.pais = req.query.pais;
      }

      const items = await SolicitudModel.find(filter).sort({
        fecha_creacion: -1,
      });
      return res.status(200).json({ ok: true, solicitudes: items });
    } catch (error) {
      console.error("Error getting solicitudes:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al obtener solicitudes" });
    }
  }

  async getById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const solicitud = await SolicitudModel.findById(id);
      if (!solicitud)
        return res
          .status(404)
          .json({ ok: false, error_message: "Solicitud no encontrada" });

      if (
        req.user &&
        req.user.rol !== "superadmin" &&
        req.user.pais !== solicitud.pais
      ) {
        return res
          .status(403)
          .json({ ok: false, error_message: "Acceso denegado" });
      }

      return res.status(200).json({ ok: true, solicitud });
    } catch (error) {
      console.error("Error getting solicitud by id:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al obtener solicitud" });
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const updates = req.body;
      const solicitud = await SolicitudModel.findById(id);
      if (!solicitud)
        return res
          .status(404)
          .json({ ok: false, error_message: "Solicitud no encontrada" });

      if (
        req.user &&
        req.user.rol !== "superadmin" &&
        req.user.pais !== solicitud.pais
      ) {
        return res
          .status(403)
          .json({ ok: false, error_message: "Acceso denegado" });
      }

      if (req.user && req.user.rol !== "superadmin") delete updates.pais;

      const updated = await SolicitudModel.findByIdAndUpdate(id, updates, {
        new: true,
      });
      return res.status(200).json({ ok: true, solicitud: updated });
    } catch (error) {
      console.error("Error updating solicitud:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al actualizar solicitud" });
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const solicitud = await SolicitudModel.findById(id);
      if (!solicitud)
        return res
          .status(404)
          .json({ ok: false, error_message: "Solicitud no encontrada" });

      if (
        req.user &&
        req.user.rol !== "superadmin" &&
        req.user.pais !== solicitud.pais
      ) {
        return res
          .status(403)
          .json({ ok: false, error_message: "Acceso denegado" });
      }

      await SolicitudModel.findByIdAndDelete(id);
      return res.status(200).json({ ok: true, message: "Solicitud eliminada" });
    } catch (error) {
      console.error("Error deleting solicitud:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al eliminar solicitud" });
    }
  }

  async getPendientes(req: Request, res: Response): Promise<any> {
    try {
      const filter: any = { estado: "pendiente" };
      if (req.user && req.user.rol !== "superadmin")
        filter.pais = req.user.pais;
      if (req.query.pais && req.user && req.user.rol === "superadmin")
        filter.pais = req.query.pais;

      const items = await SolicitudModel.find(filter).sort({
        fecha_creacion: -1,
      });
      return res.status(200).json({ ok: true, solicitudes: items });
    } catch (error) {
      console.error("Error getting solicitudes pendientes:", error);
      return res
        .status(500)
        .json({
          ok: false,
          error_message: "Error al obtener solicitudes pendientes",
        });
    }
  }

  async getGestionadas(req: Request, res: Response): Promise<any> {
    try {
      const filter: any = { estado: "gestionada" };
      if (req.user && req.user.rol !== "superadmin")
        filter.pais = req.user.pais;
      if (req.query.pais && req.user && req.user.rol === "superadmin")
        filter.pais = req.query.pais;

      const items = await SolicitudModel.find(filter).sort({
        fecha_creacion: -1,
      });
      return res.status(200).json({ ok: true, solicitudes: items });
    } catch (error) {
      console.error("Error getting solicitudes gestionadas:", error);
      return res
        .status(500)
        .json({
          ok: false,
          error_message: "Error al obtener solicitudes gestionadas",
        });
    }
  }

  async getRespondidas(req: Request, res: Response): Promise<any> {
    try {
      const filter: any = { estado: "respondida" };
      if (req.user && req.user.rol !== "superadmin")
        filter.pais = req.user.pais;
      if (req.query.pais && req.user && req.user.rol === "superadmin")
        filter.pais = req.query.pais;

      const items = await SolicitudModel.find(filter).sort({
        fecha_creacion: -1,
      });
      return res.status(200).json({ ok: true, solicitudes: items });
    } catch (error) {
      console.error("Error getting solicitudes respondidas:", error);
      return res
        .status(500)
        .json({
          ok: false,
          error_message: "Error al obtener solicitudes respondidas",
        });
    }
  }
}
