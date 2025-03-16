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

## Unpause

```
iota client call --package 0xec280f73ebbb360d74d965066cdfdf712ec9074d95340c99b5842bf28379f745 \
                --module spam \
                --function admin_resume \
                --args 0xc7dc8c06d28f77770bc4e84ac6fb14c82b4ac0cccd8198a59e71069dc1c3e418 0x7343bcdde0cbf6efbd48e5a7427530243e1bdaf1442e1e2249513f127147305c

```

where: - Package ID: 0xec280f73ebbb360d74d965066cdfdf712ec9074d95340c99b5842bf28379f745 - Director obj ID: 0xc7dc8c06d28f77770bc4e84ac6fb14c82b4ac0cccd8198a59e71069dc1c3e418 - AdminCap ID: 0x7343bcdde0cbf6efbd48e5a7427530243e1bdaf1442e1e2249513f127147305c
