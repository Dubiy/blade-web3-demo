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
