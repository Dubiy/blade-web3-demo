import {Component} from "react";
import Button from 'react-bootstrap/Button';

import {BladeSigner, HederaNetwork} from '@bladelabs/blade-web3.js';
import {AccountId} from "@hashgraph/sdk";

interface Props {

}

interface State {
    accountId: AccountId | null
}

export default class WalletConnector extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            accountId: null
        };

        this.initBlade = this.initBlade.bind(this);
    }


    async initBlade () {
        const bladeSigner = new BladeSigner();

        const params = {
            network: HederaNetwork.Testnet,
            // dAppCode - optional while testing, request specific one by contacting us.
            dAppCode: "yourAwesomeApp"
        }

        // create session with optional parameters.
        await bladeSigner.createSession(params);

        // bladeSigner object can now be used.
        const accountId = bladeSigner.getAccountId();

        this.setState({ accountId: accountId })

        console.log({accountId});
    }


    render() {
        return (
            <>
                <>accountId: {this.state.accountId?.toString()}</>
                <Button onClick={this.initBlade} style={{float:'right'}}>Blade connect</Button>
            </>
        );
    }
}
