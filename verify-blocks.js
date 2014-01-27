var blockSize = 1024,
    path = "Dir/File.mp4", // Full path to input file here
    fs = require("fs"), fd,
    crypto = require("crypto"), hash,
    shasum,
    stats, blockNum, lastBlockSize,
    lastBuffer, bytesRead, offset, position;

console.log("\nCalculate hash of a large video file");
console.log("====================================");
console.log("Input file: " + path);

// Determine the file size, number of blocks and size of last block
stats = fs.statSync(path);
console.log("File size: " + stats.size + " bytes");
blockNum = Math.floor(stats.size / blockSize);
lastBlockSize = stats.size % blockSize;
console.log(blockNum + " blocks of " + blockSize + " bytes, and last block of " + lastBlockSize + " bytes");

// Open the file
fd = fs.openSync(path, "r");

// Read the last block, which may be smaller than the blockSize
lastBuffer = new Buffer(lastBlockSize);
offset = 0; // offset in the buffer to start writing at
position = blockNum * blockSize; // where to begin reading in the file

bytesRead = fs.readSync(fd, lastBuffer, offset, lastBlockSize, position);
if (bytesRead != lastBlockSize) {
    console.log("Error reading block " + blockNum + ". Read " + bytesRead + " bytes instead of " + lastBlockSize + " bytes.");
}

shasum = crypto.createHash("sha256");
shasum.update(lastBuffer, 'binary');
hash = shasum.digest('hex');

// Read backwards to the beginning of the file
var buffer = new Buffer(blockSize);
while (blockNum > 0) {
    blockNum--;
    position = blockNum * blockSize;
    bytesRead = fs.readSync(fd, buffer, offset, blockSize, position);
    if (bytesRead != blockSize) {
        console.log("Error reading block " + blockNum + ". Read " + bytesRead + " bytes instead of " + blockSize + " bytes.");
    }
    shasum = crypto.createHash("sha256");
    shasum.update(buffer, 'binary');
    shasum.update(hash, 'hex');
    hash = shasum.digest('hex');
}
console.log("h0: " + hash);


