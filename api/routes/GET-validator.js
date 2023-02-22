const url = require('url');
const Web3 = require('web3');
const utils = require('ethereumjs-util');
const BlockHeader = require('../static-lib/header');
const { toChecksumAddress } = require('ethereum-checksum-address');
const web3 = new Web3('https://glq-dataseed.graphlinq.io');

const getValidator = (app) => {
    app['get-validator'] = async (req, res, headers) => {
        const urlObj = url.parse( req.url, true, false );

        if (Number(urlObj.query['block-number']) == 0) { // genesis
            res.writeHead(200, {
                ... headers,
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({
                validator: '0xBd510d1DD4857061B092420039B44Ca20366F7Fd'
            }));
            return ;
        }
        const block = await web3.eth.getBlock(Number(urlObj.query['block-number']));
        const dataBuff = utils.toBuffer(block.extraData);
        const sig = utils.fromRpcSig(dataBuff.slice(dataBuff.length - 65, dataBuff.length));
        block.extraData = '0x' + utils.toBuffer(block.extraData).slice(0, dataBuff.length - 65).toString('hex');
        const headerHash = new BlockHeader({
            parentHash: utils.toBuffer(block.parentHash),
            uncleHash: utils.toBuffer(block.sha3Uncles),
            coinbase: utils.toBuffer(block.miner),
            stateRoot: utils.toBuffer(block.stateRoot),
            transactionsTrie: utils.toBuffer(block.transactionsRoot),
            receiptTrie: utils.toBuffer(block.receiptsRoot),
            bloom: utils.toBuffer(block.logsBloom),
            difficulty: Number(block.difficulty),
            number: utils.toBuffer(`0x${block.number.toString(16)}`),
            gasLimit: utils.toBuffer(block.gasLimit),
            gasUsed: utils.toBuffer(block.gasUsed),
            timestamp: utils.toBuffer(block.timestamp),
            extraData: utils.toBuffer(block.extraData),
            mixHash: utils.toBuffer(block.mixHash),
            nonce: utils.toBuffer(block.nonce),
            baseFee: utils.toBuffer(`0x${block?.baseFeePerGas ? block?.baseFeePerGas.toString(16) : '0'}`)
        }, { 
            londonBlock: block?.baseFeePerGas != undefined
        });
        const pub = utils.ecrecover(headerHash.hash(), sig.v, sig.r, sig.s);
        const address = utils.addHexPrefix(utils.pubToAddress(pub).toString('hex'));
        const validatorAddress = toChecksumAddress(address);
        console.log("validator address result:", validatorAddress);

        res.writeHead(200, {
            ... headers,
            'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({
            validator: validatorAddress
        }));
    };
};

module.exports = {
    getValidator
};