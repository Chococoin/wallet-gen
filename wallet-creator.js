const { ethers } = require('ethers');
const db = require('./database.json');
const fs = require('fs');
const qr = require('qr-image');

var index = 0;

while(index < 100){
    let randomWallet = ethers.Wallet.createRandom();
    let obj= {};
    obj.address = randomWallet.address;
    obj.mnemonic = randomWallet.mnemonic;
    obj.privateKay = randomWallet.privateKey;
    let wal = JSON.stringify(obj);
    let dir = `./magazine/batch_${(Math.floor((index)/10)+1)}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        console.log(`Batch ${dir} created.`);
    }
    try {
        fs.writeFileSync(`${dir}/wallet_${index+1}.json`, wal, { flag: "wx" }, (err)=>{
            console.log(err);
        });
        console.log(`File "${index+1}.json" created`);
    } catch(err) {
        console.log("File exists");
    }
    index++
}  
