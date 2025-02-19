import { NextResponse } from 'next/server';

const policies = [
  // Your existing policies array here
];

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const policy = policies.find(p => p.id === params.id);
  return NextResponse.json(policy || { error: 'Policy not found' }, {
    status: policy ? 200 : 404
  });
} 