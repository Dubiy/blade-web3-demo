import React, {Component} from "react";
import Button from 'react-bootstrap/Button';

import {BladeSigner, HederaNetwork} from '@bladelabs/blade-web3.js';
import {
    AccountId,
    Client,
    Hbar,
    PrivateKey,
    TokenCreateTransaction,
    AccountInfo,
    PublicKey,
    TransactionReceipt, TransactionResponse, TokenUpdateTransaction, TokenDeleteTransaction, TokenDissociateTransaction
} from "@hashgraph/sdk";
import {Container, Jumbotron} from "react-bootstrap";

interface Props {

}

interface State {
    accountId: AccountId | null
    tokenId: string | null
}

export default class JakeHall extends Component<Props, State> {
    bladeSigner: BladeSigner | null = null;
    client = Client.forTestnet();
    pub8280 = "302a300506032b65700321001d02314191443a9da47553542281d2728e6c6a65aa222251a4cfb315e7e30b08";
    pub8281 = "302a300506032b6570032100b509ec14c689bed1f0096e5d964143a453cf8f166c41a2364a843f6cb07075dd";
    // bladeSDK: BladeSDK = new BladeSDK();


    constructor(props: Props) {
        super(props);
        this.state = {
            accountId: null,
            tokenId: null
        };

        this.initBlade = this.initBlade.bind(this);
        this.createToken = this.createToken.bind(this);
        this.updateToken = this.updateToken.bind(this);
        this.deleteToken = this.deleteToken.bind(this);
    }

    async componentDidMount() {
        await this.initBlade();
    }

    async initBlade () {
        this.bladeSigner = new BladeSigner();

        const params = {
            network: HederaNetwork.Testnet,
            // dAppCode - optional while testing, request specific one by contacting us.
            dAppCode: "yourAwesomeApp"
        }

        // create session with optional parameters.
        await this.bladeSigner.createSession(params);

        // bladeSigner object can now be used.
        const accountId = this.bladeSigner.getAccountId();

        this.setState({ accountId: accountId })

        console.log({accountId});

//
//
//         let payload = {
//             url: window.location.hostname,
//             data: {
//                 token: "fufhr9e84hf9w8fehw9e8fhwo9e8fw938fw3o98fhjw3of"
//             }
//         };
//         const {signingData} = await fetch('http://localhost:8443/sendAuth').then(res => res.json());
// // {"signingData":{"serverSignature":"51c55348003676a1a753d5f10c31a42f16430784053a08e6368f79e666a7d6f053014e8e33f0fca808941f3c2be5975597815ab48d22868196e43fc443affcb9","serverSigningAccount":"0.0.8281"}}
//         const handshakeResult = await this.bladeSigner.handshake(
//             signingData.serverSigningAccount,
//             signingData.serverSignature,
//             payload
//         )
//         const body = JSON.stringify(handshakeResult);
// // {"signingAccount":"0.0.8235","auth":{"signedPayload":{"serverSignature":"51c55348003676a1a753d5f10c31a42f16430784053a08e6368f79e666a7d6f053014e8e33f0fca808941f3c2be5975597815ab48d22868196e43fc443affcb9","originalPayload":{"url":"b344-178-137-139-12.ngrok-free.app","data":{"token":"fufhr9e84hf9w8fehw9e8fhwo9e8fw938fw3o98fhjw3of"}}},"userSignature":"fda3cee1956caa0b76e17bcd28f7a69161c55b0baa02f8abf6fb83baf9a3c51b4dd4f5978093073bc5b8ed1289661b4ca8b34081364827efab4d79e684955e1d"}}
//         const { authMessage } = await fetch('http://localhost:8443/getAuth', {
//             method: 'POST',
//             mode: 'cors',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body
//         }).then(res => res.json())
// // {"authMessage":"Successfully authenticated"}
//         console.log("authMessage:", authMessage)
    }


    render() {
        return (
            <Container className="p-3">
                <Jumbotron>
                    <>accountId: {this.state.accountId?.toString()}</>
                    <Button onClick={this.initBlade} style={{float:'right'}}>Blade connect</Button>
                </Jumbotron>

                <div>
                    <Button onClick={this.createToken}>Create Token</Button>
                    <br/>
                    {this.state.tokenId ? <div>Token ID: {this.state.tokenId}</div> : null}
                </div>
                <div>
                    <Button onClick={this.updateToken}>Update Token</Button>
                </div>
                <div>
                    <Button onClick={this.deleteToken}>Delete Token</Button>
                </div>

            </Container>
        );
    }

    async createToken() {
        try {
            const accountInfo: AccountInfo | undefined = await this.bladeSigner?.getAccountInfo();
            const publicKeyString = accountInfo?.key.toString();
            const publicKey = PublicKey.fromString(publicKeyString!);

            const transaction = await new TokenCreateTransaction()
                .setTokenName("JH Test Token")
                .setTokenSymbol("JHT")
                .setTreasuryAccountId(accountInfo!.accountId)
                .setInitialSupply(1000000000)
                .setAdminKey(publicKey)
                .setKycKey(PublicKey.fromString(this.pub8280))
                .setMaxTransactionFee(new Hbar(30)) //Change the default max transaction fee
                // .freezeWith(client);
                ;

            const txResponse: TransactionResponse | undefined = await this.bladeSigner?.call(transaction);

            //Get the receipt of the transaction
            const receipt = await txResponse!.getReceipt(this.client);

            //Get the token ID from the receipt
            // return  receipt.tokenId.toString();

            if (receipt.tokenId) {
                this.setState({ tokenId: receipt.tokenId.toString() })
            }

            console.log(`${receipt.tokenId}`);
        } catch (e) {
            alert(e);
        }
    }

    async updateToken() {
        try {


            const transaction = await new TokenUpdateTransaction()
                    .setTokenName("JH Test Token UPD")
                    .setTokenSymbol("JHT UPD")
                    .setTokenId(this.state.tokenId!)
                .setKycKey(PublicKey.fromString(this.pub8281))

            const receipt: TransactionResponse | undefined = await this.bladeSigner?.call(transaction);
            console.log(receipt);
        } catch (e) {
            alert(e);
        }
    }

    async deleteToken() {
        try {

            const transactionDelete = await new TokenDeleteTransaction()
                .setTokenId(this.state.tokenId!)
            ;
            await this.bladeSigner?.call(transactionDelete);

            const transactionDissociate = await new TokenDissociateTransaction()
                .setAccountId(this.state.accountId!)
                .setTokenIds([this.state.tokenId!])
            ;
            await this.bladeSigner?.call(transactionDissociate);

            this.setState({ tokenId: null });
        } catch (e) {
            alert(e);
        }
    }

}
