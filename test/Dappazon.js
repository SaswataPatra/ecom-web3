// Importing necessary modules from Chai and Hardhat libraries
const { expect } = require("chai");
const { ethers } = require("hardhat");

// Helper function to convert a number to its token representation (ether units)
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};
const ID = 1;
const NAME = "SHOES";
const CATEGORY = "CLOTHING";
const IMAGE = "IMAGE";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

// Test suite for the "Dappazon" smart contract
describe("Dappazon", () => {
  let dappazon; // Variable to hold the deployed instance of the "Dappazon" contract
  let deployer, buyer; // Variables to hold references to the signer accounts

  // This function runs before each test case, allowing setup and contract deployment
  beforeEach(async () => {
    // Obtain the first two signer accounts from the network (deployer and buyer)
    [deployer, buyer] = await ethers.getSigners();

    // Deploy the "Dappazon" smart contract using its factory
    const Dappazon = await ethers.getContractFactory("Dappazon");
    dappazon = await Dappazon.deploy();
  });

  // Test case for verifying the contract deployment
  describe("Deployment", () => {
    it("sets an owner", async () => {
      // Check if the owner of the deployed "Dappazon" contract is the same as the deployer's address
      expect(await dappazon.owner()).to.equal(deployer.address);
    });
  });

  describe("listing", () => {
    let transaction;
    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      await transaction.wait();
    });
    it("returns item attributes", async () => {
      const item = await dappazon.items(1);
      // console.log(`item name is ${item.name}`);
      expect(item.id).to.equal(ID);
      expect(item.name).to.equal(NAME);
      expect(item.category).to.equal(CATEGORY);
      expect(item.image).to.equal(IMAGE);
      expect(item.cost).to.equal(COST);
      expect(item.rating).to.equal(RATING);
      expect(item.stock).to.equal(STOCK);
    });

    it("checks for an event", async () => {
      expect(transaction).to.emit(dappazon, "List");
    });
  });
  describe("order list", () => {
    let transaction;
    let order;
    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();
    });
    it("updates the contract balance", async () => {
      const result = await ethers.provider.getBalance(dappazon.address);
      expect(result).to.equal(COST);
    });
    it("updates the buyers order count", async () => {
      const result = await dappazon.orderCount(buyer.address);
      expect(result).to.equal(1);
    });
    it("list all orders", async () => {
      order = await dappazon.orders(buyer.address, 1);
      // const str = order.time
      expect(order.item.name).to.equal(NAME);
    });
    it("checks for an event", async () => {
      await expect(transaction)
        .to.emit(dappazon, "Buy")
        .withArgs(buyer.address, order.item.id, COST);
    });
  });
  describe("withdraw", () => {
    let transaction;
    let balanceBefore; 
    let balanceAfter;
    beforeEach(async () => {
      transaction = await dappazon
        .connect(deployer)
        .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
      transaction = await dappazon.connect(buyer).buy(ID, { value: COST });
      await transaction.wait();
      balanceBefore = await ethers.provider.getBalance(deployer.address);
      transaction = await dappazon.connect(deployer).withdraw();
    });
    it("updates owners balance", async () => {
      balanceAfter = await ethers.provider.getBalance(deployer.address);
      expect(balanceAfter).to.be.greaterThan(balanceBefore);
    });
    it("updates contract balance",async ()=>{
      balanceAfter = await ethers.provider.getBalance(dappazon.address);
      expect(balanceAfter).to.equal(0);
    })
  });
});
