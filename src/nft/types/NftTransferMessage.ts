import {Address, Builder, Cell, Slice} from "@ton/core";
import {NFT_TRANSFER_OPCODE} from "../opcodes";

export type NftTransferMessage = {
    queryId: bigint;
    newOwner: Address;
    responseDestination: Address | null;
    customPayload: Cell | null;
    forwardAmount: bigint;
    forwardPayload: Cell | null;
};

export function storeNftTransferMessage(message: NftTransferMessage): (builder: Builder) => void {
    return (builder) => {
        const {queryId, newOwner, responseDestination, customPayload, forwardAmount, forwardPayload} = message;
        builder.storeUint(NFT_TRANSFER_OPCODE, 32)
            .storeUint(queryId, 64)
            .storeAddress(newOwner)
            .storeAddress(responseDestination ?? null)
            .storeMaybeRef(customPayload ?? null)
            .storeCoins(forwardAmount)
            .storeMaybeRef(forwardPayload ?? null);
    };
}

export function loadNftTransferMessage(slice: Slice): NftTransferMessage {
    if (slice.loadUint(32) !== NFT_TRANSFER_OPCODE) {
        throw new Error('Wrong opcode');
    }
    const queryId = slice.loadUintBig(64);
    const newOwner = slice.loadAddress();
    const responseDestination = slice.loadMaybeAddress();
    const customPayload = slice.loadMaybeRef();
    const forwardAmount = slice.loadCoins();
    const forwardPayload = slice.loadMaybeRef();
    return {
        queryId,
        newOwner,
        responseDestination,
        customPayload,
        forwardAmount,
        forwardPayload,
    };
}
