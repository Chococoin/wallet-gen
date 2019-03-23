const { ethers, Contract } = require('ethers');
const db = require('./database.json');
const fs = require('fs');
const qr = require('qr-image');
const ChocoToken = require('./contract/ChocoToken.json');
//const mnemonic = 'sniff inspire glide artwork dove share plate observe believe suspect season eager';
//let mnemonic = "radar blur cabbage chef fix engine embark joy scheme fiction master release";

const provider = new ethers.providers.InfuraProvider( "ropsten", "35964334d3734699b301f626b8a47605" );
const prv = "488954449c0b5ef75c247882f2c103110e2962e7883ee40d617cc5608dde3c61";
const wallet = new ethers.Wallet(prv, provider);

const contractAddress = ChocoToken.networks[3].address;
const abi = ChocoToken.abi;

const contr = new Contract(contractAddress, abi, wallet);
var index = 0;

function createAndFund(){
    let randomWallet = ethers.Wallet.createRandom();
    let obj= {};
    obj.address = randomWallet.address;
    console.log("Wallet created");
    contr.transfer(obj.address, 225000)
        .then(res => res.wait()
            .then(res => {
                fund(obj, randomWallet);
            }).catch(err => console.log(err))
        ).catch(err => console.log(err))
};

function fund(obj, randomWallet){
    obj.mnemonic = randomWallet.mnemonic;
    obj.privateKey = randomWallet.privateKey;
    let wal = JSON.stringify(obj);
    let dir = `./magazine/batch_${(Math.floor((index)/10)+1)}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        console.log(`Batch ${dir} created.`);
    }
    try {
        fs.mkdirSync(`${dir}/${index+1}`);
        fs.writeFileSync(`${dir}/${index+1}/wallet_${index+1}.json`, wal, { flag: "wx" }, (err)=>{
            console.log(err);
        });
        let tokenUrl = `https://ropsten.etherscan.io/token/0xe84f02995dab95fe18ebc7d70c6774dbc0b1fc85?a=${obj.address}`
        console.log(tokenUrl);
        let pubkey = qr.image(tokenUrl, { type: 'png' }, size=10);
        pubkey.pipe(fs.createWriteStream(`${dir}/${index+1}/Address.png`));
        let prvkey = qr.image(obj.privateKey, { type: 'png' });
        prvkey.pipe(fs.createWriteStream(`${dir}/${index+1}/prvkey.png`));
        console.log(`File "${index+1}.json" created`);
    } catch(err) {
        console.log("File exists", err);
    }
}

//contr.transfer(objAddress, 1).then(res => res.wait()).then(res => console.log(res));
createAndFund();
