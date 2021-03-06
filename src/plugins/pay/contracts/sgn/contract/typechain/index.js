"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
exports.__esModule = true;
exports.Signers__factory = exports.SGN__factory = exports.Whitelist__factory = exports.VolumeControl__factory = exports.Pauser__factory = exports.Governor__factory = exports.DelayedTransfer__factory = exports.Pool__factory = exports.SwapBridgeToken__factory = exports.ISwapCanoToken__factory = exports.SingleBridgeToken__factory = exports.MultiBridgeToken__factory = exports.MintSwapCanonicalToken__factory = exports.SingleBridgeTokenPermit__factory = exports.MultiBridgeTokenPermit__factory = exports.MintSwapCanonicalTokenPermit__factory = exports.MaiBridgeToken__factory = exports.IMaiBridgeHub__factory = exports.IFraxCanoToken__factory = exports.FraxBridgeToken__factory = exports.PeggedTokenBridge__factory = exports.OriginalTokenVault__factory = exports.MintableERC20__factory = exports.Faucet__factory = exports.MessageSender__factory = exports.MessageReceiver__factory = exports.MessageBus__factory = exports.MsgSenderApp__factory = exports.MsgReceiverApp__factory = exports.MsgBusAddr__factory = exports.IBridge__factory = exports.TransferSwap__factory = exports.ISwapToken__factory = exports.CrossChainSwap__factory = exports.BatchTransfer__factory = exports.IWETH__factory = exports.IUniswapV2__factory = exports.ISigsVerifier__factory = exports.IPeggedToken__factory = exports.Govern__factory = exports.FarmingRewards__factory = exports.Bridge__factory = exports.IERC20__factory = exports.IERC20Metadata__factory = exports.ERC20Burnable__factory = exports.IERC20Permit__factory = exports.ERC20Permit__factory = exports.ERC20__factory = exports.Pausable__factory = exports.Ownable__factory = void 0;
exports.Viewer__factory = exports.TestERC20__factory = exports.DummySwap__factory = exports.StakingReward__factory = exports.Staking__factory = void 0;
var Ownable__factory_1 = require("./factories/Ownable__factory");
__createBinding(exports, Ownable__factory_1, "Ownable__factory");
var Pausable__factory_1 = require("./factories/Pausable__factory");
__createBinding(exports, Pausable__factory_1, "Pausable__factory");
var ERC20__factory_1 = require("./factories/ERC20__factory");
__createBinding(exports, ERC20__factory_1, "ERC20__factory");
var ERC20Permit__factory_1 = require("./factories/ERC20Permit__factory");
__createBinding(exports, ERC20Permit__factory_1, "ERC20Permit__factory");
var IERC20Permit__factory_1 = require("./factories/IERC20Permit__factory");
__createBinding(exports, IERC20Permit__factory_1, "IERC20Permit__factory");
var ERC20Burnable__factory_1 = require("./factories/ERC20Burnable__factory");
__createBinding(exports, ERC20Burnable__factory_1, "ERC20Burnable__factory");
var IERC20Metadata__factory_1 = require("./factories/IERC20Metadata__factory");
__createBinding(exports, IERC20Metadata__factory_1, "IERC20Metadata__factory");
var IERC20__factory_1 = require("./factories/IERC20__factory");
__createBinding(exports, IERC20__factory_1, "IERC20__factory");
var Bridge__factory_1 = require("./factories/Bridge__factory");
__createBinding(exports, Bridge__factory_1, "Bridge__factory");
var FarmingRewards__factory_1 = require("./factories/FarmingRewards__factory");
__createBinding(exports, FarmingRewards__factory_1, "FarmingRewards__factory");
var Govern__factory_1 = require("./factories/Govern__factory");
__createBinding(exports, Govern__factory_1, "Govern__factory");
var IPeggedToken__factory_1 = require("./factories/IPeggedToken__factory");
__createBinding(exports, IPeggedToken__factory_1, "IPeggedToken__factory");
var ISigsVerifier__factory_1 = require("./factories/ISigsVerifier__factory");
__createBinding(exports, ISigsVerifier__factory_1, "ISigsVerifier__factory");
var IUniswapV2__factory_1 = require("./factories/IUniswapV2__factory");
__createBinding(exports, IUniswapV2__factory_1, "IUniswapV2__factory");
var IWETH__factory_1 = require("./factories/IWETH__factory");
__createBinding(exports, IWETH__factory_1, "IWETH__factory");
var BatchTransfer__factory_1 = require("./factories/BatchTransfer__factory");
__createBinding(exports, BatchTransfer__factory_1, "BatchTransfer__factory");
var CrossChainSwap__factory_1 = require("./factories/CrossChainSwap__factory");
__createBinding(exports, CrossChainSwap__factory_1, "CrossChainSwap__factory");
var ISwapToken__factory_1 = require("./factories/ISwapToken__factory");
__createBinding(exports, ISwapToken__factory_1, "ISwapToken__factory");
var TransferSwap__factory_1 = require("./factories/TransferSwap__factory");
__createBinding(exports, TransferSwap__factory_1, "TransferSwap__factory");
var IBridge__factory_1 = require("./factories/IBridge__factory");
__createBinding(exports, IBridge__factory_1, "IBridge__factory");
var MsgBusAddr__factory_1 = require("./factories/MsgBusAddr__factory");
__createBinding(exports, MsgBusAddr__factory_1, "MsgBusAddr__factory");
var MsgReceiverApp__factory_1 = require("./factories/MsgReceiverApp__factory");
__createBinding(exports, MsgReceiverApp__factory_1, "MsgReceiverApp__factory");
var MsgSenderApp__factory_1 = require("./factories/MsgSenderApp__factory");
__createBinding(exports, MsgSenderApp__factory_1, "MsgSenderApp__factory");
var MessageBus__factory_1 = require("./factories/MessageBus__factory");
__createBinding(exports, MessageBus__factory_1, "MessageBus__factory");
var MessageReceiver__factory_1 = require("./factories/MessageReceiver__factory");
__createBinding(exports, MessageReceiver__factory_1, "MessageReceiver__factory");
var MessageSender__factory_1 = require("./factories/MessageSender__factory");
__createBinding(exports, MessageSender__factory_1, "MessageSender__factory");
var Faucet__factory_1 = require("./factories/Faucet__factory");
__createBinding(exports, Faucet__factory_1, "Faucet__factory");
var MintableERC20__factory_1 = require("./factories/MintableERC20__factory");
__createBinding(exports, MintableERC20__factory_1, "MintableERC20__factory");
var OriginalTokenVault__factory_1 = require("./factories/OriginalTokenVault__factory");
__createBinding(exports, OriginalTokenVault__factory_1, "OriginalTokenVault__factory");
var PeggedTokenBridge__factory_1 = require("./factories/PeggedTokenBridge__factory");
__createBinding(exports, PeggedTokenBridge__factory_1, "PeggedTokenBridge__factory");
var FraxBridgeToken__factory_1 = require("./factories/FraxBridgeToken__factory");
__createBinding(exports, FraxBridgeToken__factory_1, "FraxBridgeToken__factory");
var IFraxCanoToken__factory_1 = require("./factories/IFraxCanoToken__factory");
__createBinding(exports, IFraxCanoToken__factory_1, "IFraxCanoToken__factory");
var IMaiBridgeHub__factory_1 = require("./factories/IMaiBridgeHub__factory");
__createBinding(exports, IMaiBridgeHub__factory_1, "IMaiBridgeHub__factory");
var MaiBridgeToken__factory_1 = require("./factories/MaiBridgeToken__factory");
__createBinding(exports, MaiBridgeToken__factory_1, "MaiBridgeToken__factory");
var MintSwapCanonicalTokenPermit__factory_1 = require("./factories/MintSwapCanonicalTokenPermit__factory");
__createBinding(exports, MintSwapCanonicalTokenPermit__factory_1, "MintSwapCanonicalTokenPermit__factory");
var MultiBridgeTokenPermit__factory_1 = require("./factories/MultiBridgeTokenPermit__factory");
__createBinding(exports, MultiBridgeTokenPermit__factory_1, "MultiBridgeTokenPermit__factory");
var SingleBridgeTokenPermit__factory_1 = require("./factories/SingleBridgeTokenPermit__factory");
__createBinding(exports, SingleBridgeTokenPermit__factory_1, "SingleBridgeTokenPermit__factory");
var MintSwapCanonicalToken__factory_1 = require("./factories/MintSwapCanonicalToken__factory");
__createBinding(exports, MintSwapCanonicalToken__factory_1, "MintSwapCanonicalToken__factory");
var MultiBridgeToken__factory_1 = require("./factories/MultiBridgeToken__factory");
__createBinding(exports, MultiBridgeToken__factory_1, "MultiBridgeToken__factory");
var SingleBridgeToken__factory_1 = require("./factories/SingleBridgeToken__factory");
__createBinding(exports, SingleBridgeToken__factory_1, "SingleBridgeToken__factory");
var ISwapCanoToken__factory_1 = require("./factories/ISwapCanoToken__factory");
__createBinding(exports, ISwapCanoToken__factory_1, "ISwapCanoToken__factory");
var SwapBridgeToken__factory_1 = require("./factories/SwapBridgeToken__factory");
__createBinding(exports, SwapBridgeToken__factory_1, "SwapBridgeToken__factory");
var Pool__factory_1 = require("./factories/Pool__factory");
__createBinding(exports, Pool__factory_1, "Pool__factory");
var DelayedTransfer__factory_1 = require("./factories/DelayedTransfer__factory");
__createBinding(exports, DelayedTransfer__factory_1, "DelayedTransfer__factory");
var Governor__factory_1 = require("./factories/Governor__factory");
__createBinding(exports, Governor__factory_1, "Governor__factory");
var Pauser__factory_1 = require("./factories/Pauser__factory");
__createBinding(exports, Pauser__factory_1, "Pauser__factory");
var VolumeControl__factory_1 = require("./factories/VolumeControl__factory");
__createBinding(exports, VolumeControl__factory_1, "VolumeControl__factory");
var Whitelist__factory_1 = require("./factories/Whitelist__factory");
__createBinding(exports, Whitelist__factory_1, "Whitelist__factory");
var SGN__factory_1 = require("./factories/SGN__factory");
__createBinding(exports, SGN__factory_1, "SGN__factory");
var Signers__factory_1 = require("./factories/Signers__factory");
__createBinding(exports, Signers__factory_1, "Signers__factory");
var Staking__factory_1 = require("./factories/Staking__factory");
__createBinding(exports, Staking__factory_1, "Staking__factory");
var StakingReward__factory_1 = require("./factories/StakingReward__factory");
__createBinding(exports, StakingReward__factory_1, "StakingReward__factory");
var DummySwap__factory_1 = require("./factories/DummySwap__factory");
__createBinding(exports, DummySwap__factory_1, "DummySwap__factory");
var TestERC20__factory_1 = require("./factories/TestERC20__factory");
__createBinding(exports, TestERC20__factory_1, "TestERC20__factory");
var Viewer__factory_1 = require("./factories/Viewer__factory");
__createBinding(exports, Viewer__factory_1, "Viewer__factory");
