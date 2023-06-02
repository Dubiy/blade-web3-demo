import React, {Component} from "react";
// @ts-ignore
import DcentWebConnector from "dcent-web-connector";
import {
    HardwareAccount,
    InitResponse,
    DCentAccountInfoResult,
    DCentAccountInfo,
    DCentSignResult
} from "../models/DCent";
import {AccountUpdateTransaction, Client, Mnemonic, PrivateKey, PublicKey, Transaction} from "@hashgraph/sdk";
import {Buffer} from "buffer";

interface Props {}
interface State {}

const dCentAccount = "0.0.2879103"
const dCentPublicKey = PublicKey.fromString("97975b50ccc575261673b2a3c0559fe92112a285fc497492e9dc9aa8eff0bd98") // ed25519
const softPublicKey = PublicKey.fromString("302a300506032b65700321006.......ad7ee5f314f5f6b38fcadb052d0b8") // ed25519
const softPrivateKey = PrivateKey.fromString("302e020100300506032b65700........6562ee08b5f2369f2680e4") // ed25519
//
const softPublicKeyECDSA = PublicKey.fromString("302d300706052b8104000a03220.........c6a0b3509e01") // ecdsa
const softPrivateKeyECDSA = PrivateKey.fromString("3030020100300706052b8104000......1bcb9cb") // ecdsa


export default class DemoDCent extends Component<Props, State> {
    private connectedDevice: InitResponse | null = null;
    private account?: HardwareAccount;
    constructor(props: Props) {
        super(props);
    }

    async componentDidMount() {
        await this.init();

        await this.updateAccountDCentToSoft();
        // await this.updateAccountSoftToDCent();
        // await this.updateAccountSoftED25519toECDSA();
        // await this.updateAccountSoftECDSAtoED25519();
    }

    async updateAccountSoftToDCent() {
        const accounts = await this.getAccounts();
        this.account = accounts[0];


        const client = Client.forMainnet();
        client.setMaxNodesPerTransaction(1);
        client.setOperatorWith(dCentAccount, dCentPublicKey, async (buf) => {
            const signaturePromise: Promise<string> = new Promise((resolve, reject) => {
                resolve(this.signTransaction(Buffer.from(buf).toString("hex"), this.account!))
            });
            const signature = await signaturePromise;
            return Buffer.from(signature, "hex");
        });

        const tx = new AccountUpdateTransaction()
            .setAccountId(dCentAccount)
            .setKey(dCentPublicKey)
            .setAccountMemo("upd keys to dcent")
        ;

        await tx.signWithOperator(client);
        await tx.sign(softPrivateKey);
        const result = await tx.execute(client);
        console.log(await result.getReceipt(client));
    }

    async updateAccountDCentToSoft() {
        const accounts = await this.getAccounts();
        this.account = accounts[0];

        // console.log(dCentPublicKey);
        // //
        const client = Client.forMainnet();
        client.setMaxNodesPerTransaction(1);
        client.setOperatorWith(dCentAccount, dCentPublicKey, async (buf) => {
            const signaturePromise: Promise<string> = new Promise((resolve, reject) => {
                resolve(this.signTransaction(Buffer.from(buf).toString("hex"), this.account!))
            });
            const signature = await signaturePromise;
            return Buffer.from(signature, "hex");
        });

        const tx = new AccountUpdateTransaction()
            .setAccountId(dCentAccount)
            .setKey(softPublicKey)
            .setAccountMemo("upd keys")
        ;

        await tx.signWithOperator(client);
        await tx.sign(softPrivateKey);
        const result = await tx.execute(client);
        console.log(await result.getReceipt(client));
    }

    async updateAccountSoftED25519toECDSA() {
        const client = Client.forMainnet();
        client.setOperator(dCentAccount, softPrivateKey)
        client.setMaxNodesPerTransaction(1);

        const tx = new AccountUpdateTransaction()
            .setAccountId(dCentAccount)
            .setKey(softPublicKeyECDSA)
            .setAccountMemo("upd keys to ecdsa")
        ;

        tx.freezeWith(client);
        // await tx.sign(softPrivateKey);
        await tx.sign(softPrivateKeyECDSA);

        const result = await tx.execute(client);
        console.log(await result.getReceipt(client));
    }

    async updateAccountSoftECDSAtoED25519() {
        const client = Client.forMainnet();
        client.setOperator(dCentAccount, softPrivateKey)
        client.setMaxNodesPerTransaction(1);

        const tx = new AccountUpdateTransaction()
            .setAccountId(dCentAccount)
            .setKey(softPublicKey)
            .setAccountMemo("upd ecdsa to ed25519")
        ;

        tx.freezeWith(client);
        // await tx.sign(softPrivateKey);
        await tx.sign(softPrivateKeyECDSA);

        const result = await tx.execute(client);
        console.log(await result.getReceipt(client));
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

    async signTransaction(txHex: string, account: HardwareAccount): Promise<string> {
        let tokenSymbol = "HBAR";
        let decimals = 8;

        const transactionJson = {
            unsignedTx: txHex,
            path: account.path || "m/44'/3030'/0'",
            symbol: tokenSymbol,
            decimals: decimals
        };

        let result: DCentSignResult;
        try {
            result = await DcentWebConnector.getHederaSignedTransaction(transactionJson);
        } catch (e) {
            throw (e as DCentSignResult)?.body?.error?.message;
        }

        if (result.body.error) {
            throw result.body.error?.message;
        }
        return result.body.parameter?.signed_tx?.replace("0x", "") || "";
    }

    render() {
        return (
            <div>DCent</div>
        );
    }
}
