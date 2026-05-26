import { Request, Response } from "express";
import { TestimonioModel } from "../../models/testimonio";
import { TestimonioService } from "../interfaces/testimonio";

export class TestimonioController implements TestimonioService {
  async create(req: Request, res: Response): Promise<any> {
    try {
      const data = req.body;
      if (req.user && req.user.rol !== "superadmin") data.pais = req.user.pais;

      const item = await TestimonioModel.create({ ...data });
      return res.status(201).json({ ok: true, testimonio: item });
    } catch (error) {
      console.error("Error creating testimonio:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al crear testimonio" });
    }
  }

  async getAll(req: Request, res: Response): Promise<any> {
    try {
      const filter: any = {};
      if (req.user && req.user.rol !== "superadmin")
        filter.pais = req.user.pais;
      if (req.query.estado) filter.estado = req.query.estado;
      if (req.query.pais) filter.pais = req.query.pais;

      const items = await TestimonioModel.find(filter).sort({
        fecha_creacion: -1,
      });
      return res.status(200).json({ ok: true, testimonios: items });
    } catch (error) {
      console.error("Error getting testimonios:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al obtener testimonios" });
    }
  }

  async getById(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const item = await TestimonioModel.findById(id);
      if (!item)
        return res
          .status(404)
          .json({ ok: false, error_message: "Testimonio no encontrado" });

      if (
        req.user &&
        req.user.rol !== "superadmin" &&
        req.user.pais !== item.pais
      ) {
        return res
          .status(403)
          .json({ ok: false, error_message: "Acceso denegado" });
      }

      return res.status(200).json({ ok: true, testimonio: item });
    } catch (error) {
      console.error("Error getting testimonio by id:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al obtener testimonio" });
    }
  }

  async update(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const updates = req.body;
      const item = await TestimonioModel.findById(id);
      if (!item)
        return res
          .status(404)
          .json({ ok: false, error_message: "Testimonio no encontrado" });

      if (
        req.user &&
        req.user.rol !== "superadmin" &&
        req.user.pais !== item.pais
      ) {
        return res
          .status(403)
          .json({ ok: false, error_message: "Acceso denegado" });
      }

      if (req.user && req.user.rol !== "superadmin") delete updates.pais;

      const updated = await TestimonioModel.findByIdAndUpdate(id, updates, {
        new: true,
      });
      return res.status(200).json({ ok: true, testimonio: updated });
    } catch (error) {
      console.error("Error updating testimonio:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al actualizar testimonio" });
    }
  }

  async delete(req: Request, res: Response): Promise<any> {
    try {
      const { id } = req.params;
      const item = await TestimonioModel.findById(id);
      if (!item)
        return res
          .status(404)
          .json({ ok: false, error_message: "Testimonio no encontrado" });

      if (
        req.user &&
        req.user.rol !== "superadmin" &&
        req.user.pais !== item.pais
      ) {
        return res
          .status(403)
          .json({ ok: false, error_message: "Acceso denegado" });
      }

      await TestimonioModel.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ ok: true, message: "Testimonio eliminado" });
    } catch (error) {
      console.error("Error deleting testimonio:", error);
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al eliminar testimonio" });
    }
  }

  async getTotalPublicados(req: Request, res: Response): Promise<any> {
    try {
      const filter: any = { estado: "publicado" };
      if (req.user && req.user.rol !== "superadmin") {
        filter.pais = req.user.pais;
      }

      const total = await TestimonioModel.countDocuments(filter);
      return res
        .status(200)
        .json({ ok: true, total, pais: filter.pais ?? "todos" });
    } catch (error) {
      console.error("Error getting total testimonios publicados:", error);
      return res.status(500).json({
        ok: false,
        error_message: "Error al obtener total de testimonios publicados",
      });
    }
  }

  // backend: testimonios.controller.ts
  async getTotalTestimoniosPais(req: Request, res: Response): Promise<any> {
    try {
      let filter: any = {};

      //  Si viene un país en la query, usarlo
      const paisQuery = req.query.pais as string;

      if (paisQuery) {
        filter.pais = paisQuery;
      } else if (req.user && req.user.rol !== "superadmin") {
        filter.pais = req.user.pais;
      }

      const total = await TestimonioModel.countDocuments(filter);

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
  async getTotalListTestimoniosPais(req: Request, res: Response): Promise<any> {
    try {
      let filter: any = {};

      const paisQuery = req.query.pais as string;

      if (paisQuery) {
        filter.pais = paisQuery;
      } else if (req.user && req.user.rol !== "superadmin") {
        filter.pais = req.user.pais;
      }

      // Obtener todos los testimonios sin paginación
      const testimonios = await TestimonioModel.find(filter).sort({
        fecha_creacion: -1,
      });

      return res.status(200).json({
        ok: true,
        testimonios,
        total: testimonios.length,
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
  async getPublicByPais(req: Request, res: Response): Promise<any> {
    try {
      const { pais } = req.params;

      const paisesValidos = ["Chile", "Colombia", "Ecuador"];
      if (!paisesValidos.includes(pais)) {
        return res
          .status(400)
          .json({ ok: false, error_message: "País no válido" });
      }

      const testimonios = await TestimonioModel.find({
        pais,
        estado: "publicado",
      }).sort({ fecha_creacion: -1 });

      return res.status(200).json({ ok: true, testimonios });
    } catch (error) {
      return res
        .status(500)
        .json({ ok: false, error_message: "Error al obtener testimonios" });
    }
  }
}
