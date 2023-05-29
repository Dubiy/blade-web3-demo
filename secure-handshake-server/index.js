const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const fetch = require("node-fetch");
const {PublicKey, PrivateKey} = require("@hashgraph/sdk");

const config = {
    port: 8443,
    clientHost: "d084-178-137-139-12.ngrok-free.app",
    serverAccountId: "0.0.8281",
    serverPrivateKey: PrivateKey.fromString("3030020100300706052b8104000a042204209c1878c421d7d0c8c460a23db1dad4274b52803ed4bae338eba2c539eb75ca3c")
}

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Auth server'))

app.get('/getPayload', (req, res) => {
    const payload = {
        url: config.clientHost,
        data: {
            token: "fufhr9e84hf9w8fehw9e8fhwo9e8fw938fw3o98fhjw3of"
        }
    }

    const signingData = sendAuth(payload);
    res.send({
        signingData,
        payload
    })
});

app.post('/getAuth', async (req, res) => {
    const {originalPayload, serverSignature, userSignature} = req.body
    const authMessage = await receiveAuth(originalPayload, serverSignature, userSignature)
    res.send({authMessage})
})

app.listen(config.port, () => {
    console.log('Running on port:', config.port);
})

const sendAuth = (payload) => {
    const bytes = new Uint8Array(Buffer.from(JSON.stringify(payload)))
    const signature = Buffer.from(config.serverPrivateKey.sign(bytes)).toString('hex')

    return {
        serverSignature: signature,
        serverSigningAccount: config.serverAccountId
    }
}

const receiveAuth = async (originalPayload, serverSignature, userSignature) => {
    const publicKey = config.serverPrivateKey.publicKey
    const url = "https://testnet.mirrornode.hedera.com/api/v1/accounts/" + userSignature.accountId
    const accountInfoResponse = await fetch(url, {method: "GET"})

    if (accountInfoResponse.ok) {
        let data = await accountInfoResponse.json();

        let serverSigBuffer = Buffer.from(serverSignature.signature, 'hex');
        let userSigBuffer = Buffer.from(userSignature.signature, 'hex');

        const signedPayload = {
            serverSignature: serverSignature.signature,
            originalPayload
        }

        let serverKeyVerified = verifyData(originalPayload, publicKey.toString(), serverSigBuffer)
        let userKeyVerified = verifyData(signedPayload, data.key.key, userSigBuffer)

        if (serverKeyVerified && userKeyVerified) {
            return "Successfully authenticated"
        }
    }
    return "Auth failed"
}

const verifyData = (data, publicKey, signature) => {
    const pubKey = PublicKey.fromString(publicKey);
    const bytes = Buffer.from(JSON.stringify(data));
    return pubKey.verify(bytes, signature);
}