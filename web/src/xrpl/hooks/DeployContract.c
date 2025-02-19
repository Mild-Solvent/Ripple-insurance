#include <hookapi.h>
#include <xrpl_checks.h>

// Insurance Contract Deployment Hook
// Install this hook to create new insurance contracts
#define GUARD() _g(1,1)

// Hook Parameters:
// - Contract Terms (Blob)
// - Premium Amount (XFL)
// - Max Payout (XFL)
int64_t hook(uint32_t reserved) {
    GUARD();
    
    // Read transaction fields
    uint8_t txn[4096];
    int64_t txn_len = otxn_field(SBUF(txn), sfTransaction);
    
    // Validate Transaction Type
    if (otxn_type() != ttHOOK_SET)
        rollback(SBUF("Invalid transaction type"), 100);
    
    // Parse contract parameters
    uint8_t terms[256];
    int64_t terms_len = otxn_field(terms, 256, sfBlob);
    XFL_PREMIUM = float_sto(otxn_field(SBUF(buffer), sfAmount));
    XFL_MAX_PAYOUT = float_sto(otxn_field(SBUF(buffer), sfSendMax));
    
    // Store contract in state
    state_set(SBUF("CONFIG_TERMS"), terms, terms_len);
    state_float_set(SBUF("CONFIG_PREMIUM"), XFL_PREMIUM);
    state_float_set(SBUF("CONFIG_MAX_PAYOUT"), XFL_MAX_PAYOUT);
    
    return accept(SBUF("Contract deployed successfully"), 0);
} 