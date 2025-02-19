import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'policies.json');

export async function GET() {
  try {
    const fileData = await fs.promises.readFile(filePath, 'utf8');
    const policies = JSON.parse(fileData);
    return NextResponse.json(policies);
  } catch (error) {
    console.error('Error loading policies:', error);
    return NextResponse.json([], { status: 404 });
  }
} 