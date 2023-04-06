const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { sha256 } = require("@noble/hashes/sha256");

function getAddress(publicKey) {
    const pubKeyWithoutFormatByte = publicKey.slice(1);
    const hashPubKey = keccak256(pubKeyWithoutFormatByte);
    return hashPubKey.slice(-20);
}

function hashMessage(message) {
    // convert message to bytes for hash algorithm
    const bytes = utf8ToBytes(message);
    // return hashed message
    return sha256(bytes);
}

const privateKey = secp.utils.randomPrivateKey();
console.log('private key', toHex(privateKey));

const publicKey = secp.getPublicKey(privateKey);
const sender = toHex(getAddress(publicKey));
console.log('wallet addr from private key', sender);

// Create a hash of the payload
const payload = {
    transferData: {
        sender,
        amount: 10,
        recipient: 'xyz'
    }
};
const msgHash = hashMessage(JSON.stringify(payload.transferData));
console.log('msgHash hex', toHex(msgHash));

// Sign the payload with the private key
const signature = secp.signSync(msgHash, privateKey, { recovered: true });

// const isValid = secp.verify(signature, msgHash, publicKey);
// console.log('signature valid:', isValid);

// Add fields that are not part of the payload hash or signature, for server-side verification
payload.msgHash = toHex(msgHash);
payload.signature = toHex(signature[0]);
payload.recovery = signature[1];
console.log('updated payload', JSON.stringify(payload));

// SERVER receiving the payload
const recoveredPubkey = secp.recoverPublicKey(payload.msgHash, payload.signature, payload.recovery);
const recoveredSenderAddress = toHex(getAddress(recoveredPubkey));
console.log('Sender wallet addr from recovered public key', recoveredSenderAddress);

// Hash the message
const msgHashServer = toHex(hashMessage(JSON.stringify(payload.transferData)));
const isMsgHashValid = (msgHashServer === payload.msgHash);
const isSenderWalletAddressValid = (recoveredSenderAddress === payload.transferData.sender);
console.log(`Server side verification: isMsgHashValid = ${isMsgHashValid}, isSenderWalletAddressValid = ${isSenderWalletAddressValid}`);

