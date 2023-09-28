import { NextRequest, NextResponse } from 'next/server';
import {
  addEmailUser,
  checkEmailValid,
  checkUsernameValid,
} from '@/service/user';
import bcrypt from 'bcrypt';

export async function POST(req: NextRequest) {
  const { name, username, email, password } = await req.json();

  if (!name || !username || !email || !password) {
    return new Response('Bad request', { status: 400 });
  }

  const isExistUsername = await checkUsernameValid(username);
  const isExistEmail = await checkEmailValid(email);
  const error = {
    username: isExistUsername ? '존재하는 Username 입니다' : '',
    email: isExistEmail ? '가입된 이메일 입니다' : '',
  };

  if (isExistUsername || isExistEmail) {
    return new Response(JSON.stringify(error), { status: 422 });
  }

  const newData = {
    name,
    username,
    email,
    password: bcrypt.hashSync(password, 4),
  };

  return await addEmailUser(newData).then((data) => NextResponse.json(data));
}
