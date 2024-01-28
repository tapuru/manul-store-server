import jwt, { SignOptions } from "jsonwebtoken";

export const signJwt = (
  payload: Object,
  keyName: "access" | "refresh",
  options: SignOptions
) => {
  let secretKey: string;

  switch (keyName) {
    case "access": secretKey = process.env.JWT_ACCESS_SECRET_KEY as string; break;
    case "refresh": secretKey = process.env.JWT_REFRESH_SECRET_KEY as string; break;
  }

  return jwt.sign(payload, secretKey, {
    ...(options && options)
  });
}

export const verifyJwt = <T>(token: string, keyName: "access" | "refresh"): T | null => {
  try {
    let secretKey: string;

    switch (keyName) {
      case "access": secretKey = process.env.JWT_ACCESS_SECRET_KEY as string; break;
      case "refresh": secretKey = process.env.JWT_REFRESH_SECRET_KEY as string; break;
    }

    const decoded = jwt.verify(token, secretKey) as T;

    return decoded;
  } catch (error) {
    return null;
  }
}