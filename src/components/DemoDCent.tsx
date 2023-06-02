import React, {Component} from "react";
// @ts-ignore
import DcentWebConnector from "dcent-web-connector";
import {HardwareAccount, InitResponse, DCentAccountInfoResult, DCentAccountInfo} from "../models/DCent";

interface Props {}
interface State {}

export default class DemoDCent extends Component<Props, State> {
    private connectedDevice: InitResponse | null = null;

    constructor(props: Props) {
        super(props);
    }

    async componentDidMount() {
        await this.init();

        console.log(await this.getAccounts());

        // console.log(await this.dCentFlow());
    }


    async init() {
        try {
            this.connectedDevice = await DcentWebConnector.getDeviceInfo();
        } catch (e){
            this.connectedDevice = null;
        }
    }

    async getAccounts(): Promise<HardwareAccount[]> {
        let result: HardwareAccount[] = [];
        try {
            const accountInfo: DCentAccountInfoResult = await DcentWebConnector.getAccountInfo();

            result = accountInfo.body.parameter.account
                // .filter((account: DCentAccountInfo) => account.coin_group === DcentWebConnector.coinGroup.HEDERA_TESTNET)
                .filter((account: DCentAccountInfo) => account.coin_group === DcentWebConnector.coinGroup.HEDERA)
                .map((account: DCentAccountInfo) => {
                    return {
                        label: account.label,
                        path: account.address_path
                    };
                });
        } catch (e) {
            console.log(e);
        }
        return result;
    }


    async dCentFlow() {
        let result
        try {
            result = await DcentWebConnector.info()
            // If you want to close the popup window.
            DcentWebConnector.popupWindowClose()
        } catch(e) {
            result = e
            console.log(e)
        }
        return result;
    }


    render() {
        return (
            <div>DCent</div>
        );
    }
}
