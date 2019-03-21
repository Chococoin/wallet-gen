const { ethers } = require('ethers');
const db = require('./database.json');
const fs = require('fs');
const qr = require('qr-image');

const provider = new ethers.providers.InfuraProvider( "ropsten", "35964334d3734699b301f626b8a47605" );
const prv = "20A476C46329458B1CA90EE074D86B0206B16C6541A9103558AD9B3ABC49207E";
const wallet = new ethers.Wallet(prv, provider);

var index = 0;

while(index < 0){
    let randomWallet = ethers.Wallet.createRandom();
    let obj= {};
    obj.address = randomWallet.address;
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
        let pubkey = qr.image(obj.address, { type: 'png' }, size=10);
        pubkey.pipe(fs.createWriteStream(`${dir}/${index+1}/Address.png`));
        let prvkey = qr.image(obj.privateKey, { type: 'png' });
        prvkey.pipe(fs.createWriteStream(`${dir}/${index+1}/prvkey.png`));
        console.log(`File "${index+1}.json" created`);
    } catch(err) {
        console.log("File exists", err);
    }
    index++;
}  

console.log(wallet.address);
provider.getBalance(wallet.address).then(res => {console.log(res)}
);
