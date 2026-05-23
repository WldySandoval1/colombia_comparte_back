import { Request, Response } from "express";
import { RowRecord } from "./misc/record";

export interface Solicitud {
  nombre: string;
  correo?: string;
  telefono?: string;
  finalidad?: string;
  pais: string;
  estado?: "pendiente" | "gestionada" | "respondida";
  fecha_creacion?: Date;
}

export type ISolicitud = RowRecord<Solicitud>;

export type CustomResponse<TResponse> = void | TResponse | Response;

export interface SolicitudService<TResponse = any> {
  create(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  getAll(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  getById(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  update(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  delete(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
}
