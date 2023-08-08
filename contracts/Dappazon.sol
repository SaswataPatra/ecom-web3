// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {

    //structs
    address public owner;
    struct Item {
        uint256 id;
        string name;
        string category;
        string  image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }
    struct Order{
        uint256 time;
        Item item;
    }

    //mappings
    mapping(uint256=>Item) public items; //item id => Item struct
    mapping(address=>uint256) public orderCount; //address => number of orders placed by this address
    mapping(address=>mapping(uint256=>Order)) public orders; //address => (orderCount => Order struct)

    //event structs
    event List(uint256 id, string name, uint256 cost);
    event Buy(address buyer, uint256 itemId,uint256 cost);


    modifier onlyOwner(){
        require(msg.sender==owner);
        _;
    }
    constructor(){
        owner = msg.sender;
    }

    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner{
        Item memory item = Item(_id,_name,_category,_image,_cost,_rating,_stock);
        items[_id] = item;
        emit List(_id,_name,_cost);
    }

    function buy(uint256 _id) public payable {
        //Create an order
        
        Item memory item = items[_id];
        require(msg.value>=item.cost,"Insufficient balance");
        Order memory order = Order(block.timestamp, item);

        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]] = order;

        items[_id].stock=item.stock-1;
        emit Buy(msg.sender,item.id,item.cost);
    }
    function withdraw() public onlyOwner{
        payable(owner).transfer(address(this).balance);
    }
}
