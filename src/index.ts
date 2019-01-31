import { PolymathRegistryAbi } from './artifacts/PolymathRegistryAbi';
import { SecurityTokenRegistryAbi } from './artifacts/SecurityTokenRegistryAbi';
import { PolyTokenAbi } from './artifacts/PolyTokenAbi';

const Web3 = require('web3'); // tslint:disable-line
/**
 * Please modify this constant with your own local Polymaty Registry address
 */
const REGISTRY_ADDRESS = '0x0f3da9b8682a6054300b8c78a0eca5e79d506380';

declare global {
    interface Window {
        App: any;
    }
}

let polymathRegistry, securityTokenRegistry, polyToken, w3;

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
        (<HTMLInputElement>document.getElementById('msgCheck')).innerText = "Checking ticker symbol in local blockchain...";
        (<HTMLInputElement>document.getElementById('check')).disabled = true;
        const symbol = (<HTMLInputElement>document.getElementById('ticker')).value;
        const result = await securityTokenRegistry.methods.getTickerDetails(symbol).call();
        (<HTMLInputElement>document.getElementById('check')).disabled = false;
        if (parseInt(result[1]) === 0) {
            (<HTMLInputElement>document.getElementById('msgCheck')).innerText = symbol + " is available";
        } else {
            (<HTMLInputElement>document.getElementById('msgCheck')).innerText = symbol + " is not available";
        }
    }
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
            polymathRegistry = window.App.registryConnect();
            securityTokenRegistry = await window.App.securityTokenRegistryConnect();
            polyToken = await window.App.polytokenConnect();
        }
    } catch(e) {
        console.log('ERROR', e);
    }
});