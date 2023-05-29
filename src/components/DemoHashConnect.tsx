import React, {Component} from "react";
import Button from 'react-bootstrap/Button';

// import {BladeSDK} from '@bladelabs/blade-sdk.js';
import {HashConnect, HashConnectTypes} from "hashconnect";
import {Container, Jumbotron} from "react-bootstrap";

interface Props {

}

interface State {
    tokenId: string | null
}

export default class DemoHashConnect extends Component<Props, State> {
    hashconnect: HashConnect;
    initData?: HashConnectTypes.InitilizationData;

    constructor(props: Props) {
        super(props);
        this.hashconnect = new HashConnect();
        this.state = {
            tokenId: null
        };

        this.auth = this.auth.bind(this);
    }

    async componentDidMount() {
        let appMetadata: HashConnectTypes.AppMetadata = {
            name: "dApp Example Gary Du",
            description: "An example hedera dApp",
            icon: "https://absolute.url/to/icon.png",
            url: "https://df8d-178-137-139-12.ngrok-free.app",
        };
        this.initData = await this.hashconnect.init(appMetadata, "testnet", false);
        console.log('initData', this.initData);
    }

    async auth () {


        // const bladeSDK: BladeSDK = new BladeSDK();
        // console.log('init blade', await bladeSDK.init("apikey", "testnet", "dappcode", "fingerprint", ""));
        //
        // const balance = await bladeSDK.getBalance("0.0.8235");
        // console.log('balance', balance);
        // this.bladeSDK = new BladeSDK();


        // authenticate(topic: string, account_id: string, server_signing_account: string, serverSignature: Uint8Array, payload: {
        //     url: string;
        //     data: any;
        // }): Promise<MessageTypes.AuthenticationResponse>;

        // topic: string;
        // pairingString: string;
        // encryptionKey: string;
        // savedPairings: SavedPairingData[];

        const localAccountId = "0.0.8235";
        const serverAccountId = "0.0.1001";
        const serverSignature = new Uint8Array(0);
        const payload = {
            url: "https://df8d-178-137-139-12.ngrok-free.app",
            data: {}
        }

        console.log('do auth', this.initData);

        const authRes = await this.hashconnect.authenticate(
            this.initData!.topic,
            localAccountId,
            serverAccountId,
            serverSignature,
            payload
        )

        console.log('authRes', authRes);

        // this.bladeSigner = new BladeSigner();

    };


    render() {
        return (
            <Container className="p-3">
                <Jumbotron>
                    <Button onClick={this.auth} style={{float:'right'}}>auth HC</Button>
                </Jumbotron>

            </Container>
        );
    }
}
