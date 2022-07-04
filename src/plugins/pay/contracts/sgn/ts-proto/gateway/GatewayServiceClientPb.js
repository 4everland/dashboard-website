"use strict";
/**
 * @fileoverview gRPC-Web generated client stub for sgn.gateway.v1
 * @enhanceable
 * @public
 */
exports.__esModule = true;
exports.WebClient = void 0;
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck
var grpcWeb = require("grpc-web");
var gateway_gateway_pb = require("../gateway/gateway_pb");
var sgn_health_v1_health_pb = require("../sgn/health/v1/health_pb");
var sgn_message_v1_query_pb = require("../sgn/message/v1/query_pb");
var WebClient = /** @class */ (function () {
    function WebClient(hostname, credentials, options) {
        this.methodInfoGetTransferConfigs = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetTransferConfigs', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetTransferConfigsRequest, gateway_gateway_pb.GetTransferConfigsResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetTransferConfigsResponse.deserializeBinary);
        this.methodInfoGetTransferConfigsForAll = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetTransferConfigsForAll', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetTransferConfigsRequest, gateway_gateway_pb.GetTransferConfigsResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetTransferConfigsResponse.deserializeBinary);
        this.methodInfoGetTokenInfo = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetTokenInfo', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetTokenInfoRequest, gateway_gateway_pb.GetTokenInfoResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetTokenInfoResponse.deserializeBinary);
        this.methodInfoEstimateAmt = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/EstimateAmt', grpcWeb.MethodType.UNARY, gateway_gateway_pb.EstimateAmtRequest, gateway_gateway_pb.EstimateAmtResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.EstimateAmtResponse.deserializeBinary);
        this.methodInfoGetTransferStatus = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetTransferStatus', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetTransferStatusRequest, gateway_gateway_pb.GetTransferStatusResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetTransferStatusResponse.deserializeBinary);
        this.methodInfoGetLPInfoList = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetLPInfoList', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetLPInfoListRequest, gateway_gateway_pb.GetLPInfoListResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetLPInfoListResponse.deserializeBinary);
        this.methodInfoWithdrawLiquidity = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/WithdrawLiquidity', grpcWeb.MethodType.UNARY, gateway_gateway_pb.WithdrawLiquidityRequest, gateway_gateway_pb.WithdrawLiquidityResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.WithdrawLiquidityResponse.deserializeBinary);
        this.methodInfoEstimateWithdrawAmt = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/EstimateWithdrawAmt', grpcWeb.MethodType.UNARY, gateway_gateway_pb.EstimateWithdrawAmtRequest, gateway_gateway_pb.EstimateWithdrawAmtResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.EstimateWithdrawAmtResponse.deserializeBinary);
        this.methodInfoQueryLiquidityStatus = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/QueryLiquidityStatus', grpcWeb.MethodType.UNARY, gateway_gateway_pb.QueryLiquidityStatusRequest, gateway_gateway_pb.QueryLiquidityStatusResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.QueryLiquidityStatusResponse.deserializeBinary);
        this.methodInfoUnlockFarmingReward = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/UnlockFarmingReward', grpcWeb.MethodType.UNARY, gateway_gateway_pb.UnlockFarmingRewardRequest, gateway_gateway_pb.UnlockFarmingRewardResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.UnlockFarmingRewardResponse.deserializeBinary);
        this.methodInfoGetFarmingRewardDetails = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetFarmingRewardDetails', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetFarmingRewardDetailsRequest, gateway_gateway_pb.GetFarmingRewardDetailsResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetFarmingRewardDetailsResponse.deserializeBinary);
        this.methodInfoTransferHistory = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/TransferHistory', grpcWeb.MethodType.UNARY, gateway_gateway_pb.TransferHistoryRequest, gateway_gateway_pb.TransferHistoryResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.TransferHistoryResponse.deserializeBinary);
        this.methodInfoLPHistory = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/LPHistory', grpcWeb.MethodType.UNARY, gateway_gateway_pb.LPHistoryRequest, gateway_gateway_pb.LPHistoryResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.LPHistoryResponse.deserializeBinary);
        this.methodInfoRewardingData = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/RewardingData', grpcWeb.MethodType.UNARY, gateway_gateway_pb.RewardingDataRequest, gateway_gateway_pb.RewardingDataResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.RewardingDataResponse.deserializeBinary);
        this.methodInfoStakingConfig = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/StakingConfig', grpcWeb.MethodType.UNARY, gateway_gateway_pb.StakingConfigRequest, gateway_gateway_pb.StakingConfigResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.StakingConfigResponse.deserializeBinary);
        this.methodInfoUnlockStakingReward = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/UnlockStakingReward', grpcWeb.MethodType.UNARY, gateway_gateway_pb.UnlockStakingRewardRequest, gateway_gateway_pb.UnlockStakingRewardResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.UnlockStakingRewardResponse.deserializeBinary);
        this.methodInfoGetStakingRewardDetails = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetStakingRewardDetails', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetStakingRewardDetailsRequest, gateway_gateway_pb.GetStakingRewardDetailsResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetStakingRewardDetailsResponse.deserializeBinary);
        this.methodInfoGetTotalLiquidityProviderTokenBalance = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetTotalLiquidityProviderTokenBalance', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceRequest, gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetTotalLiquidityProviderTokenBalanceResponse.deserializeBinary);
        this.methodInfoUpdateChain = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/UpdateChain', grpcWeb.MethodType.UNARY, gateway_gateway_pb.UpdateChainRequest, gateway_gateway_pb.UpdateChainResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.UpdateChainResponse.deserializeBinary);
        this.methodInfoUpdateToken = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/UpdateToken', grpcWeb.MethodType.UNARY, gateway_gateway_pb.UpdateTokenRequest, gateway_gateway_pb.UpdateTokenResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.UpdateTokenResponse.deserializeBinary);
        this.methodInfoGetCampaignScores = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetCampaignScores', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetCampaignScoresRequest, gateway_gateway_pb.GetCampaignScoresResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetCampaignScoresResponse.deserializeBinary);
        this.methodInfoGetInfoByTxHash = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetInfoByTxHash', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetInfoByTxHashRequest, gateway_gateway_pb.GetInfoByTxHashResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetInfoByTxHashResponse.deserializeBinary);
        this.methodInfoGetAbnormalStatusInfo = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetAbnormalStatusInfo', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetAbnormalStatusInfoRequest, gateway_gateway_pb.GetAbnormalStatusInfoResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetAbnormalStatusInfoResponse.deserializeBinary);
        this.methodInfoGetAllLPInfo = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetAllLPInfo', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetAllLPInfoRequest, gateway_gateway_pb.GetAllLPInfoResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetAllLPInfoResponse.deserializeBinary);
        this.methodInfoGetAllTXInfo = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetAllTXInfo', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetAllTXInfoRequest, gateway_gateway_pb.GetAllTXInfoResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetAllTXInfoResponse.deserializeBinary);
        this.methodInfoFixEventMiss = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/FixEventMiss', grpcWeb.MethodType.UNARY, gateway_gateway_pb.FixEventMissRequest, gateway_gateway_pb.FixEventMissResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.FixEventMissResponse.deserializeBinary);
        this.methodInfoGetUsrBalance = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetUsrBalance', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetUsrBalanceRequest, gateway_gateway_pb.GetUsrBalanceResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetUsrBalanceResponse.deserializeBinary);
        this.methodInfoGetAllConfigs = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetAllConfigs', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetAllConfigsRequest, gateway_gateway_pb.GetAllConfigsResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetAllConfigsResponse.deserializeBinary);
        this.methodInfoGetCbrConfigsOnChain = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetCbrConfigsOnChain', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetCbrConfigsOnChainRequest, gateway_gateway_pb.GetCbrConfigsOnChainResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetCbrConfigsOnChainResponse.deserializeBinary);
        this.methodInfoReportCurrentBlockNumber = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/ReportCurrentBlockNumber', grpcWeb.MethodType.UNARY, sgn_health_v1_health_pb.ReportSgnAnalyticsRequest, sgn_health_v1_health_pb.ReportSgnAnalyticsResponse, function (request) {
            return request.serializeBinary();
        }, sgn_health_v1_health_pb.ReportSgnAnalyticsResponse.deserializeBinary);
        this.methodInfoGetCurrentBlockNumberByNode = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetCurrentBlockNumberByNode', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetCurrentBlockNumberByNodeRequest, gateway_gateway_pb.GetCurrentBlockNumberByNodeResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetCurrentBlockNumberByNodeResponse.deserializeBinary);
        this.methodInfoGetRetentionRewardsInfo = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetRetentionRewardsInfo', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetRetentionRewardsInfoRequest, gateway_gateway_pb.GetRetentionRewardsInfoResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetRetentionRewardsInfoResponse.deserializeBinary);
        this.methodInfoGetIncentiveCampaignCelrRank = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetIncentiveCampaignCelrRank', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetIncentiveCampaignCelrRankRequest, gateway_gateway_pb.GetIncentiveCampaignCelrRankResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetIncentiveCampaignCelrRankResponse.deserializeBinary);
        this.methodInfoInIncentiveCampaignBnbWhiteList = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/InIncentiveCampaignBnbWhiteList', grpcWeb.MethodType.UNARY, gateway_gateway_pb.InIncentiveCampaignBnbWhiteListRequest, gateway_gateway_pb.InIncentiveCampaignBnbWhiteListResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.InIncentiveCampaignBnbWhiteListResponse.deserializeBinary);
        this.methodInfoGetIncentiveCampaignBnbRank = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetIncentiveCampaignBnbRank', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetIncentiveCampaignBnbRankRequest, gateway_gateway_pb.GetIncentiveCampaignBnbRankResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetIncentiveCampaignBnbRankResponse.deserializeBinary);
        this.methodInfoClaimRetentionRewards = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/ClaimRetentionRewards', grpcWeb.MethodType.UNARY, gateway_gateway_pb.ClaimRetentionRewardsRequest, gateway_gateway_pb.ClaimRetentionRewardsResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.ClaimRetentionRewardsResponse.deserializeBinary);
        this.methodInfoGetBscCampaignInfo = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetBscCampaignInfo', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetBscCampaignInfoRequest, gateway_gateway_pb.GetBscCampaignInfoResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetBscCampaignInfoResponse.deserializeBinary);
        this.methodInfoClaimGetBscCampaignReward = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/ClaimGetBscCampaignReward', grpcWeb.MethodType.UNARY, gateway_gateway_pb.ClaimGetBscCampaignRewardRequest, gateway_gateway_pb.ClaimGetBscCampaignRewardResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.ClaimGetBscCampaignRewardResponse.deserializeBinary);
        this.methodInfoGetFeeRebateInfo = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/GetFeeRebateInfo', grpcWeb.MethodType.UNARY, gateway_gateway_pb.GetFeeRebateInfoRequest, gateway_gateway_pb.GetFeeRebateInfoResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.GetFeeRebateInfoResponse.deserializeBinary);
        this.methodInfoClaimFeeRebate = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/ClaimFeeRebate', grpcWeb.MethodType.UNARY, gateway_gateway_pb.ClaimFeeRebateRequest, gateway_gateway_pb.ClaimFeeRebateResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.ClaimFeeRebateResponse.deserializeBinary);
        this.methodInfoClaimPegBridgeFee = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/ClaimPegBridgeFee', grpcWeb.MethodType.UNARY, gateway_gateway_pb.ClaimPegBridgeFeeRequest, gateway_gateway_pb.ClaimPegBridgeFeeResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.ClaimPegBridgeFeeResponse.deserializeBinary);
        this.methodInfoInitWithdraw = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/InitWithdraw', grpcWeb.MethodType.UNARY, gateway_gateway_pb.InitWithdrawRequest, gateway_gateway_pb.InitWithdrawResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.InitWithdrawResponse.deserializeBinary);
        this.methodInfoInitPegRefund = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/InitPegRefund', grpcWeb.MethodType.UNARY, gateway_gateway_pb.InitPegRefundRequest, gateway_gateway_pb.InitPegRefundResponse, function (request) {
            return request.serializeBinary();
        }, gateway_gateway_pb.InitPegRefundResponse.deserializeBinary);
        this.methodInfoExecutionContexts = new grpcWeb.MethodDescriptor('/sgn.gateway.v1.Web/ExecutionContexts', grpcWeb.MethodType.UNARY, sgn_message_v1_query_pb.QueryExecutionContextsRequest, sgn_message_v1_query_pb.QueryExecutionContextsResponse, function (request) {
            return request.serializeBinary();
        }, sgn_message_v1_query_pb.QueryExecutionContextsResponse.deserializeBinary);
        if (!options)
            options = {};
        if (!credentials)
            credentials = {};
        options['format'] = 'binary';
        this.client_ = new grpcWeb.GrpcWebClientBase(options);
        this.hostname_ = hostname;
        this.credentials_ = credentials;
        this.options_ = options;
    }
    WebClient.prototype.getTransferConfigs = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetTransferConfigs', request, metadata || {}, this.methodInfoGetTransferConfigs, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetTransferConfigs', request, metadata || {}, this.methodInfoGetTransferConfigs);
    };
    WebClient.prototype.getTransferConfigsForAll = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetTransferConfigsForAll', request, metadata || {}, this.methodInfoGetTransferConfigsForAll, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetTransferConfigsForAll', request, metadata || {}, this.methodInfoGetTransferConfigsForAll);
    };
    WebClient.prototype.getTokenInfo = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetTokenInfo', request, metadata || {}, this.methodInfoGetTokenInfo, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetTokenInfo', request, metadata || {}, this.methodInfoGetTokenInfo);
    };
    WebClient.prototype.estimateAmt = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/EstimateAmt', request, metadata || {}, this.methodInfoEstimateAmt, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/EstimateAmt', request, metadata || {}, this.methodInfoEstimateAmt);
    };
    WebClient.prototype.getTransferStatus = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetTransferStatus', request, metadata || {}, this.methodInfoGetTransferStatus, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetTransferStatus', request, metadata || {}, this.methodInfoGetTransferStatus);
    };
    WebClient.prototype.getLPInfoList = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetLPInfoList', request, metadata || {}, this.methodInfoGetLPInfoList, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetLPInfoList', request, metadata || {}, this.methodInfoGetLPInfoList);
    };
    WebClient.prototype.withdrawLiquidity = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/WithdrawLiquidity', request, metadata || {}, this.methodInfoWithdrawLiquidity, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/WithdrawLiquidity', request, metadata || {}, this.methodInfoWithdrawLiquidity);
    };
    WebClient.prototype.estimateWithdrawAmt = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/EstimateWithdrawAmt', request, metadata || {}, this.methodInfoEstimateWithdrawAmt, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/EstimateWithdrawAmt', request, metadata || {}, this.methodInfoEstimateWithdrawAmt);
    };
    WebClient.prototype.queryLiquidityStatus = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/QueryLiquidityStatus', request, metadata || {}, this.methodInfoQueryLiquidityStatus, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/QueryLiquidityStatus', request, metadata || {}, this.methodInfoQueryLiquidityStatus);
    };
    WebClient.prototype.unlockFarmingReward = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/UnlockFarmingReward', request, metadata || {}, this.methodInfoUnlockFarmingReward, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/UnlockFarmingReward', request, metadata || {}, this.methodInfoUnlockFarmingReward);
    };
    WebClient.prototype.getFarmingRewardDetails = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetFarmingRewardDetails', request, metadata || {}, this.methodInfoGetFarmingRewardDetails, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetFarmingRewardDetails', request, metadata || {}, this.methodInfoGetFarmingRewardDetails);
    };
    WebClient.prototype.transferHistory = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/TransferHistory', request, metadata || {}, this.methodInfoTransferHistory, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/TransferHistory', request, metadata || {}, this.methodInfoTransferHistory);
    };
    WebClient.prototype.lPHistory = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/LPHistory', request, metadata || {}, this.methodInfoLPHistory, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/LPHistory', request, metadata || {}, this.methodInfoLPHistory);
    };
    WebClient.prototype.rewardingData = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/RewardingData', request, metadata || {}, this.methodInfoRewardingData, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/RewardingData', request, metadata || {}, this.methodInfoRewardingData);
    };
    WebClient.prototype.stakingConfig = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/StakingConfig', request, metadata || {}, this.methodInfoStakingConfig, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/StakingConfig', request, metadata || {}, this.methodInfoStakingConfig);
    };
    WebClient.prototype.unlockStakingReward = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/UnlockStakingReward', request, metadata || {}, this.methodInfoUnlockStakingReward, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/UnlockStakingReward', request, metadata || {}, this.methodInfoUnlockStakingReward);
    };
    WebClient.prototype.getStakingRewardDetails = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetStakingRewardDetails', request, metadata || {}, this.methodInfoGetStakingRewardDetails, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetStakingRewardDetails', request, metadata || {}, this.methodInfoGetStakingRewardDetails);
    };
    WebClient.prototype.getTotalLiquidityProviderTokenBalance = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetTotalLiquidityProviderTokenBalance', request, metadata || {}, this.methodInfoGetTotalLiquidityProviderTokenBalance, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetTotalLiquidityProviderTokenBalance', request, metadata || {}, this.methodInfoGetTotalLiquidityProviderTokenBalance);
    };
    WebClient.prototype.updateChain = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/UpdateChain', request, metadata || {}, this.methodInfoUpdateChain, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/UpdateChain', request, metadata || {}, this.methodInfoUpdateChain);
    };
    WebClient.prototype.updateToken = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/UpdateToken', request, metadata || {}, this.methodInfoUpdateToken, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/UpdateToken', request, metadata || {}, this.methodInfoUpdateToken);
    };
    WebClient.prototype.getCampaignScores = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetCampaignScores', request, metadata || {}, this.methodInfoGetCampaignScores, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetCampaignScores', request, metadata || {}, this.methodInfoGetCampaignScores);
    };
    WebClient.prototype.getInfoByTxHash = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetInfoByTxHash', request, metadata || {}, this.methodInfoGetInfoByTxHash, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetInfoByTxHash', request, metadata || {}, this.methodInfoGetInfoByTxHash);
    };
    WebClient.prototype.getAbnormalStatusInfo = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetAbnormalStatusInfo', request, metadata || {}, this.methodInfoGetAbnormalStatusInfo, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetAbnormalStatusInfo', request, metadata || {}, this.methodInfoGetAbnormalStatusInfo);
    };
    WebClient.prototype.getAllLPInfo = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetAllLPInfo', request, metadata || {}, this.methodInfoGetAllLPInfo, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetAllLPInfo', request, metadata || {}, this.methodInfoGetAllLPInfo);
    };
    WebClient.prototype.getAllTXInfo = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetAllTXInfo', request, metadata || {}, this.methodInfoGetAllTXInfo, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetAllTXInfo', request, metadata || {}, this.methodInfoGetAllTXInfo);
    };
    WebClient.prototype.fixEventMiss = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/FixEventMiss', request, metadata || {}, this.methodInfoFixEventMiss, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/FixEventMiss', request, metadata || {}, this.methodInfoFixEventMiss);
    };
    WebClient.prototype.getUsrBalance = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetUsrBalance', request, metadata || {}, this.methodInfoGetUsrBalance, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetUsrBalance', request, metadata || {}, this.methodInfoGetUsrBalance);
    };
    WebClient.prototype.getAllConfigs = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetAllConfigs', request, metadata || {}, this.methodInfoGetAllConfigs, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetAllConfigs', request, metadata || {}, this.methodInfoGetAllConfigs);
    };
    WebClient.prototype.getCbrConfigsOnChain = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetCbrConfigsOnChain', request, metadata || {}, this.methodInfoGetCbrConfigsOnChain, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetCbrConfigsOnChain', request, metadata || {}, this.methodInfoGetCbrConfigsOnChain);
    };
    WebClient.prototype.reportCurrentBlockNumber = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/ReportCurrentBlockNumber', request, metadata || {}, this.methodInfoReportCurrentBlockNumber, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/ReportCurrentBlockNumber', request, metadata || {}, this.methodInfoReportCurrentBlockNumber);
    };
    WebClient.prototype.getCurrentBlockNumberByNode = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetCurrentBlockNumberByNode', request, metadata || {}, this.methodInfoGetCurrentBlockNumberByNode, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetCurrentBlockNumberByNode', request, metadata || {}, this.methodInfoGetCurrentBlockNumberByNode);
    };
    WebClient.prototype.getRetentionRewardsInfo = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetRetentionRewardsInfo', request, metadata || {}, this.methodInfoGetRetentionRewardsInfo, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetRetentionRewardsInfo', request, metadata || {}, this.methodInfoGetRetentionRewardsInfo);
    };
    WebClient.prototype.getIncentiveCampaignCelrRank = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetIncentiveCampaignCelrRank', request, metadata || {}, this.methodInfoGetIncentiveCampaignCelrRank, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetIncentiveCampaignCelrRank', request, metadata || {}, this.methodInfoGetIncentiveCampaignCelrRank);
    };
    WebClient.prototype.inIncentiveCampaignBnbWhiteList = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/InIncentiveCampaignBnbWhiteList', request, metadata || {}, this.methodInfoInIncentiveCampaignBnbWhiteList, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/InIncentiveCampaignBnbWhiteList', request, metadata || {}, this.methodInfoInIncentiveCampaignBnbWhiteList);
    };
    WebClient.prototype.getIncentiveCampaignBnbRank = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetIncentiveCampaignBnbRank', request, metadata || {}, this.methodInfoGetIncentiveCampaignBnbRank, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetIncentiveCampaignBnbRank', request, metadata || {}, this.methodInfoGetIncentiveCampaignBnbRank);
    };
    WebClient.prototype.claimRetentionRewards = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/ClaimRetentionRewards', request, metadata || {}, this.methodInfoClaimRetentionRewards, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/ClaimRetentionRewards', request, metadata || {}, this.methodInfoClaimRetentionRewards);
    };
    WebClient.prototype.getBscCampaignInfo = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetBscCampaignInfo', request, metadata || {}, this.methodInfoGetBscCampaignInfo, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetBscCampaignInfo', request, metadata || {}, this.methodInfoGetBscCampaignInfo);
    };
    WebClient.prototype.claimGetBscCampaignReward = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/ClaimGetBscCampaignReward', request, metadata || {}, this.methodInfoClaimGetBscCampaignReward, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/ClaimGetBscCampaignReward', request, metadata || {}, this.methodInfoClaimGetBscCampaignReward);
    };
    WebClient.prototype.getFeeRebateInfo = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/GetFeeRebateInfo', request, metadata || {}, this.methodInfoGetFeeRebateInfo, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/GetFeeRebateInfo', request, metadata || {}, this.methodInfoGetFeeRebateInfo);
    };
    WebClient.prototype.claimFeeRebate = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/ClaimFeeRebate', request, metadata || {}, this.methodInfoClaimFeeRebate, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/ClaimFeeRebate', request, metadata || {}, this.methodInfoClaimFeeRebate);
    };
    WebClient.prototype.claimPegBridgeFee = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/ClaimPegBridgeFee', request, metadata || {}, this.methodInfoClaimPegBridgeFee, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/ClaimPegBridgeFee', request, metadata || {}, this.methodInfoClaimPegBridgeFee);
    };
    WebClient.prototype.initWithdraw = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/InitWithdraw', request, metadata || {}, this.methodInfoInitWithdraw, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/InitWithdraw', request, metadata || {}, this.methodInfoInitWithdraw);
    };
    WebClient.prototype.initPegRefund = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/InitPegRefund', request, metadata || {}, this.methodInfoInitPegRefund, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/InitPegRefund', request, metadata || {}, this.methodInfoInitPegRefund);
    };
    WebClient.prototype.executionContexts = function (request, metadata, callback) {
        if (callback !== undefined) {
            return this.client_.rpcCall(this.hostname_ +
                '/sgn.gateway.v1.Web/ExecutionContexts', request, metadata || {}, this.methodInfoExecutionContexts, callback);
        }
        return this.client_.unaryCall(this.hostname_ +
            '/sgn.gateway.v1.Web/ExecutionContexts', request, metadata || {}, this.methodInfoExecutionContexts);
    };
    return WebClient;
}());
exports.WebClient = WebClient;
