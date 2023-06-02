export type DCentResult = {
    header: {
        version: string,
        request_from: string,
        status: string,
    },
    body: {
        command: string,
        parameter?: any,
        error?: {
            code: string,
            message: string
        }
    }
}


export type InitResponse = DCentResult & {
    body: {
        command: string,
        parameter: {
            version: string,
            isUsbAttached: "true" | "false"
        }
    }
}

export type DCentAccountInfoResult = DCentResult & {
    body: {
        parameter: {
            account: DCentAccountInfo[]
        }
    }
}

export type DCentSignResult = DCentResult & {
    body: {
        parameter: {
            signed_tx: string,
            pubkey: string
        }
    }
}

export type DCentAccountInfo = {
    coin_group: string,
    coin_name: string,
    label: string,
    address_path: string
}

export interface HardwareAccount {
    label?: string;
    path?: string;
    publicKey?: string;
}