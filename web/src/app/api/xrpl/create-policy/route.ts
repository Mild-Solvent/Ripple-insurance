import { NextResponse } from 'next/server';
import { Client, Wallet } from 'xrpl';

// XRPL Connection Setup
const client = new Client(process.env.XRPL_NODE_URL || 'wss://s.altnet.rippletest.net:51233');

/**
 * Creates a new insurance policy using XRPL hooks
 * Required params:
 * - farmer_address: XRPL account address
 * - contract_id: Existing contract ID
 * - coverage_amount: RLUSD amount
 * - duration: Policy duration in months
 */
export async function POST(request: Request) {
  try {
    const { farmer_address, contract_id, coverage_amount, duration } = await request.json();
    
    // Validate inputs
    if (!farmer_address || !contract_id || !coverage_amount || !duration) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    await client.connect();
    const issuer_wallet = Wallet.fromSeed(process.env.ISSUER_SEED!);

    // Prepare PolicyCreate transaction
    const tx = await client.autofill({
      TransactionType: 'PolicyCreate',
      Account: issuer_wallet.address,
      Destination: farmer_address,
      ContractID: contract_id,
      Amount: coverage_amount.toString(),
      Duration: duration,
      Flags: 0
    });

    // Sign and submit
    const signed = issuer_wallet.sign(tx);
    const result = await client.submitAndWait(signed.tx_blob);

    return NextResponse.json({
      success: true,
      policy_id: result.meta?.PolicyID,
      tx_hash: result.hash
    });

  } catch (error) {
    console.error('Policy creation error:', error);
    return NextResponse.json(
      { error: 'Policy creation failed', details: error },
      { status: 500 }
    );
  } finally {
    client.disconnect();
  }
} 