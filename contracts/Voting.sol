pragma solidity ^0.4.0;

import "./BallotData.sol";

contract Voting is BallotData {
    
    /**
     * The owner of this contract. 
     */
    address private owner;
    
    uint version = 0;
    /**
     * Validation to ensure only owner of this contract can call a function
     */
    modifier ownerOnly {
        if(msg.sender != owner) {
            revert("Operation not permitted");
        }
        _;
    }

    /**
     * Stores the address of voter against the option selected
     */
    mapping (address => uint32) private votes;
    
    /**
     * Store the owner of this contract
     */
    constructor() public {
        owner = msg.sender;
    }
    
    
    /**
     * Vote for an option. 
     */
    function vote(uint32 _optId) public {
        
        //increment the score of the option being voted
        options[_optId].score = options[_optId].score+1;
        // store the user id against the option voted
        votes[msg.sender] = _optId;
        
    }
    
    /**
     * Check which user voted for which option. Permitted to the owner of the 
     * contract only.
     */
    function getVoteFor(address _voter) public view ownerOnly returns (uint32 _optId) {
        return votes[_voter];
    }


    
}

