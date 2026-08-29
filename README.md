# Strata

A top down action game where your proven Ethereum history becomes your character.

Your real transactions are verified on Creditcoin through the Attestcoin Protocol and turned
into relics you carry into the dungeon. Every floor you descend is a real Ethereum block,
also proven, whose contents generate the level. Nothing in the game can be faked, including
by the people who built it.

Built for BUIDL CTC 2026, Gaming track.

## How it works

1. You connect an Ethereum wallet. It is only ever read, never written to.
2. Eight significant transactions are selected from your history.
3. Each one is verified on Creditcoin by the Block Prover precompile, decoded, and turned
   into a relic. Failed transactions become curses. Token mints become summons.
4. You equip three relics and descend.
5. Each floor proves a historical Ethereum block. The block's transaction count, gas used,
   and hash decide the rooms, difficulty, and layout.
6. Combat runs entirely in the browser. No transaction is signed while playing.
7. When you die, the run is written to an on chain ladder.

## Running it

```
npm install
cp .env.example .env
npm start
```

## Deploying the contracts

```
npm run compileContracts
npm run deployContracts
```

Testnet Creditcoin is required. Use the faucet linked in the Creditcoin documentation.

## Project layout

```
contracts/    Solidity contracts deployed to Creditcoin
scripts/      Deployment and proving scripts
src/types/    Type and interface declarations only
src/constants/  Tuning values and network addresses
src/rendering/  Sprite sheets, animation, tile drawing
src/game/     Game rules, combat, rooms, enemies
src/chain/    Wallet, proofs, contract calls
src/interface/  Screens outside the game canvas
src/styles/   Stylesheets, separated by concern
public/assets/  Sprite artwork
```

## Network

| Item | Value |
| --- | --- |
| Creditcoin testnet RPC | https://rpc.cc3-testnet.creditcoin.network |
| Proof builder | https://proof-gen-api.cc3-testnet.creditcoin.network |
| Block prover precompile | 0x0000000000000000000000000000000000000FD2 |
| Chain info precompile | 0x0000000000000000000000000000000000000fd3 |
| Transaction decoder | 0x731c345d79Fb8BbDC541f9DF3b6317585F849F9f |
| Ethereum mainnet chain key | 3 |

## Artwork

Pixel Crawler Free Pack by Anokolisa. Credit is not required by the licence but is given
here. The artwork may be used in commercial projects and may be altered. It may not be
resold as a product. The pack licence is included with the downloaded files.
