const { ethers } = require('ethers');
const CarbonCreditABI = require('../abi/CarbonCredit.json');

const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_RPC_URL);
const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CarbonCreditABI, wallet);

const mintCreditsOnChain = async (walletAddress, amount) => {
  try {
    const amountWei = ethers.parseUnits(amount.toString(), 18);
    const tx = await contract.mintCredits(walletAddress, amountWei);
    await tx.wait();
    return tx.hash;
  } catch (error) {
    console.error('Blockchain Minting Error:', error);
    throw error;
  }
};

const getOnChainBalance = async (walletAddress) => {
  try {
    const balance = await contract.getOnChainBalance(walletAddress);
    return ethers.formatUnits(balance, 18);
  } catch (error) {
    console.error('Blockchain Balance Error:', error);
    throw error;
  }
};

const getAllListingsOnChain = async () => {
  try {
    const listings = await contract.getAllListings();
    return listings.map(l => ({
      id: l.id.toString(),
      seller: l.seller,
      amount: ethers.formatUnits(l.amount, 18),
      priceWei: l.priceWei.toString(),
      active: l.active
    }));
  } catch (error) {
    console.error('Blockchain Listings Error:', error);
    throw error;
  }
};

module.exports = {
  mintCreditsOnChain,
  getOnChainBalance,
  getAllListingsOnChain
};
