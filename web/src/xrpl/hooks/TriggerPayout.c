#include <hookapi.h>
#include "Utilities.c"

#define GUARD() _g(1,1)

// Payout Trigger Hook
// Executes insurance payouts based on oracle data
int64_t hook(uint32_t reserved) {
    GUARD();
    
    // Validate oracle signature
    uint8_t oracle_sig[64];
    int64_t sig_len = otxn_field(oracle_sig, 64, sfSignature);
    if (!validate_oracle_signature(oracle_sig, sig_len))
        rollback(SBUF("Invalid oracle signature"), 100);
    
    // Parse weather data parameters
    uint8_t weather_data[256];
    int64_t data_len = otxn_field(weather_data, 256, sfBlob);
    
    // Check payout conditions
    if (!check_payout_conditions(weather_data, data_len))
        rollback(SBUF("Payout conditions not met"), 101);
    
    // Calculate payout amount
    XFL payout_amount = calculate_payout_amount();
    
    // Prepare payout transaction
    struct {
        uint8_t dest[20];
        XFL amount;
    } payout;
    
    otxn_field(payout.dest, 20, sfAccount);
    payout.amount = payout_amount;
    
    // Emit payout transaction
    etxn_reserve(1);
    int64_t result = emit(SBUF(payout), ttPAYMENT);
    
    if (result != 0)
        rollback(SBUF("Payout failed"), 102);
    
    return accept(SBUF("Payout executed successfully"), 0);
} 