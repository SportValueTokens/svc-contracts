const { expect } = require("chai");
const hre = require("hardhat");

describe("Sport Value Coin", function () {
    let owner
    let user1
    let token

    before(async () => {
        [owner, user1] = await hre.ethers.getSigners();
    });

    beforeEach(async () => {
        token = await hre.ethers.deployContract('SportValueCoin', ['Test Sport Value Coin','SVC',100] );
    });

    describe('Deployment', () => {
        it("should initialise the token", async () => {
            const ownerBalance = await token.balanceOf(owner.address);
            expect(await token.totalSupply()).to.equal(ownerBalance);
            expect(await token.hasRole(token.DEFAULT_ADMIN_ROLE(), owner.address)).to.equal(true);
            expect(await token.hasRole(token.PAUSER_ROLE(), owner.address)).to.equal(true);
            expect(await token.hasRole(token.MINTER_ROLE(), owner.address)).to.equal(true);
        })
    })

    describe('transfer', () => {
        it("should transfer tokens", async function () {
            const ownerBalanceBefore = await token.balanceOf(owner.address);
            await token.transfer(user1.address, 1)
            const ownerBalanceAfter = await token.balanceOf(owner.address);
            const userBalanceAfter = await token.balanceOf(user1.address);
            expect(ownerBalanceAfter).to.equal(ownerBalanceBefore - BigInt(1));
            expect(userBalanceAfter).to.equal(BigInt(1));
        })

        it("should revert if not enough balance", async function () {
            const ownerBalanceBefore = await token.balanceOf(owner.address);

            await expect(token.transfer(user1.address, 101)).to.be.revertedWithCustomError(token,'ERC20InsufficientBalance');

            const ownerBalanceAfter = await token.balanceOf(owner.address);
            const userBalanceAfter = await token.balanceOf(user1.address);
            expect(ownerBalanceAfter).to.equal(ownerBalanceBefore)
            expect(userBalanceAfter).to.equal(0)
        })
    })

    describe('mint', () => {
        it("should mint tokens", async function () {
            const totalSupplyBefore = await token.totalSupply();
            const ownerBalanceBefore = await token.balanceOf(owner.address);
            await token.mint(owner.address, 100);
            const ownerBalanceAfter = await token.balanceOf(owner.address);
            expect(ownerBalanceAfter).to.equal(ownerBalanceBefore + BigInt(100));
            expect(await token.totalSupply()).to.equal(totalSupplyBefore + BigInt(100))
        })

        it("should revert unauthorised minters", async function () {
            const totalSupplyBefore = await token.totalSupply();
            await expect(token.connect(user1).mint(owner.address, 100)).to.be.revertedWithCustomError(token,'AccessControlUnauthorizedAccount');
            expect(await token.totalSupply()).to.equal(totalSupplyBefore)
        })

        it("should revert if trying to mint more than max supply", async function () {
            const totalSupplyBefore = await token.totalSupply();
            await expect(token.mint(owner.address, hre.ethers.parseEther('1000000000'))).to.be.revertedWithCustomError(token,'MaxSupplyExceeded');
            expect(await token.totalSupply()).to.equal(totalSupplyBefore)
        })
    })

    describe('burn', () => {
        it("should burn tokens", async function () {
            const totalSupplyBefore = await token.totalSupply();
            const ownerBalanceBefore = await token.balanceOf(owner.address);
            await token.burn(10);
            const ownerBalanceAfter = await token.balanceOf(owner.address);
            expect(ownerBalanceAfter).to.equal(ownerBalanceBefore - BigInt(10))
            expect(await token.totalSupply()).to.equal(totalSupplyBefore -  BigInt(10))
        })

        it("should revert if not enough tokens to burn", async function () {
            const totalSupplyBefore = await token.totalSupply();
            await expect(token.burn(110)).to.be.revertedWithCustomError(token,'ERC20InsufficientBalance');
            expect(await token.totalSupply()).to.equal(totalSupplyBefore)
        })
    })
})
