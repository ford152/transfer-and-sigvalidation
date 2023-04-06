const secp = require("ethereum-cryptography/secp256k1");
const {
    keccak256
} = require("ethereum-cryptography/keccak");
const {
    toHex
} = require("ethereum-cryptography/utils");
// const {
//     sha256
// } = require("@noble/hashes/sha256");

function getAddress(publicKey) {
    const pubKeyWithoutFormatByte = publicKey.slice(1);
    const hashPubKey = keccak256(pubKeyWithoutFormatByte);
    // const test = sha256(pubKeyWithoutFormatByte);
    // console.log('keccak256', toHex(hashPubKey));
    // console.log('sha256', toHex(test));

    return hashPubKey.slice(-20);
}

const privateKey = secp.utils.randomPrivateKey();
console.log('private key', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);
console.log('wallet addr', toHex(getAddress(publicKey)));