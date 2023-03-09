/*==================================================
  Modules
  ==================================================*/

  const sdk = require('@defillama/sdk');

  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  const pools = [
    '0xcafea112Db32436c2390F5EC988f3aDB96870627'   // current pool
  ];

  const tokensAddresses = [
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84', // stETH
  ]

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {};

    let calls = [];

    pools.forEach((pool) => {
      tokensAddresses.forEach((tokenAddress) => {
        calls.push({
          target: tokenAddress,
          params: pool
        })
      });
    });

    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: 'erc20:balanceOf'
    });

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    for(let pool of pools) {
      let balance = (await sdk.api.eth.getBalance({target: pool, block})).output;
      balances['0x0000000000000000000000000000000000000000'] = BigNumber(balances['0x0000000000000000000000000000000000000000'] || 0).plus(balance).toFixed();
    }

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    start: 1558569600, // 05/23/2019 @ 12:00am (UTC)
    ethereum: { tvl }
  }
