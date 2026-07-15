import { NextRequest, NextResponse } from "next/server";
import {
  addEmailUser,
  checkEmailValid,
  checkUsernameValid,
  generateUniqueSlug,
} from "@/service/user";
import bcrypt from "bcrypt";
import { registerSchema } from "@/lib/validation";
import { withErrorHandler } from "@/lib/api-handler";

export const POST = withErrorHandler(async (req: NextRequest) => {
  const body = await req.json();
  const parsed = registerSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  const { name, username, email, password } = parsed.data;

  const isExistUsername = await checkUsernameValid(username);
  const isExistEmail = await checkEmailValid(email);
  const error = {
    username: isExistUsername ? "존재하는 Username 입니다" : "",
    email: isExistEmail ? "가입된 이메일 입니다" : "",
  };

  if (isExistUsername || isExistEmail) {
    return NextResponse.json({ error }, { status: 422 });
  }

  const slug = await generateUniqueSlug(username);

  const newData = {
    name,
    username,
    email,
    password: bcrypt.hashSync(password, 12),
    slug,
  };

  return await addEmailUser(newData).then((data) => NextResponse.json(data));
});
