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
iota client call --package 0xdda043377e261c6d2d4d1ffdb42454b8bb183690028954cc0acf82c424378e3c \
                --module nft \
                --function set_base_image_url \
                --args 0x14018fc90d9069a98b66a42da5213eb83a4d58b603c2e61415ade488305d122b 0x196ce1ec9819e5f8e45a5a26d04ba01cc05f218540a8d8e97375df18b25ead2e https://some-base-url

```

where: - Package ID: 0xdda043377e261c6d2d4d1ffdb42454b8bb183690028954cc0acf82c424378e3c - AdminCap ID: 0x14018fc90d9069a98b66a42da5213eb83a4d58b603c2e61415ade488305d122b - SpamNFTManager ID: 0x196ce1ec9819e5f8e45a5a26d04ba01cc05f218540a8d8e97375df18b25ead2e

**Output:**

```
2vhqWx8hDnGTpyDXvG1hokcmEWejfbUjXVdu463sHF2N
```

### admin_mint

This is like the first mint as test

```
iota client call --package 0xdda043377e261c6d2d4d1ffdb42454b8bb183690028954cc0acf82c424378e3c \
                --module nft \
                --function admin_mint \
                --args 0x14018fc90d9069a98b66a42da5213eb83a4d58b603c2e61415ade488305d122b 0x196ce1ec9819e5f8e45a5a26d04ba01cc05f218540a8d8e97375df18b25ead2e 0x8873edc0be3e7dbfc33dc7487a9653f0b4cadad13259dada3995db7309458697 0xcd1ee6ea1011666c16c043b64caabc2fea7e9dd37ac3667613cfbfb129f97574

```

    - Package ID: 0xdda043377e261c6d2d4d1ffdb42454b8bb183690028954cc0acf82c424378e3c
    - AdminCap ID: 0x14018fc90d9069a98b66a42da5213eb83a4d58b603c2e61415ade488305d122b
    - SpamNFTManager ID: 0x196ce1ec9819e5f8e45a5a26d04ba01cc05f218540a8d8e97375df18b25ead2e
    - CustomMetadataRegistry: 0x8873edc0be3e7dbfc33dc7487a9653f0b4cadad13259dada3995db7309458697
    - Recipient: 0xcd1ee6ea1011666c16c043b64caabc2fea7e9dd37ac3667613cfbfb129f97574

**Output:**

```
B7aEyodnMt5R2C9oQ69n9EFT83GAGiQ2Xu7Ei98iQh8Y
```