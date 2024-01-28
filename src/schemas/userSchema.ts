import { RoleEnum } from "../entities/User";
import { TypeOf, object, string, z } from "zod";

export const createUserSchema = object({
  body: object({

    name: string({
      required_error: "Укажите имя!"
    }),

    email: string({
      required_error: "Укажите Email адрес!"
    })
      .email("Невалидный Email адрес!"),

    password: string({
      required_error: "Укажите пароль!"
    })
      .min(8, "Пароль должен быть длиннее 8 символов!")
      .max(32, "Пароль не должен превышать 32 символа!"),
    
    passwordConfirm: string({
      required_error: "Подтвердите пароль!"
    }),

    role: z.optional(z.nativeEnum(RoleEnum)),
    
  }).refine((data) => data.password === data.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Пароли не совпадают!"
  })
});

export const loginUserSchema = object({
  body: object({

    email: string({
      required_error: "Укажите Email адрес!"
    })
      .email("Невалидный Email адрес!"),

    password: string({
      required_error: 'Введите пароль!',
    }).min(8, 'Невалидный Email или пароль!'),
  })
});

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>["body"],
  'passwordConfirm'
>

export type LoginUserInput = TypeOf<typeof loginUserSchema>["body"]