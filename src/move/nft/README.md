# NFT Move contracts

## Build

```
iota move build
```

## Run test

```
iota move test
```

## Deploy/publish

```
iota client publish
```

## Testnet

### Set base image URL

This is mandatory for the NFTs to have own image.

```
iota client call --package 0xdca358082725e951b887508b6a17faacbcd5c2bfd4982d2542d984c85435c07c \
                --module nft \
                --function set_base_image_url \
                --args 0x9cb07d7ff339479e8aaf612892cbcf721ee12aa822e3d3637d70aeb93b2fa72a 0x6656e65116f2d636af8292168d34f6d4a6ec18c50f510cb711a7aabde7ae2d9b https://some-base-url

```

where: - Package ID: 0xdca358082725e951b887508b6a17faacbcd5c2bfd4982d2542d984c85435c07c - AdminCap ID: 0x9cb07d7ff339479e8aaf612892cbcf721ee12aa822e3d3637d70aeb93b2fa72a - SpamNFTManager ID: 0x6656e65116f2d636af8292168d34f6d4a6ec18c50f510cb711a7aabde7ae2d9b

**Output:**

```
2txa1AdnEhCu5ZUkjZtBM88TTzYsRJauMbvQrqHeNr55
```

### admin_mint

This is like the first mint as test

```
iota client call --package 0xdca358082725e951b887508b6a17faacbcd5c2bfd4982d2542d984c85435c07c \
                --module nft \
                --function admin_mint \
                --args 0x9cb07d7ff339479e8aaf612892cbcf721ee12aa822e3d3637d70aeb93b2fa72a 0x6656e65116f2d636af8292168d34f6d4a6ec18c50f510cb711a7aabde7ae2d9b 0xc325cea7fa1a72ec000b3b336f33054eb3cbbee1b75d4b5f98008248dfc3ea05 0xcd1ee6ea1011666c16c043b64caabc2fea7e9dd37ac3667613cfbfb129f97574

```

    - Package ID: 0xdca358082725e951b887508b6a17faacbcd5c2bfd4982d2542d984c85435c07c
    - AdminCap ID: 0x9cb07d7ff339479e8aaf612892cbcf721ee12aa822e3d3637d70aeb93b2fa72a
    - SpamNFTManager ID: 0x6656e65116f2d636af8292168d34f6d4a6ec18c50f510cb711a7aabde7ae2d9b
    - CustomMetadataRegistry: 0xc325cea7fa1a72ec000b3b336f33054eb3cbbee1b75d4b5f98008248dfc3ea05
    - Recipient: 0xcd1ee6ea1011666c16c043b64caabc2fea7e9dd37ac3667613cfbfb129f97574

**Output:**

```
H2xc19iQBCCm69GUz3zVrgxJkuLA88AR2ZUNKepLgPsv
```
