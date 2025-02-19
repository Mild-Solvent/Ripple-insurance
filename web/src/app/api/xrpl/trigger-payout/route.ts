import { NextResponse } from 'next/server';
import { Client, Wallet } from 'xrpl';
import { Oracle } from '@chainlink/contracts'; // Hypothetical Chainlink integration

// XRPL Connection Setup
const client = new Client(process.env.XRPL_NODE_URL || 'wss://s.altnet.rippletest.net:51233');

/**
 * Triggers automatic payout based on oracle data
 * Required params:
 * - policy_id: XRPL Policy ID
 * - oracle_data: Signed weather data from Chainlink
 */
export async function POST(request: Request) {
  try {
    const { policy_id, oracle_data } = await request.json();
    
    // Validate oracle signature
    const isValid = await Oracle.verifySignature(oracle_data);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid oracle signature' },
        { status: 401 }
      );
    }

    await client.connect();
    const issuer_wallet = Wallet.fromSeed(process.env.ISSUER_SEED!);

    // Prepare PayoutTrigger transaction
    const tx = await client.autofill({
      TransactionType: 'PayoutTrigger',
      Account: issuer_wallet.address,
      PolicyID: policy_id,
      OracleData: oracle_data,
      Flags: 0
    });

    // Sign and submit
    const signed = issuer_wallet.sign(tx);
    const result = await client.submitAndWait(signed.tx_blob);

    return NextResponse.json({
      success: true,
      payout_amount: result.meta?.PayoutAmount,
      tx_hash: result.hash
    });

  } catch (error) {
    console.error('Payout error:', error);
    return NextResponse.json(
      { error: 'Payout trigger failed', details: error },
      { status: 500 }
    );
  } finally {
    client.disconnect();
  }
} 