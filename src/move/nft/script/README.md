# Utils script

Utils script to set custom metadata for NFT collection from a provided folder.

## Install

Run this cmd: `npm i`

## Config

 - Copy the `.env.example` to `.env` and edit accordingly

 - Check the JSON files as data source in the folder `./data`. All those files will be taken into account. Max number of files per run should be `200`. After that, can replace with new files.

## Set metadata

Run this cmd: `npm run set-metadata`

**Example log output on mainnet**

For the first `200` NFT tokens

```
> node setCustomMetadata.js

readData - tokens:  200
readData - token_id_list:  [
  '1',   '10',  '101', '100', '102', '103', '104', '105',
  '106', '107', '108', '109', '11',  '110', '111', '113',
  '112', '114', '115', '116', '117', '118', '120', '12',
  '122', '123', '119', '124', '121', '125', '126', '127',
  '128', '13',  '130', '131', '129', '133', '132', '134',
  '135', '136', '139', '137', '140', '141', '142', '143',
  '144', '145', '146', '147', '148', '138', '149', '150',
  '15',  '152', '153', '154', '155', '151', '156', '158',
  '157', '159', '16',  '161', '160', '162', '163', '165',
  '164', '166', '167', '168', '169', '17',  '170', '172',
  '171', '173', '175', '174', '176', '177', '178', '179',
  '18',  '182', '184', '183', '185', '186', '180', '187',
  '188', '189', '19',  '190',
  ... 100 more items
]
Sender: 0xd3906909a7bfc50ea9f4c0772a75bc99cd0da938c90ec05a556de1b5407bd639
Result: {
  digest: 'DM5hWW66uErvF2Hwvz1zVkNVWrNKfFam3mAzG3AvRSw2',
  confirmedLocalExecution: false
}
```

**Example log output on testnet**

```
> node setCustomMetadata.js

readData - tokens:  200
readData - token_id_list:  [
  '100', '1',   '101', '10',  '102', '104', '103', '105',
  '106', '108', '107', '109', '11',  '110', '111', '113',
  '114', '116', '117', '118', '115', '112', '119', '12',
  '121', '120', '122', '123', '124', '126', '127', '128',
  '129', '13',  '130', '131', '132', '133', '125', '134',
  '136', '137', '140', '141', '142', '143', '135', '144',
  '145', '146', '139', '147', '148', '149', '150', '151',
  '152', '154', '153', '156', '158', '14',  '157', '16',
  '160', '138', '159', '161', '15',  '163', '162', '164',
  '165', '167', '166', '168', '171', '170', '172', '173',
  '174', '175', '177', '176', '179', '155', '178', '180',
  '169', '181', '184', '182', '183', '185', '186', '187',
  '188', '189', '190', '192',
  ... 100 more items
]
Sender: 0xd3906909a7bfc50ea9f4c0772a75bc99cd0da938c90ec05a556de1b5407bd639
Result: {
  digest: '9v2a2t1iHnkYaZwzBRoJkMV8wfLe8PPSQfHojW9X5gdf',
  confirmedLocalExecution: false
}
```

## View metadata

Run this cmd: `npm run view-metadata`

**Example output on mainnet**

```
> node viewCustomMetadata.js

tokenId: 200
returnType: 0xc76cfa070e7d78b247514f6b8180fe46edeb6a180d0357cb1b2cdea1c0bd5d3d::custom_metadata_registry::CustomMetadata
customMetadata: {
  attributes: [
    { trait_type: 'Background', value: 'Gradient' },
    { trait_type: 'Skin', value: 'Marine' },
    { trait_type: 'Clothes', value: 'Anchor' },
    { trait_type: 'Tusks', value: 'Vampire' },
    { trait_type: 'Mouth', value: 'Bone' },
    { trait_type: 'Eyes', value: 'Squeezed' },
    { trait_type: 'Head', value: 'Graduate' }
  ],
  dna: 'b5b80051405bff0a707cdfd4489377f6f8ce72cb'
}
```

**Example output on testnet**

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
