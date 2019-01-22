"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_1 = require("web3");
window.addEventListener('load', async () => {
    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new web3_1.default(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            web3.eth.sendTransaction({ /* ... */});
        }
        catch (error) {
            // User denied account access...
        }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
        window.web3 = new web3_1.default(web3.currentProvider);
        // Acccounts always exposed
        web3.eth.sendTransaction({ /* ... */});
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
});
