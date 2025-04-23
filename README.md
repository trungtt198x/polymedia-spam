# Spam dApp

Spam dApp includes:

- Move contracts of SPAM coin and NFT mint in folder `move`
- ReactJS-based frontend in folder `web` and `sdk`
- Docker-based deployment utils in folder `docker`

## Introduction

$SPAM is a token distributed daily to active participants who engage in spamming activities. A total of 1 million $SPAM coins are minted every 24 hours and allocated based on spam volume.

No spam, no gain. Spam or be rekt.

### How it works

1. Start spamming.
2. Register counter within the next day. Otherwise accrued $SPAM is forfeited.
3. Claim $SPAM coins anytime after that.
4. Redeem $SPAM for NFTs.

### Getting started

1. Fund your Spam Bot Wallet.
2. Spam to Earn. The more you spam, the bigger your rewards.
3. Claim your earned $SPAM anytime.

## Configuration

Specified in the file `sdk/src/config.json`

## Installation

In the root folder, run this cmd `pnpm i`

## Build

In the root folder, run this cmd `pnpm build`

## Lint check or format

In the root folder, run this cmd `pnpm lint` or `pnpm format`

## Start frontend locally

In the root folder, run this cmd `pnpm dev`

## Deploy frontend with Docker

[See here](./docker/README.md)

## SPAM Move contract

### Logic

Single-writer `UserCounter` objects are used to track the number of txs sent by each user within one epoch.

When that epoch ends, the user registers their `UserCounter` in a shared `EpochCounter` object, so that the total number of txs in the previous epoch can be calculated.

After that next epoch (registration period) ends, users can mint SPAM coins in proportion to the number of txs they sent.

Key functions in the order they get called for any given `UserCounter`:

1. `new_user_counter`: user creates a `UserCounter` owned object for the current epoch (epoch N)
2. `increment_user_counter`: user sends txs to increase `UserCounter.tx_count`, until epoch N ends
3. `register_user_counter`: during epoch N+1, user registers their `UserCounter` in an `EpochCounter` shared object, which counts all txs in the epoch
4. `claim_user_counter`: from epoch N+2, users can mint SPAM coins in proportion to the number of txs they sent during epoch N

### Build, test and deploy

[See here](./src/move/spam/README.md)

## NFT Move contract

### Logic

Enable to consume $SPAM coins for minting the NFTs.

### Build, test and deploy

[See here](./src/move/nft/README.md)
