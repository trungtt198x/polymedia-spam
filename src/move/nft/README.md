# NFT Move contracts

## Build

```
rm -rf build Move.lock
iota move build
```

## Run test

```
iota move test
```

## Deploy/publish

**Notice**

Check/edit the `spam` (which is the deployed spam package address) in `Move.toml`

```
iota client publish
```

**After that**, must `Set base image URL` as below.

## Mainnet

### Set base image URL

This is mandatory for the NFTs to have own image.

**After that**, must upload metadata by following the `../script/README.md`.

```
iota client call --package 0xc76cfa070e7d78b247514f6b8180fe46edeb6a180d0357cb1b2cdea1c0bd5d3d \
                --module nft \
                --function set_base_image_url \
                --args 0xa38897c4dfbd712c6191255749ee02dada34a65cba00f5bb8ac80c37b332470f 0xb7393b6604a78c83fa1b9613ce227d8abc4b34cb4ec4c5442f428048c7892083 https://images.iotaspam.io

```

where:

- Package ID: 0xc76cfa070e7d78b247514f6b8180fe46edeb6a180d0357cb1b2cdea1c0bd5d3d
- AdminCap ID: 0xa38897c4dfbd712c6191255749ee02dada34a65cba00f5bb8ac80c37b332470f
- SpamNFTManager ID: 0xb7393b6604a78c83fa1b9613ce227d8abc4b34cb4ec4c5442f428048c7892083

**Output:**

```
Bb6zxkhvC7CqDUrk86bjS6AnD6fqLq8sUziRmeFVuUFc
```

## Testnet

### Set base image URL

This is mandatory for the NFTs to have own image.

**After that**, must upload metadata by following the `../script/README.md`.

```
iota client call --package 0x5704fcd6a5fba12b310d70ec906fa0384459bf460f9b14004160549b64595a3a \
                --module nft \
                --function set_base_image_url \
                --args 0xb23d74ee432a58558d1f971ae7c201d1bab5568e80d6d1773c4a3cede28f4c16 0xe32c67c5fb2346d2a3f3352e5666e61e86c3f4587e25063ff2c967502603bad8 https://images.iotaspam.io

```

where:

- Package ID: 0x5704fcd6a5fba12b310d70ec906fa0384459bf460f9b14004160549b64595a3a
- AdminCap ID: 0xb23d74ee432a58558d1f971ae7c201d1bab5568e80d6d1773c4a3cede28f4c16
- SpamNFTManager ID: 0xe32c67c5fb2346d2a3f3352e5666e61e86c3f4587e25063ff2c967502603bad8

**Output:**

```
4PVKiZJ5aCpSu3V2aXs2PGr6J7UvD5ULtgXL51CE18aL
```

### admin_mint

This is like the first mint as test

```
iota client call --package 0x5704fcd6a5fba12b310d70ec906fa0384459bf460f9b14004160549b64595a3a \
                --module nft \
                --function admin_mint \
                --args 0xb23d74ee432a58558d1f971ae7c201d1bab5568e80d6d1773c4a3cede28f4c16 0xe32c67c5fb2346d2a3f3352e5666e61e86c3f4587e25063ff2c967502603bad8 0xc325cea7fa1a72ec000b3b336f33054eb3cbbee1b75d4b5f98008248dfc3ea05 0xcd1ee6ea1011666c16c043b64caabc2fea7e9dd37ac3667613cfbfb129f97574

```

    - Package ID: 0x5704fcd6a5fba12b310d70ec906fa0384459bf460f9b14004160549b64595a3a
    - AdminCap ID: 0xb23d74ee432a58558d1f971ae7c201d1bab5568e80d6d1773c4a3cede28f4c16
    - SpamNFTManager ID: 0xe32c67c5fb2346d2a3f3352e5666e61e86c3f4587e25063ff2c967502603bad8
    - CustomMetadataRegistry: 0xc325cea7fa1a72ec000b3b336f33054eb3cbbee1b75d4b5f98008248dfc3ea05
    - Recipient: 0xcd1ee6ea1011666c16c043b64caabc2fea7e9dd37ac3667613cfbfb129f97574

**Output:**

```
H2xc19iQBCCm69GUz3zVrgxJkuLA88AR2ZUNKepLgPsv
```
