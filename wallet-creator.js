const { ethers, Contract } = require('ethers');
const db = require('./database.json');
const fs = require('fs');
const qr = require('qr-image');
const ChocoToken = require('./contract/ChocoToken.json');
var pdf = require('html-pdf');
var html = fs.readFileSync('./templates/index.html', 'utf8');
var Q = require('q');
var options = { format: "A4",  type: "pdf", base: "file:\\\C:\\Users\\Choco\\Repos\\wallet-gen\\magazine\\batch_1\\1\\" };
 
const provider = new ethers.providers.InfuraProvider( "ropsten", "35964334d3734699b301f626b8a47605" );
const prv = "488954449c0b5ef75c247882f2c103110e2962e7883ee40d617cc5608dde3c61";
const wallet = new ethers.Wallet(prv, provider);

const contractAddress = ChocoToken.networks[3].address;
const abi = ChocoToken.abi;

const contr = new Contract(contractAddress, abi, wallet);
var index = 0;


function createAndFund(){
    var randomWallet = ethers.Wallet.createRandom();
    var obj= {};
    obj.address = randomWallet.address;
    console.log("Wallet created");
    Q.all(transfer(obj, randomWallet));
};

function fund(obj, randomWallet){
    obj.mnemonic = randomWallet.mnemonic;
    obj.privateKey = randomWallet.privateKey;
    let wal = JSON.stringify(obj);
    let dir = `./magazine/batch_${(Math.floor((index)/10)+1)}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
        console.log(`Batch ${dir} created.`);
    } else {
        console.log(`Batch ${dir} not created.`)
    }
    try {
        fs.mkdirSync(`${dir}/${index+1}`);
        fs.writeFileSync(`${dir}/${index+1}/wallet_${index+1}.json`, wal, { flag: "wx" }, (err)=>{
            console.log(err);
        });
        let tokenUrl = `https://ropsten.etherscan.io/token/0xe84f02995dab95fe18ebc7d70c6774dbc0b1fc85?a=${obj.address}`
        let pubkey = qr.image(tokenUrl, { type: 'png' }, size=10);
        pubkey.pipe(fs.createWriteStream(`${dir}/${index+1}/Address.png`));
        pubkey.pipe(fs.createWriteStream('./magazine/cache/Address.png'));
        let prvkey = qr.image(obj.privateKey, { type: 'png' });
        prvkey.pipe(fs.createWriteStream(`${dir}/${index+1}/prvkey.png`));
        prvkey.pipe(fs.createWriteStream('./magazine/cache/prvkey.png'));
        console.log(`File "${index+1}.json" created`);
        index++;
        if( index > 10) clearInterval(run);
    } catch(err) {
        console.log("File exists", err);
    }
    //print(dir, obj)
}

function transfer(obj, randomWallet){
    contr.transfer(obj.address, 225000)
        .then(res => res.wait()
        .then(res => {
            fund(obj, randomWallet);
                }).catch(err => console.log(err))
            ).catch(err => console.log(err));
    console.log(index);
}

function print(dir, obj){
    pdf.create(html, options).toFile(`${dir}/${index+1}/${obj.address}.pdf`, function(err, res) {
        if (err) return console.log(err);
        console.log(res);
    });
}


//contr.transfer(objAddress, 1).then(res => res.wait()).then(res => console.log(res));
//var run = setInterval(createAndFund, 15000);

while(index < 10) {
    createAndFund();
}
