// SPDX-License-Identifier: MIT
// implementation for EVM sidechain
// src/contracts/
// ├── InsurancePolicy.sol          # Main insurance logic
// ├── interfaces/
// │   └── IXRPLBridge.sol          # Bridge interface for XRPL<->EVM
// └── chainlink/
//     └── OracleConfig.sol         # Chainlink oracle setup


pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";

contract XRPLInsurance is ChainlinkClient {
    struct Policy {
        address farmer;
        uint256 premium;
        uint256 coverageAmount;
        uint256 startDate;
        uint256 endDate;
        bool payoutTriggered;
    }

    mapping(bytes32 => Policy) public policies;
    mapping(bytes32 => bool) public oracleRequests;
    
    address public issuer;
    uint256 public policyCount;
    
    event PolicyCreated(bytes32 policyId, address farmer);
    event PayoutTriggered(bytes32 policyId, uint256 amount);

    constructor(address _linkToken, address _oracle) {
        issuer = msg.sender;
        setChainlinkToken(_linkToken);
        setChainlinkOracle(_oracle);
    }

    // Create new insurance policy
    function createPolicy(
        address _farmer,
        uint256 _premium,
        uint256 _coverageAmount,
        uint256 _duration
    ) external payable {
        require(msg.value == _premium, "Incorrect premium amount");
        
        bytes32 policyId = keccak256(abi.encodePacked(
            _farmer, 
            block.timestamp, 
            policyCount
        ));
        
        policies[policyId] = Policy({
            farmer: _farmer,
            premium: _premium,
            coverageAmount: _coverageAmount,
            startDate: block.timestamp,
            endDate: block.timestamp + _duration,
            payoutTriggered: false
        });
        
        policyCount++;
        emit PolicyCreated(policyId, _farmer);
    }

    // Initiate weather data request
    function requestPayout(
        bytes32 _policyId,
        string memory _jobId,
        string memory _region
    ) external {
        require(policies[_policyId].farmer == msg.sender, "Not policy holder");
        require(!policies[_policyId].payoutTriggered, "Payout already processed");
        
        Chainlink.Request memory req = buildChainlinkRequest(
            bytes32(bytes(_jobId)),
            address(this),
            this.fulfillPayout.selector
        );
        
        req.add("region", _region);
        req.add("path", "data,result");
        
        oracleRequests[sendChainlinkRequest(req, 0.1 ether)] = _policyId;
    }

    // Chainlink oracle response handler
    function fulfillPayout(
        bytes32 _requestId,
        bytes32 _weatherData
    ) external recordChainlinkFulfillment(_requestId) {
        bytes32 policyId = oracleRequests[_requestId];
        Policy storage policy = policies[policyId];
        
        require(_weatherData == bytes32("TRIGGER_PAYOUT"), "Conditions not met");
        
        payable(policy.farmer).transfer(policy.coverageAmount);
        policy.payoutTriggered = true;
        
        emit PayoutTriggered(policyId, policy.coverageAmount);
    }
} 