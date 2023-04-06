const express = require("express");
const cors = require("cors");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { sha256 } = require("@noble/hashes/sha256");

const app = express();
const port = 3042;
app.use(cors());
app.use(express.json());

const balances = {
  "d4977ab47942b129ce01a9d759fe0dba74aec24d": 100,
  "b033ee21dc616aeadf6c21f66552c273f02e3637": 50,
  "4822b0370aa8f211e7558b9a881f9b19a8cff8ed": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const payload = req.body.transferData;
  console.log('/send request payload', JSON.stringify(req.body));

  // Verify that the client payload was properly signed
  const recoveredPubkey = secp.recoverPublicKey(req.body.msgHash, req.body.signature, req.body.recovery);
  const recoveredSenderAddress = toHex(getAddress(recoveredPubkey));
  console.log('Sender wallet addr from recovered public key', recoveredSenderAddress);

  const msgHashServer = toHex(hashMessage(JSON.stringify(payload)));
  const isMsgHashValid = (msgHashServer === req.body.msgHash);
  const isSenderWalletAddressValid = (recoveredSenderAddress === payload.sender);
  console.log(`Server side verification: isMsgHashValid = ${isMsgHashValid}, isSenderWalletAddressValid = ${isSenderWalletAddressValid}`);

  if(!isMsgHashValid || !isSenderWalletAddressValid) {
    res.status(401).send({ message: 'Invalid message signature' });
    return;
  }

  // Payload signature is valid, proceed with the transfer
  setInitialBalance(payload.sender);
  setInitialBalance(payload.recipient);

  if (balances[payload.sender] < payload.amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[payload.sender] -= payload.amount;
    balances[payload.recipient] += payload.amount;
    res.send({ balance: balances[payload.sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

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

