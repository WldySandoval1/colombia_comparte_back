import { Request, Response } from "express";
import { RowRecord } from "./misc/record";

export interface Testimonio {
  nombre: string;
  foto_url?: string;
  testimonio: string;
  pais: string;
  instagram_url?: string;
  facebook_url?: string;
  estado?: "borrador" | "publicado" | "despublicado";
  fecha_creacion?: Date;
}

export type ITestimonio = RowRecord<Testimonio>;

export type CustomResponse<TResponse> = void | TResponse | Response;

export interface TestimonioService<TResponse = any> {
  create(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  getAll(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  getById(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  update(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  delete(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
}
