import { NextResponse } from 'next/server';
import { Client } from 'xrpl';

// XRPL Connection Setup
const client = new Client(process.env.XRPL_NODE_URL || 'wss://s.altnet.rippletest.net:51233');

/**
 * Retrieves policy status from XRPL ledger
 */
export async function GET(
  request: Request,
  { params }: { params: { policyId: string } }
) {
  try {
    await client.connect();
    
    // Query policy state from ledger
    const response = await client.request({
      command: 'account_objects',
      account: process.env.ISSUER_ADDRESS!,
      type: 'policy',
      index: params.policyId
    });

    if (!response.account_objects.length) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
      );
    }

    const policy = response.account_objects[0];
    return NextResponse.json({
      id: params.policyId,
      status: policy.Status,
      coverage_amount: policy.Amount,
      start_date: policy.StartDate,
      end_date: policy.EndDate,
      last_payout: policy.LastPayout
    });

  } catch (error) {
    console.error('Policy fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve policy' },
      { status: 500 }
    );
  } finally {
    client.disconnect();
  }
} 