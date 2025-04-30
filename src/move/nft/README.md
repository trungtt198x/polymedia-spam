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
iota client call --package 0x28ee8a6f68044ed0015142a1b69dc22fdd4499476ed1347315b2eee0b6b36d44 \
                --module nft \
                --function set_base_image_url \
                --args 0x4491e941b6c5cc607f8566c322f22f98926cda8fd9c4a32505c77c11a1ca9727 0x43666e4269a1858ba6df02caf92032474e8aa00fa8ea38f6fbde244824bd3c87 https://some-base-url

```

where: - Package ID: 0x28ee8a6f68044ed0015142a1b69dc22fdd4499476ed1347315b2eee0b6b36d44 - AdminCap ID: 0x4491e941b6c5cc607f8566c322f22f98926cda8fd9c4a32505c77c11a1ca9727 - SpamNFTManager ID: 0x43666e4269a1858ba6df02caf92032474e8aa00fa8ea38f6fbde244824bd3c87

**Output:**

```
2vhqWx8hDnGTpyDXvG1hokcmEWejfbUjXVdu463sHF2N
```

### admin_mint

This is like the first mint as test

```
iota client call --package 0x28ee8a6f68044ed0015142a1b69dc22fdd4499476ed1347315b2eee0b6b36d44 \
                --module nft \
                --function admin_mint \
                --args 0x4491e941b6c5cc607f8566c322f22f98926cda8fd9c4a32505c77c11a1ca9727 0x43666e4269a1858ba6df02caf92032474e8aa00fa8ea38f6fbde244824bd3c87 0x17643f9ebc1d586d09a85a54a7ac732e0c8d7f9ada9261030536b7c86efa60d6 0xcd1ee6ea1011666c16c043b64caabc2fea7e9dd37ac3667613cfbfb129f97574

```

    - Package ID: 0x28ee8a6f68044ed0015142a1b69dc22fdd4499476ed1347315b2eee0b6b36d44
    - AdminCap ID: 0x4491e941b6c5cc607f8566c322f22f98926cda8fd9c4a32505c77c11a1ca9727
    - SpamNFTManager ID: 0x43666e4269a1858ba6df02caf92032474e8aa00fa8ea38f6fbde244824bd3c87
    - CustomMetadataRegistry: 0x17643f9ebc1d586d09a85a54a7ac732e0c8d7f9ada9261030536b7c86efa60d6
    - Recipient: 0xcd1ee6ea1011666c16c043b64caabc2fea7e9dd37ac3667613cfbfb129f97574

**Output:**

```
B7aEyodnMt5R2C9oQ69n9EFT83GAGiQ2Xu7Ei98iQh8Y
```
