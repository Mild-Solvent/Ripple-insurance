import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'data', 'policies.json');

export async function POST(request: Request) {
  const policy = await request.json();
  
  try {
    // Create data directory if it doesn't exist
    await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
    
    // Read existing policies
    let policies = [];
    try {
      const fileData = await fs.promises.readFile(filePath, 'utf8');
      policies = JSON.parse(fileData);
    } catch (error) {
      // File doesn't exist yet, start fresh
    }
    
    // Add new policy
    policies.push(policy);
    
    // Write updated policies
    await fs.promises.writeFile(filePath, JSON.stringify(policies, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving policy:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save policy' },
      { status: 500 }
    );
  }
} 