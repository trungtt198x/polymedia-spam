# Utils script

Utils script to set custom metadata for NFT collection from a provided folder.

## Install

Run this cmd: `npm i`

## Config

Copy the `.env.example` to `.env` and edit accordingly

## Set metadata

Run this cmd: `npm run set-metadata`

**Example tx**

```
6b9s9UmKvyRuDrfN4rxw7usDpARjQd1TH9cvgRYynFhz
```

## View metadata

Run this cmd: `npm run view-metadata`

**Example output**

```
tokenId: 2
returnType: 0xdca358082725e951b887508b6a17faacbcd5c2bfd4982d2542d984c85435c07c::custom_metadata_registry::CustomMetadata
customMetadata: {
  attributes: [
    { trait_type: 'Background', value: 'Yellow' },
    { trait_type: 'Skin', value: 'Blue' },
    { trait_type: 'Clothes', value: 'Raincoat' },
    { trait_type: 'Tusks', value: 'Stone' },
    { trait_type: 'Mouth', value: 'Dummy' },
    { trait_type: 'Eyes', value: 'Disappointment' },
    { trait_type: 'Head', value: 'Turtle shell green' }
  ],
  dna: 'c52d88d48bcd271124aa5c6caad9996f358780e4'
}
```
