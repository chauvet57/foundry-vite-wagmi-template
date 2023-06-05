// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "../contracts/Faucet.sol";
import "forge-std/Test.sol";

contract FaucetTest is Test {
    address owner = makeAddr("owner");
    address user1 = makeAddr("user1");
    Faucet public faucet;
    address public recipient;

    function setUp() public {
        hoax(owner);
        faucet = new Faucet();
    }

    function testMint() external payable {
        skip(1000000000000);

        // Transfert initial
        hoax(user1, 1 ether);
        faucet.mint{value: 0.5 ether}();
        
        // Vérification du solde ERC20
        IERC20 token = IERC20(address(faucet));
        assertEq(token.balanceOf(user1), 1e18, "Balance non egale a 1e18");
        
        // Vérification du solde Ether
        assertEq(address(faucet).balance, 0.0000001 ether);
    }

    function testRevertSixHeures() public {
        skip(1000000000000);

        // Transfert initial
        hoax(user1, 1 ether);
        faucet.mint{value: 0.5 ether}();

        hoax(user1, 1 ether);
        vm.expectRevert(bytes("Vous ne pouvez effectuer qu'une seule operation de transfert toutes les 6 heures"));
        faucet.mint{value: 0.5 ether}(); // revert

    }

    function testRevertLimitMoney() public {
        skip(1000000000000);
        // Mint 50 jetons (limite atteinte)
        for (uint256 i = 1; i <= 50; i++) {
            hoax(vm.addr(i), 1 ether);
            faucet.mint{value: 0.5 ether}();
        }
        
        // 51eme fois
        vm.expectRevert(bytes("La limite maximale de la monnaie est atteinte."));
        hoax(vm.addr(51), 1 ether);
        faucet.mint{value: 0.5 ether}();
    }

    function testRevertDownEther() public {
        // Transfert initial
        hoax(user1, 1 ether);
        vm.expectRevert(bytes("Vous devez envoyer 0.5 Ether"));
        faucet.mint{value: 0.1 ether}();
    }

    function testRevertUpEther() public {
        // Transfert initial
        hoax(user1, 1 ether);
        vm.expectRevert(bytes("Vous devez envoyer 0.5 Ether"));
        faucet.mint{value: 1 ether}();
    }

    function testWithdraw() public {
        deal(address(faucet), 10 ether);

        hoax(owner, 0);
        faucet.withdraw();
        assertEq(owner.balance, 10 ether);
    }

    function testRevertDownWithdraw() public {
        deal(address(faucet), 0 ether);
        
        hoax(owner, 0);
        vm.expectRevert(bytes("Le solde du contrat est nul"));
        faucet.withdraw();
    }
}
