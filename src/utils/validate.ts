export default function loginValidate(values: {
  email: string;
  password: string;
}) {
  const errors = { email: '', password: '' };

  if (!values.email) {
    errors.email = '이메일을 입력해주세요';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = '유효한 형식으로 이메일을 입력해주세요';
  }

  if (!values.password) {
    errors.password = '패스워드를 입력해주세요';
  } else if (values.password.length < 6 || values.password.length > 20) {
    errors.password = '패스워드는 6자 이상 20자 미만이어야 합니다';
  } else if (values.password.includes(' ')) {
    errors.password = '유효한 패스워드를 입력해주세요';
  }

  return errors;
}

export function registerValidate(values: {
  name: string;
  username: string;
  email: string;
  password: string;
}) {
  const errors = { name: '', username: '', email: '', password: '' };

  if (!values.name) {
    errors.name = '이름을 입력해주세요';
  } else if (values.name.includes(' ')) {
    errors.name = '유효한 이름을 입력해주세요';
  }

  if (!values.username) {
    errors.username = '고유한 아이디를 입력해주세요';
  } else if (values.name.includes(' ')) {
    errors.username = '유효한 아이디를 입력해주세요';
  }

  if (!values.email) {
    errors.email = '이메일을 입력해주세요';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = '유효한 형식으로 이메일을 입력해주세요';
  }

  if (!values.password) {
    errors.password = '패스워드를 입력해주세요';
  } else if (values.password.length < 6 || values.password.length > 20) {
    errors.password = '패스워드는 6자 이상 20자 미만이어야 합니다';
  } else if (values.password.includes(' ')) {
    errors.password = '유효한 패스워드를 입력해주세요';
  }

  return errors;
}
