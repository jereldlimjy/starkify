const { fetchPrices } = require("@avnu/avnu-sdk");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const FIBROUS_TOKEN_ENDPOINT = "https://api.fibrous.finance/tokens";
const ETH_TOKEN_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
// const STRK_TOKEN_ADDRESS =
//   "0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d";
const ONE = BigInt(1000000000000000000); // 1

const AVNU_OFFICIAL_TOKENS = [
  {
    name: "Ethereum",
    address:
      "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    symbol: "ETH",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2/logo.png",
  },
  {
    name: "Dai Stablecoin",
    address:
      "0x5574eb6b8789a91466f902c380d978e472db68170ff82a5b650b95a58ddf4ad",
    symbol: "DAI",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
  },
  {
    name: "Dai Stablecoin v0",
    address: "0xda114221cb83fa859dbdb4c44beeaa0bb37c7537ad5ae66fe5e0efd20e6eb3",
    symbol: "DAIv0",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x6B175474E89094C44Da98b954EedeAC495271d0F/logo.png",
  },
  {
    name: "Ekubo Protocol",
    address:
      "0x75afe6402ad5a5c20dd25e10ec3b3986acaa647b77e4ae24b0cbc9a54a27a87",
    symbol: "EKUBO",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri: "https://app.ekubo.org/logo.svg",
  },
  {
    name: "Lords",
    address:
      "0x124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49",
    symbol: "LORDS",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://assets.coingecko.com/coins/images/22171/small/Frame_1.png",
  },
  {
    name: "Liquity USD",
    address:
      "0x70a76fd48ca0ef910631754d77dd822147fe98a569b826ec85e3c33fde586ac",
    symbol: "LUSD",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://assets.coingecko.com/coins/images/14666/small/Group_3.png",
  },
  {
    name: "Nostra",
    address: "0xc530f2c0aa4c16a0806365b0898499fba372e5df7a7172dc6fe9ba777e8007",
    symbol: "NSTR",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://assets.coingecko.com/coins/images/28282/small/Nostra_200x200.png",
  },
  {
    name: "Rocket Pool ETH",
    address:
      "0x319111a5037cbec2b3e638cc34a3474e2d2608299f3e62866e9cc683208c610",
    symbol: "rETH",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri: "https://assets.coingecko.com/coins/images/20764/large/reth.png",
  },
  {
    name: "Starknet",
    address:
      "0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    symbol: "STRK",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://assets.coingecko.com/coins/images/26433/small/starknet.png",
  },
  {
    name: "Tether",
    address:
      "0x68f5c6a61780768455de69077e07e89787839bf8166decfbf92b645209c0fb8",
    symbol: "USDT",
    decimals: 6,
    chainId: "0x534e5f474f45524c49",
    logoUri: "https://assets.coingecko.com/coins/images/325/small/Tether.png",
  },
  {
    name: "Uniswap",
    address:
      "0x49210ffc442172463f3177147c1aeaa36c51d152c1b0630f2364c300d4f48ee",
    symbol: "UNI",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
  },
  {
    name: "USDC",
    address:
      "0x53c91253bc9682c04929ca02ed00b3e423f6710d2ee7e0d5ebb06f3ecf368a8",
    symbol: "USDC",
    decimals: 6,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png",
  },
  {
    name: "Starknet Voting Token",
    address:
      "0x782f0ddca11d9950bc3220e35ac82cf868778edb67a5e58b39838544bc4cd0f",
    symbol: "vSTRK",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://assets.coingecko.com/coins/images/26433/small/starknet.png",
  },
  {
    name: "Wrapped BTC",
    address:
      "0x3fe2b97c1fd336e750087d68b9b867997fd64a2661ff3ca5a7c771641e8e7ac",
    symbol: "WBTC",
    decimals: 8,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599/logo.png",
  },
  {
    name: "Wrapped liquid staked Ether 2.0",
    address:
      "0x42b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2",
    symbol: "wstETH",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://static.starkscan.co/tokens/0x042b8f0484674ca266ac5d08e4ac6a3fe65bd3129795def2dca5c34ecc5f96d2/icons/QmaxTVxd6ZWrotuG64LiuL8PCEgwjiHiQF9isCu8QKgneP",
  },
  {
    name: "zkLend Token",
    address: "0x585c32b625999e6e5e78645ff8df7a9001cf5cf3eb6b80ccdd16cb64bd3a34",
    symbol: "ZEND",
    decimals: 18,
    chainId: "0x534e5f474f45524c49",
    logoUri:
      "https://zklend.gitbook.io/~gitbook/image?url=https:%2F%2F4162751440-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FFPvHrlMhUpyXVmLfOKVy%252Fuploads%252FQyZucIilvlC0irpiNJrd%252FzkLend_icon.png%3Falt=media%26token=a6a02b08-1152-4935-b3d3-84c90fd9a558&width=768&dpr=1&quality=100&sign=54d85166f4cf2ad8d2c0e1788e2ef10b63cd86b0e3214e568bf168fa73cdf0fb",
  },
];

