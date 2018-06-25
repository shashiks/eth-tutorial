pragma solidity ^0.4.0;

/**
 * Contract represents a simple data model for storing ballot data.
 * Avoting contract can use this to define its ballot model
 */
contract BallotData {
    
    
    // data stucts
    struct Option {
        uint32 id;
        string value;
        uint32 score;
    }
    
    //list of options
    mapping(uint32 => Option) internal options ;
    
    //total count of options available
    uint32 public optionsCount = 0;
    
    
    function addOption(string _value) public returns (uint32 _optionId) {
        options[optionsCount] = Option({id : optionsCount, value: _value, score : 0});
        optionsCount++;
        return optionsCount;
    }

    /**
     * Returns name of an Option on given index
     */
    function getOptionAt(uint32 _id) public view returns (string, uint32) {
        return (options[_id].value, options[_id].score);
    }
    
    
    
}