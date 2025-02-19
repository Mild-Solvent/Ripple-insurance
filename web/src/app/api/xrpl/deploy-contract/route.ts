import { NextResponse } from 'next/server';
import { Client, Wallet, xrpToDrops } from 'xrpl';

// XRPL Connection Setup
const client = new Client(process.env.XRPL_NODE_URL || 'wss://s.altnet.rippletest.net:51233');

/**
 * Deploys a new insurance contract on XRPL
 * Required params:
 * - issuer_seed: Issuer's secret seed
 * - contract_terms: Base58 encoded contract terms
 * - premium: Premium amount in XRP
 * - payout: Maximum payout amount in XRP
 */
export async function POST(request: Request) {
  try {
    const { issuer_seed, contract_terms, premium, payout } = await request.json();
    
    // Validate inputs
    if (!issuer_seed || !contract_terms || !premium || !payout) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    await client.connect();
    const issuer_wallet = Wallet.fromSeed(issuer_seed);

    // Prepare ContractDeploy transaction
    const tx = await client.autofill({
      TransactionType: 'ContractDeploy',
      Account: issuer_wallet.address,
      ContractTerms: contract_terms,
      Premium: xrpToDrops(premium),
      MaxPayout: xrpToDrops(payout),
      Flags: 0
    });

    // Sign and submit
    const signed = issuer_wallet.sign(tx);
    const result = await client.submitAndWait(signed.tx_blob);

    return NextResponse.json({
      success: true,
      tx_hash: result.hash,
      contract_id: result.meta?.ContractID
    });

  } catch (error) {
    console.error('Deployment error:', error);
    return NextResponse.json(
      { error: 'Contract deployment failed', details: error },
      { status: 500 }
    );
  } finally {
    client.disconnect();
  }
} 