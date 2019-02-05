import { PolymathRegistryAbi } from './artifacts/PolymathRegistryAbi';
import { SecurityTokenRegistryAbi } from './artifacts/SecurityTokenRegistryAbi';
import { PolyTokenAbi } from './artifacts/PolyTokenAbi';

const Web3 = require('web3');
/**
 * Please modify this constant with your own local Polymaty Registry address
 */
const REGISTRY_ADDRESS = '0x0f3da9b8682a6054300b8c78a0eca5e79d506380';

declare global {
    interface Window {
        App: any;
    }
}

let polymathRegistry, securityTokenRegistry, polyToken, w3, account;

window.App = {
    web3: () => {
        return new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    },
    registryConnect: () => {
        const polymathRegistryAddress = REGISTRY_ADDRESS;
        const polymathRegistryAbi = PolymathRegistryAbi.abi;
        const polymathRegistry = new w3.eth.Contract(polymathRegistryAbi, polymathRegistryAddress);
        polymathRegistry.setProvider(w3.currentProvider);
        return polymathRegistry;
    },
    securityTokenRegistryConnect: async () => {
        const securityTokenRegistryAddress = await polymathRegistry.methods.getAddress("SecurityTokenRegistry").call();;
        const securityTokenRegistryABI = SecurityTokenRegistryAbi.abi;
        const securityTokenRegistry = new w3.eth.Contract(securityTokenRegistryABI, securityTokenRegistryAddress);
        securityTokenRegistry.setProvider(w3.currentProvider);
        return securityTokenRegistry;
    },
    polytokenConnect: async () => {
        let polytokenAddress = await polymathRegistry.methods.getAddress("PolyToken").call();
        let polytokenABI = PolyTokenAbi.abi;
        let polyToken = new w3.eth.Contract(polytokenABI, polytokenAddress);
        polyToken.setProvider(w3.currentProvider);
        return polyToken;
    },
    checkSymbol: async () => {
        (<HTMLInputElement>document.getElementById('msgCheck')).innerText = "Checking ticker symbol in blockchain...";
        (<HTMLInputElement>document.getElementById('check')).disabled = true;
        const symbol = (<HTMLInputElement>document.getElementById('ticker')).value;
        const result = await securityTokenRegistry.methods.getTickerDetails(symbol).call();
        (<HTMLInputElement>document.getElementById('check')).disabled = false;
        if (parseInt(result[1]) === 0) {
            (<HTMLInputElement>document.getElementById('msgCheck')).innerText = symbol + " is available. You can register it now!";
            (<HTMLInputElement>document.getElementById('registerWrapper')).style.display = "block";
            (<HTMLInputElement>document.getElementById('msgCheck')).style.color = "cornflowerblue";
            await window.App.getBalanceOf();
        } else {
            (<HTMLInputElement>document.getElementById('msgCheck')).innerText = symbol + " is not available. Try another symbol.";
            (<HTMLInputElement>document.getElementById('registerWrapper')).style.display = "none";
            (<HTMLInputElement>document.getElementById('msgCheck')).style.color = "red";
        }
    },
    keyPress: () => {
        (<HTMLInputElement>document.getElementById('registerWrapper')).style.display = "none";
    },
    getBalanceOf: async () => {
        let polyBalance = await polyToken.methods.balanceOf(account).call();
        let polyBalanceInEth = w3.utils.fromWei(polyBalance);
        let fee = await securityTokenRegistry.methods.getTickerRegistrationFee().call();
        let feeInEth = w3.utils.fromWei(fee);

        if (parseInt(polyBalanceInEth) < parseInt(feeInEth)) {
            (<HTMLInputElement>document.getElementById('register')).disabled = true;
            (<HTMLInputElement>document.getElementById('register')).innerText = "You need " + feeInEth + " POLY for execute this action."
        } else {
            (<HTMLInputElement>document.getElementById('register')).disabled = false;
            (<HTMLInputElement>document.getElementById('register')).innerText = "Register Symbol (you will pay " + feeInEth + " POLY)"
        }
    },
    registerSymbol: async () => {
        alert("signing transaction here");
    },
}

window.addEventListener('load', async () => {
    try {
        const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
        if (await web3.eth.net.getId() == 15) {
            try {
                w3 = window.App.web3();
            } catch(e) {
                console.log('ERROR', e);
            }

            w3.eth.getAccounts(async (err, accounts) => {
                if (err != null) {
                  alert("There was an error fetching your accounts.");
                  return;
                }
                if (accounts.length == 0) {
                  alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
                  return;
                }
                account = accounts[0];
                polymathRegistry = window.App.registryConnect();
                securityTokenRegistry = await window.App.securityTokenRegistryConnect();
                polyToken = await window.App.polytokenConnect();
            });
        }
    } catch(e) {
        console.log('ERROR', e);
    }
});