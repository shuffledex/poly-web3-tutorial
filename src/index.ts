import { RPCSubprovider, Web3ProviderEngine } from '@0x/subproviders';
import { Web3Wrapper } from '@0x/web3-wrapper';

window.addEventListener('load', async () => {

    const providerEngine = new Web3ProviderEngine();
    providerEngine.addProvider(new RPCSubprovider('http://127.0.0.1:8545'));
    providerEngine.start();

    const web3Wrapper = new Web3Wrapper(providerEngine);
    const addresses = await web3Wrapper.getAvailableAddressesAsync();
    console.log(addresses);

});