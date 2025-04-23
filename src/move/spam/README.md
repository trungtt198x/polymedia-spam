# SPAM Move contracts

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

## Unpause

Only needed if "paused" is set to true during init()

```
iota client call --package 0xcec07f5d0e41a7c834a9559de98eeaabcc8f7fd57cbb178bcf676d9857879a7c \
                --module spam \
                --function admin_resume \
                --args 0x2bca86c4449546b851bfffe7a1ef5fcb68098142ba5f6e91314c3c350d1b2cd0 0x0348cf2b522892e1a0f1c38ec8a28ab00be39661375547a8f6cbc072b52f9894

```

where: - Package ID: 0xcec07f5d0e41a7c834a9559de98eeaabcc8f7fd57cbb178bcf676d9857879a7c - Director obj ID: 0x2bca86c4449546b851bfffe7a1ef5fcb68098142ba5f6e91314c3c350d1b2cd0 - AdminCap ID: 0x0348cf2b522892e1a0f1c38ec8a28ab00be39661375547a8f6cbc072b52f9894
