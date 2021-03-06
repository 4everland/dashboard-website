"use strict";
/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
exports.__esModule = true;
exports.ISigsVerifier__factory = void 0;
var ethers_1 = require("ethers");
var _abi = [
    {
        inputs: [
            {
                internalType: "bytes",
                name: "_msg",
                type: "bytes"
            },
            {
                internalType: "bytes[]",
                name: "_sigs",
                type: "bytes[]"
            },
            {
                internalType: "address[]",
                name: "_signers",
                type: "address[]"
            },
            {
                internalType: "uint256[]",
                name: "_powers",
                type: "uint256[]"
            },
        ],
        name: "verifySigs",
        outputs: [],
        stateMutability: "view",
        type: "function"
    },
];
var ISigsVerifier__factory = /** @class */ (function () {
    function ISigsVerifier__factory() {
    }
    ISigsVerifier__factory.createInterface = function () {
        return new ethers_1.utils.Interface(_abi);
    };
    ISigsVerifier__factory.connect = function (address, signerOrProvider) {
        return new ethers_1.Contract(address, _abi, signerOrProvider);
    };
    ISigsVerifier__factory.abi = _abi;
    return ISigsVerifier__factory;
}());
exports.ISigsVerifier__factory = ISigsVerifier__factory;
