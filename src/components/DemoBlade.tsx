import React, {Component} from "react";
import Button from 'react-bootstrap/Button';

// import {BladeSDK} from '@bladelabs/blade-sdk.js';
import {Container, Jumbotron} from "react-bootstrap";

interface Props {

}

interface State {
    tokenId: string | null
}

export default class DemoBlade extends Component<Props, State> {


    constructor(props: Props) {
        super(props);
        this.state = {
            tokenId: null
        };

        this.initBlade = this.initBlade.bind(this);
    }

    async componentDidMount() {
        await this.initBlade();
    }

    async initBlade () {
        console.log('init blade');

        // const bladeSDK: BladeSDK = new BladeSDK();
        // const res = await bladeSDK.init("apikey", "testnet", "dappcode", "fingerprint", "dd");
        //
        // const res1 = await bladeSDK.createAccount();
        //
        //
        // const balance = await bladeSDK.getBalance("0.0.8235");
        // balance.
        // this.bladeSDK = new BladeSDK();

        // this.bladeSigner = new BladeSigner();

    }


    render() {
        return (
            <Container className="p-3">
                <Jumbotron>
                    <Button onClick={this.initBlade} style={{float:'right'}}>Run BladeSDK</Button>
                </Jumbotron>

            </Container>
        );
    }
}
