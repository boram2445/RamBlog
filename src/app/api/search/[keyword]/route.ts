import { searchAll } from '@/service/search';
import { NextRequest, NextResponse } from 'next/server';

type Context = {
  params: { keyword: string };
};

export async function GET(_: NextRequest, context: Context) {
  return searchAll(context.params.keyword).then((data) =>
    NextResponse.json(data)
  );
}
