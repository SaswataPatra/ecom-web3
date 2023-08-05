// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract mem{
    string[] public stateArray = ["abc","def", "xyz"];//state array
    function set_memory() public view{
        string[] memory dup_array=stateArray; //local array
        dup_array[0] = "Hello";
    }
    function set_storage() public {
        string[] storage dup_array=stateArray;
        dup_array[0] = "World";
    }
}