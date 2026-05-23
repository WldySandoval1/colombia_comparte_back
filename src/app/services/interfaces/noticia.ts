import { Request, Response } from "express";
import { RowRecord } from "./misc/record";

export interface Noticia {
  titulo: string;
  resumen?: string;
  contenido?: string;
  autor?: string;
  imagen_url?: string;
  pais: string; // id del país o nombre según uso en la app
  estado?: "borrador" | "publicado";
  fecha_creacion?: Date;
}

export type INoticia = RowRecord<Noticia>;

export type CustomResponse<TResponse> = void | TResponse | Response;

export interface NoticiaService<TResponse = any> {
  create(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  getAll(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  getById(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  update(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
  delete(req: Request, res: Response): Promise<CustomResponse<TResponse>>;
}
