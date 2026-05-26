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
      return res.status(500).json({
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
      return res.status(500).json({
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
      return res.status(500).json({
        ok: false,
        error_message: "Error al obtener solicitudes respondidas",
      });
    }
  }

  async getPendientesPorPais(req: Request, res: Response): Promise<any> {
    try {
      // Superadmin obtiene agregación por país
      if (req.user && req.user.rol === "superadmin") {
        const aggregation = await SolicitudModel.aggregate([
          { $match: { estado: "pendiente" } },
          { $group: { _id: "$pais", total: { $sum: 1 } } },
          { $project: { pais: "$_id", total: 1, _id: 0 } },
        ]);
        return res
          .status(200)
          .json({ ok: true, pendientes_por_pais: aggregation });
      }

      // Usuarios con país asignado obtienen solo su conteo
      const pais = req.user?.pais;
      if (!pais)
        return res.status(400).json({
          ok: false,
          error_message: "El usuario no tiene país asignado",
        });

      const total = await SolicitudModel.countDocuments({
        estado: "pendiente",
        pais,
      });
      return res.status(200).json({ ok: true, pais, total });
    } catch (error) {
      console.error("Error getting pendientes por pais:", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al obtener solicitudes pendientes por país",
      });
    }
  }

  async getTotal(req: Request, res: Response): Promise<any> {
    try {
      // Superadmin obtiene total global
      if (req.user && req.user.rol === "superadmin") {
        const total = await SolicitudModel.countDocuments({});
        return res.status(200).json({ ok: true, total });
      }

      // Para otros, contar solo el país asignado
      const pais = req.user?.pais;
      if (!pais)
        return res.status(400).json({
          ok: false,
          error_message: "El usuario no tiene país asignado",
        });

      const total = await SolicitudModel.countDocuments({ pais });
      return res.status(200).json({ ok: true, pais, total });
    } catch (error) {
      console.error("Error getting total solicitudes:", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al obtener total de solicitudes",
      });
    }
  }

  async getTotalSolicitudPais(req: Request, res: Response): Promise<any> {
    try {
      let filter: any = {};

      //  Si viene un país en la query, usarlo
      const paisQuery = req.query.pais as string;

      if (paisQuery) {
        filter.pais = paisQuery;
      } else if (req.user && req.user.rol !== "superadmin") {
        filter.pais = req.user.pais;
      }

      const total = await SolicitudModel.countDocuments(filter);

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
  async getTotalSolicitudPaisPenientes(
    req: Request,
    res: Response,
  ): Promise<any> {
    try {
      let filter: any = {};
      filter.estado = "pendiente";

      //  Si viene un país en la query, usarlo
      const paisQuery = req.query.pais as string;

      if (paisQuery) {
        filter.pais = paisQuery;
      } else if (req.user && req.user.rol !== "superadmin") {
        filter.pais = req.user.pais;
      }

      const total = await SolicitudModel.countDocuments(filter);

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
  async createPublic(req: Request, res: Response): Promise<any> {
    try {
      const { nombre, correo, telefono, finalidad, pais } = req.body;

      // Validar campos requeridos
      if (!nombre || !correo || !telefono || !finalidad || !pais) {
        return res.status(400).json({
          ok: false,
          error_message: "Todos los campos son requeridos",
        });
      }

      // Validar que el país sea válido
      const paisesValidos = ["Chile", "Colombia", "Ecuador"];
      if (!paisesValidos.includes(pais)) {
        return res.status(400).json({
          ok: false,
          error_message: "País no válido",
        });
      }

      const solicitud = await SolicitudModel.create({
        nombre,
        correo,
        telefono,
        finalidad,
        pais,
        estado: "pendiente",
      });

      return res.status(201).json({ ok: true, solicitud });
    } catch (error) {
      console.error("Error creating solicitud pública:", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al crear solicitud",
      });
    }
  }
}