const COINGECKO_STARKNET_TOKENS = [
  {
    id: "starknet",
    symbol: "strk",
    name: "Starknet",
    address:
      "0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
    image:
      "https://coin-images.coingecko.com/coins/images/26433/large/starknet.png?1696525507",
    current_price: 0.00020778,
    market_cap: 269948,
    market_cap_rank: 85,
    fully_diluted_valuation: 2076023,
    total_volume: 21789,
    high_24h: 0.00020961,
    low_24h: 0.00019971,
    price_change_24h: -0.000001765199354443,
    price_change_percentage_24h: -0.84238,
    market_cap_change_24h: -2673.8928285969887,
    market_cap_change_percentage_24h: -0.98081,
    circulating_supply: 1300311845,
    total_supply: 10000000000,
    max_supply: 10000000000,
    ath: 0.00150343,
    ath_change_percentage: -86.17115,
    ath_date: "2024-02-20T12:05:13.556Z",
    atl: 0.00019971,
    atl_change_percentage: 4.10429,
    atl_date: "2024-06-19T15:30:30.236Z",
    roi: null,
    last_updated: "2024-06-20T06:56:13.068Z",
  },
  {
    id: "lords",
    symbol: "lords",
    name: "LORDS",
    address:
      "0x0124aeb495b947201f5fac96fd1138e326ad86195b98df6dec9009158a533b49",
    image:
      "https://coin-images.coingecko.com/coins/images/22171/large/Frame_1.png?1696521515",
    current_price: 0.00002615,
    market_cap: 3360,
    market_cap_rank: 1277,
    fully_diluted_valuation: 13074,
    total_volume: 6.351842,
    high_24h: 0.00002642,
    low_24h: 0.00002217,
    price_change_24h: 0.00000397,
    price_change_percentage_24h: 17.92711,
    market_cap_change_24h: 512.067,
    market_cap_change_percentage_24h: 17.98075,
    circulating_supply: 128500151.55001965,
    total_supply: 500000000,
    max_supply: 500000000,
    ath: 0.00031744,
    ath_change_percentage: -91.76312,
    ath_date: "2022-02-05T17:44:59.267Z",
    atl: 0.00001162,
    atl_change_percentage: 124.95428,
    atl_date: "2022-11-10T00:49:12.643Z",
    roi: null,
    last_updated: "2024-06-20T06:51:49.639Z",
  },
  {
    id: "staked-strk",
    symbol: "nststrk",
    name: "Nostra Staked STRK",
    address:
      "0x4619e9ce4109590219c5263787050726be63382148538f3f936c22aa87d2fc2",
    image:
      "https://coin-images.coingecko.com/coins/images/35752/large/stSTRK.png?1709720278",
    current_price: 0.00020319,
    market_cap: 831.782,
    market_cap_rank: 2064,
    fully_diluted_valuation: 831.955,
    total_volume: 16.938121,
    high_24h: 0.00020794,
    low_24h: 0.00019584,
    price_change_24h: -0.000003948364483776,
    price_change_percentage_24h: -1.90617,
    market_cap_change_24h: -46.20979481641848,
    market_cap_change_percentage_24h: -5.26313,
    circulating_supply: 4093663.52152097,
    total_supply: 4094519.64388516,
    max_supply: null,
    ath: 0.00063585,
    ath_change_percentage: -68.04467,
    ath_date: "2024-03-25T00:00:31.733Z",
    atl: 0.00019584,
    atl_change_percentage: 3.75259,
    atl_date: "2024-06-19T17:31:20.256Z",
    roi: null,
    last_updated: "2024-06-20T06:20:25.114Z",
  },
  {
    id: "nostra-uno",
    symbol: "uno",
    name: "UNO",
    address:
      "0x719b5092403233201aa822ce928bd4b551d0cdb071a724edd7dc5e5f57b7f34",
    image:
      "https://coin-images.coingecko.com/coins/images/28283/large/UNO.png?1710957910",
    current_price: 0.00027659,
    market_cap: 24.56817,
    market_cap_rank: 4060,
    fully_diluted_valuation: 24.573542,
    total_volume: 0.78978424,
    high_24h: 0.00028902,
    low_24h: 0.00027653,
    price_change_24h: -0.000005625182317182,
    price_change_percentage_24h: -1.9932,
    market_cap_change_24h: -2.5169823359911128,
    market_cap_change_percentage_24h: -9.29285,
    circulating_supply: 88824.3056803666,
    total_supply: 88843.7289596206,
    max_supply: null,
    ath: 0.00035403,
    ath_change_percentage: -21.87271,
    ath_date: "2024-05-01T08:32:27.716Z",
    atl: 0.00023832,
    atl_change_percentage: 16.0592,
    atl_date: "2024-04-14T22:21:37.388Z",
    roi: null,
    last_updated: "2024-06-20T06:20:22.618Z",
  },
  {
    id: "stark-owl",
    symbol: "owl",
    name: "Stark Owl",
    address:
      "0x39877a272619050ab8b0e3e0a19b58d076fc2ce84da1dc73b699590e629f2b8",
    image:
      "https://coin-images.coingecko.com/coins/images/33780/large/Safeimagekit-resized-img_%2814%29.png?1702979184",
    current_price: 5.85899e-7,
    market_cap: 0,
    market_cap_rank: null,
    fully_diluted_valuation: 58.59,
    total_volume: 0.00565335,
    high_24h: 5.87447e-7,
    low_24h: 5.75482e-7,
    price_change_24h: 1.685e-9,
    price_change_percentage_24h: 0.28849,
    market_cap_change_24h: 0,
    market_cap_change_percentage_24h: 0,
    circulating_supply: 0,
    total_supply: 100000000,
    max_supply: 100000000,
    ath: 0.00003804,
    ath_change_percentage: -98.4596,
    ath_date: "2024-02-14T08:09:05.501Z",
    atl: 5.71297e-7,
    atl_change_percentage: 2.55584,
    atl_date: "2024-06-18T21:40:01.649Z",
    roi: null,
    last_updated: "2024-06-20T04:00:11.139Z",
  },
  {
    id: "starkpepe",
    symbol: "spepe",
    name: "StarkPepe",
    address:
      "0x1e0eee22c684fdf32babdd65e6bcca62a8ce2c23c8d5e68f3989595d26e1b4a",
    image:
      "https://coin-images.coingecko.com/coins/images/34247/large/output.png?1704338425",
    current_price: 2.212e-9,
    market_cap: 0,
    market_cap_rank: null,
    fully_diluted_valuation: 92.908,
    total_volume: 0.37657158,
    high_24h: 2.219e-9,
    low_24h: 2.118e-9,
    price_change_24h: 2.3306e-11,
    price_change_percentage_24h: 1.06476,
    market_cap_change_24h: 0,
    market_cap_change_percentage_24h: 0,
    circulating_supply: 0,
    total_supply: 42000000000,
    max_supply: 42000000000,
    ath: 3.19256e-7,
    ath_change_percentage: -99.30714,
    ath_date: "2024-04-07T17:22:22.959Z",
    atl: 1.971e-9,
    atl_change_percentage: 12.20198,
    atl_date: "2024-05-26T14:11:48.542Z",
    roi: null,
    last_updated: "2024-06-20T06:54:10.641Z",
  },
  {
    id: "zklend-2",
    symbol: "zend",
    name: "zkLend",
    address:
      "0x05ffbcfeb50d200a0677c48a129a11245a3fc519d1d98d76882d1c9a1b19c6ed",
    image:
      "https://coin-images.coingecko.com/coins/images/35979/large/zkLend_ZEND_logo_square_transparent_background_%281%29.png?1710306648",
    current_price: 0.00006449,
    market_cap: 0,
    market_cap_rank: null,
    fully_diluted_valuation: null,
    total_volume: 126.125,
    high_24h: 0.00006684,
    low_24h: 0.00006204,
    price_change_24h: -0.000001654786468978,
    price_change_percentage_24h: -2.50183,
    market_cap_change_24h: 0,
    market_cap_change_percentage_24h: 0,
    circulating_supply: 0,
    total_supply: null,
    max_supply: 100000000,
    ath: 0.0009552,
    ath_change_percentage: -93.23297,
    ath_date: "2024-03-19T20:05:27.808Z",
    atl: 0.00005602,
    atl_change_percentage: 15.39308,
    atl_date: "2024-06-17T05:40:22.294Z",
    roi: null,
    last_updated: "2024-06-20T06:55:52.759Z",
  },
  {
    id: "black",
    symbol: "black",
    name: "Black",
    address:
      "0x3a6ec0b0ea7a1903329d5dec4bb574ecb4d6fdc206664e1c61eeded8158ab40",
    image:
      "https://coin-images.coingecko.com/coins/images/33769/large/blackLogo.png?1702968758",
    current_price: 9.21893e-10,
    market_cap: 0,
    market_cap_rank: null,
    fully_diluted_valuation: 9.218929,
    total_volume: 0.00121187,
    high_24h: 9.35217e-10,
    low_24h: 9.19151e-10,
    price_change_24h: -1.1517582e-11,
    price_change_percentage_24h: -1.23392,
    market_cap_change_24h: 0,
    market_cap_change_percentage_24h: 0,
    circulating_supply: 0,
    total_supply: 10000000000,
    max_supply: 10000000000,
    ath: 4.2841e-8,
    ath_change_percentage: -97.84808,
    ath_date: "2023-12-26T11:33:35.701Z",
    atl: 9.08797e-10,
    atl_change_percentage: 1.44097,
    atl_date: "2024-06-14T21:41:09.734Z",
    roi: null,
    last_updated: "2024-06-20T00:30:44.810Z",
  },
  {
    id: "ekubo-protocol",
    symbol: "ekubo",
    name: "Ekubo Protocol",
    address:
      "0x75afe6402ad5a5c20dd25e10ec3b3986acaa647b77e4ae24b0cbc9a54a27a87",
    image:
      "https://coin-images.coingecko.com/coins/images/37715/large/135474885.png?1715330450",
    current_price: 0.00024645,
    market_cap: 0,
    market_cap_rank: null,
    fully_diluted_valuation: 2464,
    total_volume: 37.974198,
    high_24h: 0.00027998,
    low_24h: 0.000225,
    price_change_24h: 0.00000125,
    price_change_percentage_24h: 0.50797,
    market_cap_change_24h: 0,
    market_cap_change_percentage_24h: 0,
    circulating_supply: 0,
    total_supply: 10000000,
    max_supply: 10000000,
    ath: 0.00073239,
    ath_change_percentage: -66.3863,
    ath_date: "2024-05-20T10:21:22.180Z",
    atl: 0.000225,
    atl_change_percentage: 9.41513,
    atl_date: "2024-06-19T13:10:11.865Z",
    roi: null,
    last_updated: "2024-06-20T06:52:51.028Z",
  },
  {
    id: "nostra",
    symbol: "nstr",
    name: "Nostra",
    address: "0xc530f2c0aa4c16a0806365b0898499fba372e5df7a7172dc6fe9ba777e8007",
    image:
      "https://coin-images.coingecko.com/coins/images/28282/large/Nostra_200x200.png?1696527282",
    current_price: 0.00002489,
    market_cap: 0,
    market_cap_rank: null,
    fully_diluted_valuation: 2487,
    total_volume: 139.238,
    high_24h: 0.00002532,
    low_24h: 0.00002376,
    price_change_24h: 0.00000111,
    price_change_percentage_24h: 4.65366,
    market_cap_change_24h: 0,
    market_cap_change_percentage_24h: 0,
    circulating_supply: 0,
    total_supply: 100000000,
    max_supply: null,
    ath: 0.00006344,
    ath_change_percentage: -60.99834,
    ath_date: "2024-06-13T19:04:18.654Z",
    atl: 0.00002299,
    atl_change_percentage: 7.62293,
    atl_date: "2024-06-17T21:02:21.854Z",
    roi: null,
    last_updated: "2024-06-20T06:55:12.632Z",
  },
  {
    id: "akamaru",
    symbol: "aku",
    name: "Akamaru",
    address:
      "0x0137dfca7d96cdd526d13a63176454f35c691f55837497448fad352643cfe4d4",
    image:
      "https://coin-images.coingecko.com/coins/images/33677/large/akulogofinal.png?1706623586",
    current_price: 4.969e-12,
    market_cap: 0,
    market_cap_rank: null,
    fully_diluted_valuation: 49.686718,
    total_volume: 0.030177,
    high_24h: 5.038e-12,
    low_24h: 4.946e-12,
    price_change_24h: -4.8168e-14,
    price_change_percentage_24h: -0.96013,
    market_cap_change_24h: 0,
    market_cap_change_percentage_24h: 0,
    circulating_supply: 0,
    total_supply: 10000000000000,
    max_supply: 10000000000000,
    ath: 7.40589e-10,
    ath_change_percentage: -99.32909,
    ath_date: "2024-04-08T01:19:00.566Z",
    atl: 4.768e-12,
    atl_change_percentage: 4.20217,
    atl_date: "2024-05-12T10:24:28.496Z",
    roi: null,
    last_updated: "2024-06-20T06:36:44.316Z",
  },
  {
    id: "starkpunks",
    symbol: "punk",
    name: "Starkpunks",
    address:
      "0x026e0852e1de834db3858b644270c52c4e0cab5be1da710751711c11b74eefed",
    image:
      "https://coin-images.coingecko.com/coins/images/34162/large/punktokenlogo.png.png?1704254490",
    current_price: null,
    market_cap: null,
    market_cap_rank: null,
    fully_diluted_valuation: null,
    total_volume: null,
    high_24h: null,
    low_24h: null,
    price_change_24h: null,
    price_change_percentage_24h: null,
    market_cap_change_24h: null,
    market_cap_change_percentage_24h: null,
    circulating_supply: null,
    total_supply: 139999999999999.83,
    max_supply: 139999999999999.83,
    ath: null,
    ath_change_percentage: 0,
    ath_date: null,
    atl: null,
    atl_change_percentage: 0,
    atl_date: null,
    roi: null,
    last_updated: null,
  },
];

