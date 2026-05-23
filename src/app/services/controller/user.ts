import { Request, Response } from "express";
import { CustomResponse, User, UserService } from "../interfaces/user";
import { UserModel } from "../../models/user";
import bycrypt from "bcryptjs";
import crypto from "crypto";
import { generateToken } from "../../helpers/jwt";

export type UserResponse = CustomResponse<User>;

export class UserController implements UserService<UserResponse> {
  public async create(req: Request, res: Response): Promise<UserResponse> {
    // let  name = req.body.name;
    let {
      email,
      phone,
      password,
    }: { email: string; phone: string; password: string } = req.body;

    try {
      const find_email: User | null = await UserModel.findOne({ email });
      if (find_email)
        return res
          .status(400)
          .json({ ok: false, error_message: "este correo ya esta registrado" });

      const find_phone: User | null = await UserModel.findOne({ phone });
      if (find_phone)
        return res.status(400).json({
          ok: false,
          error_message: "este numero de telefono ya esta registrado",
        });

      const salt = bycrypt.genSaltSync(10);
      password = bycrypt.hashSync(password, salt);

      const user: User = {
        name: req.body.name,
        email,
        phone,
        password,
        rol: req.body.rol ?? "editor",
        pais_asignado: req.body.pais_asignado ?? null,
      };

      const user_model = await UserModel.create({
        id: crypto.randomUUID(),
        ...user,
      });

      const token = await generateToken({
        id: user_model.id!,
        rol: user_model.rol,
        pais_asignado: user_model.pais_asignado,
      }); // generacion de jwt

      return res.status(200).json({
        message: "User created successfully",
        user: user_model,
        token,
      });
    } catch (error) {
      console.error("error al crear el usuario", error);
      return res
        .status(400)
        .json({ ok: false, error_message: "error al crear el usuario" });
    }
  }

  async login(
    req: Request,
    res: Response,
  ): Promise<CustomResponse<UserResponse>> {
    const { email, password } = req.body;
    try {
      const find_user = await UserModel.findOne({ email });
      if (!find_user)
        return res
          .status(400)
          .json({ ok: false, error_message: "email no encontrado" });

      const validPassword = bycrypt.compareSync(password, find_user.password);
      if (!validPassword)
        return res
          .status(400)
          .json({ ok: false, error_message: "la contraseña no es valida" });
      //cambie esto por el login no deja pq no genera completo el token
      const token = await generateToken({
        id: find_user.id!,
        rol: find_user.rol,
        pais_asignado: find_user.pais_asignado,
      });
      return res
        .status(200)
        .json({ ok: true, message: "usuario logeado", user: find_user, token });
    } catch (error) {
      console.error("error en el login", error);
      return res.status(400).json({
        ok: false,
        error_message: `error al intentar logearse ${error}`,
      });
    }
  }
  //Metodo para capturar los datos del usuario
  async getMe(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          ok: false,
          error_message: "Usuario no autenticado",
        });
      }

      const user = await UserModel.findOne({
        id: userId,
      });

      if (!user) {
        return res.status(404).json({
          ok: false,
          error_message: "Usuario no encontrado",
        });
      }

      return res.status(200).json({
        ok: true,
        user,
      });
    } catch (error) {
      console.error("error obteniendo usuario", error);

      return res.status(500).json({
        ok: false,
        error_message: "Error obteniendo usuario",
      });
    }
  }
  // getUserCredentials(req: Request, res: Response): Promise<Response<User>> {
  //     throw new Error("Method not implemented.");
  // }
}
