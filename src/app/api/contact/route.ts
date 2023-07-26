import { sendEmail } from '@/service/email';
import { object, string } from 'yup';

let eamilSchema = object({
  from: string().email().required(),
  subject: string().required(),
  message: string().required(),
});

//여기서 유효한 form인지 체크한다.
export async function POST(req: Request) {
  const body = await req.json();

  if (!eamilSchema.isValidSync(body)) {
    return new Response(
      JSON.stringify({ message: '유효하지 않은 메일 포멧' }),
      { status: 400 }
    );
  }

  return sendEmail(body) //
    .then(
      () =>
        new Response(
          JSON.stringify({ message: '메일을 성공적으로 보냈습니다' }),
          { status: 200 }
        )
    )
    .catch((error) => {
      console.error(error);
      new Response(JSON.stringify({ message: '메일 전송 실패' }), {
        status: 500,
      });
    });
}
