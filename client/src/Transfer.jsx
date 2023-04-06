import { useState } from "react";
import server from "./server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { sha256 } from "@noble/hashes/sha256";


function hashMessage(message) {
  // convert message to bytes for hash algorithm
  const bytes = utf8ToBytes(message);
  // return hashed message
  return sha256(bytes);
}

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    // Create the payload to send to the server
    const payload = {
      transferData: {
          sender: address,
          amount: parseInt(sendAmount),
          recipient
      }
    };

    // Hash the initial payload
    const msgHash = hashMessage(JSON.stringify(payload.transferData));
    console.log('msgHash hex', toHex(msgHash));

    // Sign the payload with the private key
    const signature = secp.signSync(msgHash, privateKey, { recovered: true });

    // Add fields that are not part of the payload hash or signature, for server-side verification
    payload.msgHash = toHex(msgHash);
    payload.signature = toHex(signature[0]);
    payload.recovery = signature[1];
    console.log('updated payload', JSON.stringify(payload));

    try {
      const {
        data: { balance },
      } = await server.post(`send`, payload);
      // console.log('/send response', balance);
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Paste a recipient address"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
