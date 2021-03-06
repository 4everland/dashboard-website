"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
exports.__esModule = true;
exports.ISwapCanoToken__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        name: "swapBridgeForCanonical",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            },
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        name: "swapCanonicalForBridge",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256"
            },
        ],
        stateMutability: "nonpayable",
        type: "function"
    },
];
var ISwapCanoToken__factory = /** @class */ (function () {
    function ISwapCanoToken__factory() {
    }
    ISwapCanoToken__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    ISwapCanoToken__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    ISwapCanoToken__factory.abi = _abi;
    return ISwapCanoToken__factory;
}());
exports.ISwapCanoToken__factory = ISwapCanoToken__factory;
