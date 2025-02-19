#include <hookapi.h>
#include "Utilities.c"

#define GUARD() _g(1,1)

// Policy Creation Hook
// Manages policy lifecycle and premium payments
int64_t hook(uint32_t reserved) {
    GUARD();
    
    // Validate payment transaction
    if (otxn_type() != ttPAYMENT)
        rollback(SBUF("Invalid transaction type"), 100);
        
    // Check destination matches contract address
    uint8_t dest[20];
    otxn_field(dest, 20, sfDestination);
    if (!check_contract_address(dest))
        rollback(SBUF("Invalid contract address"), 101);
    
    // Verify premium amount matches contract terms
    XFL paid_amount = float_sto(otxn_field(SBUF(buffer), sfAmount));
    XFL required_premium = state_float_get(SBUF("CONFIG_PREMIUM"));
    
    if (paid_amount < required_premium)
        rollback(SBUF("Insufficient premium payment"), 102);
    
    // Generate policy ID (hash of sender + sequence)
    uint8_t policy_id[32];
    generate_policy_id(policy_id);
    
    // Store policy details
    state_set(policy_id, SBUF("POLICY_ACTIVE"), 1);
    state_set(policy_id, SBUF("POLICY_START"), ledger_time());
    
    return accept(SBUF("Policy created successfully"), 0);
} 