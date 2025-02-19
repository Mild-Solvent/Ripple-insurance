#ifndef UTILITIES_H
#define UTILITIES_H

#include <hookapi.h>

// Common utility functions for insurance hooks

// Validate contract address format
int64_t check_contract_address(const uint8_t* address) {
    // Implementation would check address checksum
    // and format requirements
    return 1; // Placeholder
}

// Generate unique policy ID using hash of sender + sequence
void generate_policy_id(uint8_t* policy_id) {
    uint8_t account[20];
    uint32_t sequence;
    
    otxn_field(account, 20, sfAccount);
    sequence = otxn_field(SBUF(buffer), sfSequence);
    
    // Hash implementation would go here
    util_sha512h(policy_id, account, 20, &sequence, 4);
}

// Validate Chainlink oracle signature
int64_t validate_oracle_signature(const uint8_t* sig, int64_t sig_len) {
    // Implementation would verify ECDSA signature
    // against known oracle public key
    return 1; // Placeholder
}

// Check weather conditions against policy terms
int64_t check_payout_conditions(const uint8_t* data, int64_t data_len) {
    // Parse weather data and compare with thresholds
    return 1; // Placeholder
}

#endif // UTILITIES_H 