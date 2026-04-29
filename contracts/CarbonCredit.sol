// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Note: In a real development environment, you would import from @openzeppelin/contracts
// For this standalone file, we'll implement a simplified ERC20 for demonstration

contract CarbonCredit {
    string public name = "CarbonX Credit";
    string public symbol = "CXC";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    struct Listing {
        uint256 id;
        address seller;
        uint256 amount;
        uint256 priceWei;
        bool active;
    }

    uint256 public nextListingId;
    mapping(uint256 => Listing) public listings;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event CreditsMinted(address indexed ngo, uint256 amount);
    event CreditsListed(uint256 indexed listingId, address indexed seller, uint256 amount, uint256 priceWei);
    event CreditsPurchased(uint256 indexed listingId, address indexed buyer, uint256 amount);
    event CreditsTransferred(address indexed from, address indexed to, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function _mint(address account, uint256 amount) internal {
        totalSupply += amount;
        balanceOf[account] += amount;
        emit Transfer(address(0), account, amount);
    }

    function _transfer(address from, address to, uint256 amount) internal {
        require(balanceOf[from] >= amount, "Insufficient balance");
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        emit Transfer(from, to, amount);
    }

    function mintCredits(address ngo, uint256 amount) external onlyOwner {
        _mint(ngo, amount);
        emit CreditsMinted(ngo, amount);
    }

    function listCredits(uint256 amount, uint256 priceWei) external {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");
        
        listings[nextListingId] = Listing({
            id: nextListingId,
            seller: msg.sender,
            amount: amount,
            priceWei: priceWei,
            active: true
        });

        emit CreditsListed(nextListingId, msg.sender, amount, priceWei);
        nextListingId++;
    }

    function buyCredits(uint256 listingId) external payable {
        Listing storage listing = listings[listingId];
        require(listing.active, "Listing not active");
        require(msg.value >= listing.priceWei, "Insufficient payment");

        listing.active = false;
        
        _transfer(listing.seller, msg.sender, listing.amount);
        payable(listing.seller).transfer(msg.value);

        emit CreditsPurchased(listingId, msg.sender, listing.amount);
    }

    function transferCredits(address to, uint256 amount) external {
        _transfer(msg.sender, to, amount);
        emit CreditsTransferred(msg.sender, to, amount);
    }

    function getOnChainBalance(address account) external view returns (uint256) {
        return balanceOf[account];
    }

    function getAllListings() external view returns (Listing[] memory) {
        Listing[] memory allListings = new Listing[](nextListingId);
        for (uint256 i = 0; i < nextListingId; i++) {
            allListings[i] = listings[i];
        }
        return allListings;
    }
}
