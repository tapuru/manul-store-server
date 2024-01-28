import express from "express";
import { CreateUserInput, LoginUserInput } from "../schemas/userSchema";
import { UserService } from "../services/UserService";
import { AppError } from "../exeptions/AppError";
import { User } from "../entities/User";
import { TokenService } from "../services/TokenService";
import { verifyJwt } from "../utils/jwt";
import { UserDto } from "../dtos/UserDto";
import { CookiesEnum } from "../types/cookies";

export class AuthController {

  async register (
    req: express.Request<{}, {}, CreateUserInput>, 
    res: express.Response, 
    next: express.NextFunction
  ) {
    try {
      const { email, name, password } = req.body;

      const user = await UserService.createUser({
        name,
        email: email.toLowerCase(),
        password
      });

      const userDto = new UserDto(user);

      return res.status(201).json(userDto);

    } catch (error: any) {
      if (error.code === "23505") {
        return res.status(409).json({
          message: "пользователь с таким Email уже зарегестрирован"
        })
      }

      next(AppError.badRequest(error.message));
    }
  }

  async login(
    req: express.Request<{}, {}, LoginUserInput>, 
    res: express.Response, 
    next: express.NextFunction
  ) {
    try {
      const { email, password } = req.body;

      const user = await UserService.findUserByEmail(email);
      if (!user) {
        return next(AppError.badRequest("Неверный Email или пароль!"))
      }
      const isPasswordValid = await User.comparePassword(password, user.password);
      if (!isPasswordValid) {
        return next(AppError.badRequest("Неверный Email или пароль!"))
      }

      const userDto = new UserDto(user);
      const { accessToken, refreshToken } = await TokenService.generateTokens({ ...userDto });
      await TokenService.saveToken(user, refreshToken);

      res.cookie(CookiesEnum.REFRESH_TOKEN, refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });

      res.status(200).json({
        user: userDto,
        accessToken
      })

    } catch (error) {
      next(AppError.badRequest(error.message));
    }
  }

  async logout(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return next(AppError.UnauthorizedError());
      }

      await TokenService.removeToken(refreshToken);

      res.clearCookie(CookiesEnum.REFRESH_TOKEN);
      res.json({
        status: "success",
        message: "Вы успешно разлогинились"
      });

    } catch (error) {
      return next(AppError.badRequest(error.message));
    }
  }

  async refresh(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const message = "Ошибка при рефреше access токена";

      if (!refreshToken) {
        return next(AppError.UnauthorizedError());
      }

      const decoded = verifyJwt<UserDto>(refreshToken, "refresh");

      if (!decoded) {
        return next(AppError.UnauthorizedError());
      }

      const user = await UserService.findUserById(decoded.id);

      if (!user) {
        return next(AppError.badRequest(message));
      }

      const userDto = new UserDto(user);
      const newTokens = await TokenService.generateTokens({ ...userDto });
      await TokenService.saveToken(user, newTokens.refreshToken);

      res.status(200).json({
        status: "success",
        data: {
          user: userDto,
          accessToken: newTokens.accessToken
        }
      });

    } catch (error) {
      next(AppError.badRequest(error.message));
    }
  }

}

 