var fs = require('fs');
var pdf = require('html-pdf');
var html = fs.readFileSync('./templates/index.html', 'utf8');
var options = { format: "A4",  type: "pdf", base: "file:\\\C:\\Users\\Choco\\Repos\\wallet-gen\\magazine\\batch_1\\1\\" };
 
pdf.create(html, options).toFile('./1.pdf', function(err, res) {
  if (err) return console.log(err);
  console.log(res);
});
