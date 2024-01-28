import { AppDataSource } from "../db";
import { signJwt } from "../utils/jwt";
import { Token } from "../entities/Token";
import { User } from "../entities/User";

const tokenRepository = AppDataSource.getRepository(Token);

export class TokenService {

  static async generateTokens (payload: Object) {
    const accessToken = signJwt(payload, "access", { expiresIn: "15m" });
    const refreshToken = signJwt(payload, "refresh", { expiresIn: "30d" });

    return { accessToken, refreshToken }
  }

  static async saveToken (user: User, refreshToken: string) {
    const tokenData = await tokenRepository.findOne({where: { user: { id: user.id } }});
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      await tokenRepository.save(tokenData);
      return tokenData;
    }
    const token = tokenRepository.create({ user, refreshToken });
    await tokenRepository.save(token);
    return token;
  }

  static async findToken(refreshToken: string) {
    const tokenData = await tokenRepository.findOneBy({ refreshToken });
    return tokenData;
  }
  
  static async removeToken(refreshToken: string) {
    console.log(refreshToken);

    const tokenData = await tokenRepository.delete({ refreshToken: refreshToken });
    return tokenData;
  }
}