/**
 * Script to filter tokens from fibrous list that fulfill the following conditions:
 * - has an imageUrl (either from the list, avnu or coingecko)
 * - has a swappable route with ETH (via fetchPrices)
 */
async function main() {
  const res = await fetch(FIBROUS_TOKEN_ENDPOINT);
  const tokens = await res.json();

  // add avnu tokens
  AVNU_OFFICIAL_TOKENS.forEach((token) => {
    tokens.unshift({
      address: token.address,
      imageUrl: token.logoUri,
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
    });
  });

  const numTokens = tokens.length;

  for (let i = 0; i < tokens.length; i++) {
    console.log(`Fetching token ${i + 1} of ${numTokens}`);

    const token = tokens[i];

    // Check if imageUrl is available
    let image = token.imageUrl;
    let address = token.address;

    // Check if token in coingecko list
    const coingeckoToken = COINGECKO_STARKNET_TOKENS.find(
      (x: any) => x.address.slice(-63) === token.address.slice(-63)
    );

    if (coingeckoToken) {
      image = coingeckoToken.image;
      address = coingeckoToken.address;
    }

    // Else, check if token in avnu list
    if (!image) {
      const avnuToken = AVNU_OFFICIAL_TOKENS.find(
        (x: any) => x.address.slice(-63) === token.address.slice(-63)
      );

      if (avnuToken) {
        image = avnuToken.logoUri;
        address = avnuToken.address;
      }
    }

    // Skip token if no image
    if (!image) continue;

    // Fetch ETH price for the token
    const ethPrice = await fetchPrices({
      sellTokenAddress: ETH_TOKEN_ADDRESS,
      buyTokenAddress: token.address,
      sellAmount: ONE, // 1
    });

    // Skip token if no price
    if (!ethPrice.length) continue;

    // Add token to the database
    try {
      await prisma.token.create({
        data: {
          address,
          name: token.name,
          symbol: token.symbol,
          decimals: token.decimals,
          imageUrl: image,
        },
      });

      console.log(`Token ${token.symbol} added to the database.`);
      console.log({
        address,
        name: token.name,
        symbol: token.symbol,
        decimals: token.decimals,
        imageUrl: image,
      });
    } catch (err) {
      console.error(err);
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
