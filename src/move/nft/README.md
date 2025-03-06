# Move contracts

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

## Set common image URL

```
iota client call --package 0xb13e7cd92ce960d2be8b617d8667e1534086846dae0f420f49cc5551f0d6da7f \
                --module nft \
                --function set_common_image_url \
                --args 0x13fba29a4e50fef38d7da548a66638ae090b62d79d6dc70e9206b1c8e78d253e 0x6b4a953f5edf3ec68f62770e0409bbbffc6f14c88a4cd643dce7d34335cea7c5 https://d315pvdvxi2gex.cloudfront.net/d96a337f84c5c900f31e08808.png

```

where:
    - Package ID: 0xb13e7cd92ce960d2be8b617d8667e1534086846dae0f420f49cc5551f0d6da7f
    - AdminCap ID: 0x13fba29a4e50fef38d7da548a66638ae090b62d79d6dc70e9206b1c8e78d253e
    - SpamNFTManager ID: 0x6b4a953f5edf3ec68f62770e0409bbbffc6f14c88a4cd643dce7d34335cea7c5

## admin_mint

```
iota client call --package 0xb13e7cd92ce960d2be8b617d8667e1534086846dae0f420f49cc5551f0d6da7f \
                --module nft \
                --function admin_mint \
                --args 0x13fba29a4e50fef38d7da548a66638ae090b62d79d6dc70e9206b1c8e78d253e 0x6b4a953f5edf3ec68f62770e0409bbbffc6f14c88a4cd643dce7d34335cea7c5 0xcd1ee6ea1011666c16c043b64caabc2fea7e9dd37ac3667613cfbfb129f97574

```

    - Package ID: 0xb13e7cd92ce960d2be8b617d8667e1534086846dae0f420f49cc5551f0d6da7f
    - AdminCap ID: 0x13fba29a4e50fef38d7da548a66638ae090b62d79d6dc70e9206b1c8e78d253e
    - SpamNFTManager ID: 0x6b4a953f5edf3ec68f62770e0409bbbffc6f14c88a4cd643dce7d34335cea7c5

## mint

```
iota client call --package 0xb13e7cd92ce960d2be8b617d8667e1534086846dae0f420f49cc5551f0d6da7f --module nft --function mint --args 0xc0439a5c7119e86550e5069cff68c3c5abb075018be13f759decd61df86447aa 0x6b4a953f5edf3ec68f62770e0409bbbffc6f14c88a4cd643dce7d34335cea7c5 0xcd1ee6ea1011666c16c043b64caabc2fea7e9dd37ac3667613cfbfb129f97574 --type-args "0x2::coin::Coin<0xec280f73ebbb360d74d965066cdfdf712ec9074d95340c99b5842bf28379f745::spam::SPAM>"

```

always got the below error despite it works well on the explorer.rebased.iota.org

```
VMVerificationOrDeserializationError
```

where:
    - Package ID: 0xb13e7cd92ce960d2be8b617d8667e1534086846dae0f420f49cc5551f0d6da7f
    - SpamNFTManager ID: 0x6b4a953f5edf3ec68f62770e0409bbbffc6f14c88a4cd643dce7d34335cea7c5

