const Web3 = require('web3'); // tslint:disable-line
import { PolymathRegistryAbi } from './artifacts/PolymathRegistryAbi';
import { SecurityTokenRegistryAbi } from './artifacts/SecurityTokenRegistryAbi';
import { PolyTokenAbi } from './artifacts/PolyTokenAbi';

window.addEventListener('load', async () => {

    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

    if (await web3.eth.net.getId() == 15) {
        const polymathRegistryAddress = '0x0f3da9b8682a6054300b8c78a0eca5e79d506380';
        const polymathRegistryAbi = PolymathRegistryAbi.abi;
        const polymathRegistry = new web3.eth.Contract(polymathRegistryAbi, polymathRegistryAddress);
        polymathRegistry.setProvider(web3.currentProvider)

        const securityTokenRegistryAddress = await polymathRegistry.methods.getAddress("SecurityTokenRegistry").call();;
        const securityTokenRegistryABI = SecurityTokenRegistryAbi.abi;
        const securityTokenRegistry = new web3.eth.Contract(securityTokenRegistryABI, securityTokenRegistryAddress);
        securityTokenRegistry.setProvider(web3.currentProvider);

        let polytokenAddress = await polymathRegistry.methods.getAddress("PolyToken").call();
        let polytokenABI = PolyTokenAbi.abi;
        let polyToken = new web3.eth.Contract(polytokenABI, polytokenAddress);
        polyToken.setProvider(web3.currentProvider);

        // Check if the selected ticker is available
        const TOKEN_SYMBOL = "TEST";
        const details = await securityTokenRegistry.methods.getTickerDetails(TOKEN_SYMBOL).call();
        // If available, it returns 0 for the registration date
        if (parseInt(details[1]) === 0) {
            alert(TOKEN_SYMBOL + " is available")
        } else {
            alert(TOKEN_SYMBOL + " is not available")
        }
    }

});