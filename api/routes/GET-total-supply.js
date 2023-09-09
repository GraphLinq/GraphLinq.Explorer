const url = require('url');
const Web3 = require('web3');
const utils = require('ethereumjs-util');
const web3 = new Web3('https://glq-dataseed.graphlinq.io');

const getTotalSupply = (app) => {
    app['get-total-supply'] = async (req, res, headers) => {
        res.writeHead(200, {
            ... headers,
            'Content-Type': 'application/json'
        });

        try {
            const latest = await web3.eth.getBlockNumber();
            const latestBlockNumber = +latest.toString();

            // 14700 GENESISQ Rewards starting blockNumber
            const numberOfGLQAtGENESISBLOCK = 650000000;
            const numberOfBlockWithRewards = latestBlockNumber - 14700;
            const numberOfGLQRewardPerBlock = 5;
            const numberOfGLQRewardedSinceGENESISQ = numberOfBlockWithRewards * numberOfGLQRewardPerBlock;

            const totalSupply = numberOfGLQAtGENESISBLOCK + numberOfGLQRewardedSinceGENESISQ;

            res.end(JSON.stringify({
                totalSupply: totalSupply.toFixed(0),
                blockNumber: latestBlockNumber.toFixed(0),
                numberOfGLQAtGENESISBLOCK: numberOfGLQAtGENESISBLOCK.toFixed(0),
                numberOfGLQRewardedSinceGENESISQ: numberOfGLQRewardedSinceGENESISQ.toFixed(0),
                date: (new Date()).toISOString()
            }));

        } catch (e) {
            res.end(JSON.stringify({
                totalSupply: "0",
                blockNumber: "0"
            }));
            return ;
        }
    };
};

module.exports = {
    getTotalSupply
};