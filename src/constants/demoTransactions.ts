export interface DemoTransaction {
  transactionHash: string;
  eraName: string;
  year: number;
  expectedBlockNumber: number;
}

export const DEMO_WALLET_TRANSACTIONS: DemoTransaction[] = [
  {
    transactionHash: "0x5c504ed432cb51138bcf09aa5e8a410dd4a1e204ef84bfed1be16dfba1b22060",
    eraName: "Frontier",
    year: 2015,
    expectedBlockNumber: 46147
  },
  {
    transactionHash: "0x4677a93807b73a0875d3a292eacb450d0af0d6f0eec6f283f8ad927ec539a17b",
    eraName: "Homestead",
    year: 2016,
    expectedBlockNumber: 1920000
  },
  {
    transactionHash: "0x1421a887a02301ae127bf2cd4c006116053c9dc4a255e69ea403a2d77c346cf5",
    eraName: "Token boom",
    year: 2017,
    expectedBlockNumber: 4370000
  },
  {
    transactionHash: "0x219f8d919e90a665b0c36295021de39b76a75a014e8282027ad90a6eace33c2c",
    eraName: "The winter",
    year: 2018,
    expectedBlockNumber: 5102443
  },
  {
    transactionHash: "0xc2d018922e1d372a8e5cc6c9e11d66ad06dc97e2618061cd33d6ef100d1eca9f",
    eraName: "Maturing",
    year: 2019,
    expectedBlockNumber: 9000000
  },
  {
    transactionHash: "0xf56a4e0d9215be9526bfe1c5eb8f85346396c4de87c490967b00182da9a57de4",
    eraName: "Lending summer",
    year: 2020,
    expectedBlockNumber: 10800000
  },
  {
    transactionHash: "0x2ecd08e86079f08cfc27c326aa01b1c8d62f288d5961118056bac7da315f94d9",
    eraName: "The boom",
    year: 2021,
    expectedBlockNumber: 12965000
  },
  {
    transactionHash: "0x5ad934ee3bf2f8938d8518a3b978e81f178eaa21824ee52fef83338f786e7b59",
    eraName: "The merge",
    year: 2022,
    expectedBlockNumber: 15537394
  },
  {
    transactionHash: "0x20f83f863231a8e1c97f14d1b2e9379d389c57d3bb82d265cd6e5d806378ba9b",
    eraName: "Modern",
    year: 2024,
    expectedBlockNumber: 21000000
  }
];
