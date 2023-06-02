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
    accountId: AccountId | string | null
    tokenId: string | null
}

export default class Demo extends Component<Props, State> {
    bladeSigner: BladeSigner | null = null;
    client = Client.forTestnet();

    constructor(props: Props) {
        super(props);
        this.state = {
            accountId: null,
            tokenId: null
        };

        this.initBlade = this.initBlade.bind(this);
        // this.createToken = this.createToken.bind(this);
        // this.updateToken = this.updateToken.bind(this);
        // this.deleteToken = this.deleteToken.bind(this);
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

        // this.setState({ accountId: accountId })

        console.log({accountId});




        // SECURE HANDSHAKE
        //
        // const {signingData, payload} = await fetch('http://localhost:8443/getPayload').then(res => res.json());
        // //signingData == {"serverSignature":"f558951c2715266512eec88d300d52a35976d52261aed4e9f942fb4c06dab4e3860692cc51fd0c5eed46a408d28467615ae15c35287046874766d76f35300b5b","serverSigningAccount":"0.0.8281"}
        // //payload == {"url":"d084-178-137-139-12.ngrok-free.app","data":{"token":"fufhr9e84hf9w8fehw9e8fhwo9e8fw938fw3o98fhjw3of"}}
        // console.log(signingData, payload);
        //
        // const handshakeResult = await this.bladeSigner.handshake(
        //     signingData.serverSigningAccount,
        //     signingData.serverSignature,
        //     payload
        // )
        // // handshakeResult = {"originalPayload":{"url":"d084-178-137-139-12.ngrok-free.app","data":{"token":"fufhr9e84hf9w8fehw9e8fhwo9e8fw938fw3o98fhjw3of"}},"serverSignature":{"publicKey":"0275ef107b354472a43421d777ba8c7c079e399c17eef1ce2523a1bf52fcb50bbe","signature":"f558951c2715266512eec88d300d52a35976d52261aed4e9f942fb4c06dab4e3860692cc51fd0c5eed46a408d28467615ae15c35287046874766d76f35300b5b","accountId":"0.0.8281"},"userSignature":{"publicKey":"0326f941301c363f406b81e67df09f85851cc17a379af8a2e8a6c22fb84f71bc2d","signature":"8576bf9f6e3b7d45499d9be4f2afbb922b0d04af8b07b42fac5ef26a593fd5fbde7d2194f810266d28c9c2fc8830039aa9a0bc504e3034193a7c3ef7589fe33b","accountId":"0.0.8299"}}
        //
        // const { authMessage } = await fetch('http://localhost:8443/getAuth', {
        //     method: 'POST',
        //     mode: 'cors',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify(handshakeResult)
        // }).then(res => res.json());
        //
        // // {"authMessage":"Successfully authenticated"}
        // console.log("authMessage:", authMessage)
    }


    render() {
        return (
            <Container className="p-3">
                <Jumbotron>
                    <>accountId: {this.state.accountId?.toString()}</>
                    <Button onClick={this.initBlade} style={{float:'right'}}>Blade connect</Button>
                </Jumbotron>

                {/*<div>*/}
                {/*    <Button onClick={this.createToken}>Create Token</Button>*/}
                {/*    <br/>*/}
                {/*    {this.state.tokenId ? <div>Token ID: {this.state.tokenId}</div> : null}*/}
                {/*</div>*/}
                {/*<div>*/}
                {/*    <Button onClick={this.updateToken}>Update Token</Button>*/}
                {/*</div>*/}
                {/*<div>*/}
                {/*    <Button onClick={this.deleteToken}>Delete Token</Button>*/}
                {/*</div>*/}

            </Container>
        );
    }

    // async createToken() {
    //     try {
    //         const accountInfo: AccountInfo | undefined = await this.bladeSigner?.getAccountInfo();
    //         const publicKeyString = accountInfo?.key.toString();
    //         const publicKey = PublicKey.fromString(publicKeyString!);
    //
    //         const transaction = await new TokenCreateTransaction()
    //             .setTokenName("JH Test Token")
    //             .setTokenSymbol("JHT")
    //             .setTreasuryAccountId(accountInfo!.accountId)
    //             .setInitialSupply(1000000000)
    //             .setAdminKey(publicKey)
    //             .setKycKey(PublicKey.fromString(this.pub8280))
    //             .setMaxTransactionFee(new Hbar(30)) //Change the default max transaction fee
    //             // .freezeWith(client);
    //             ;
    //
    //         const txResponse: TransactionResponse | undefined = await this.bladeSigner?.call(transaction);
    //
    //         //Get the receipt of the transaction
    //         const receipt = await txResponse!.getReceipt(this.client);
    //
    //         //Get the token ID from the receipt
    //         // return  receipt.tokenId.toString();
    //
    //         if (receipt.tokenId) {
    //             this.setState({ tokenId: receipt.tokenId.toString() })
    //         }
    //
    //         console.log(`${receipt.tokenId}`);
    //     } catch (e) {
    //         alert(e);
    //     }
    // }
    //
    // async updateToken() {
    //     try {
    //
    //
    //         const transaction = await new TokenUpdateTransaction()
    //                 .setTokenName("JH Test Token UPD")
    //                 .setTokenSymbol("JHT UPD")
    //                 .setTokenId(this.state.tokenId!)
    //             .setKycKey(PublicKey.fromString(this.pub8281))
    //
    //         const receipt: TransactionResponse | undefined = await this.bladeSigner?.call(transaction);
    //         console.log(receipt);
    //     } catch (e) {
    //         alert(e);
    //     }
    // }
    //
    // async deleteToken() {
    //     try {
    //
    //         const transactionDelete = await new TokenDeleteTransaction()
    //             .setTokenId(this.state.tokenId!)
    //         ;
    //         await this.bladeSigner?.call(transactionDelete);
    //
    //         const transactionDissociate = await new TokenDissociateTransaction()
    //             .setAccountId(this.state.accountId!)
    //             .setTokenIds([this.state.tokenId!])
    //         ;
    //         await this.bladeSigner?.call(transactionDissociate);
    //
    //         this.setState({ tokenId: null });
    //     } catch (e) {
    //         alert(e);
    //     }
    // }

}
