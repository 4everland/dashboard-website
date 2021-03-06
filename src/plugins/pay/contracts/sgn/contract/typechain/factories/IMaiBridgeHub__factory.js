"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
exports.__esModule = true;
exports.IMaiBridgeHub__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
    {
        inputs: [],
        name: "asset",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address"
            },
        ],
        stateMutability: "view",
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
        name: "swapIn",
        outputs: [],
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
        name: "swapOut",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function"
    },
];
var IMaiBridgeHub__factory = /** @class */ (function () {
    function IMaiBridgeHub__factory() {
    }
    IMaiBridgeHub__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    IMaiBridgeHub__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    IMaiBridgeHub__factory.abi = _abi;
    return IMaiBridgeHub__factory;
}());
exports.IMaiBridgeHub__factory = IMaiBridgeHub__factory;
