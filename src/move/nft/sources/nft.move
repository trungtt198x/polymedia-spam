module nft::nft {

// === imports ===

use std::string::{utf8, String};
use iota::display::{Self};
use iota::package::{Self};
use iota::balance::{Self, Balance};
use iota::coin::{Coin};
use iota::event;
use spam::spam::{SPAM};

// === Errors ===

/// For when someone except of the related `AdminCap` tries to perform an operation.
const ENotEnoughPay: u64 = 1;

/// Not the rightful owner of the NFT.
const EAlreadyPaused: u64 = 2;

// === structs ===

public struct SpamNFT has key, store {
    id: UID,
    token_id: u64,
    image_url: String
}

public struct SpamNFTManager has key {
    id: UID,
    current_supply: u64,
    mint_price: u64, // price in SPAM with 4 decimals
    base_image_url: String, // base image URL for different NFT token images
    common_image_url: String, // one common image URL for all NFTs
    paused: bool,
    balance: Balance<SPAM>,
}

/// Module one-time witness
public struct NFT has drop {}

public struct AdminCap has key {
    id: UID
}

// === Events  ===

/// Event containing information about a newly minted NFT.
public struct EventMint has copy, drop {
    token_id: u64,
    image_url: String,
    mint_price: u64
}

// === initialization ===

fun init(otw: NFT, ctx: &mut TxContext)
{
    let keys = vector[
        utf8(b"name"),
        utf8(b"description"),
        utf8(b"image_url"),
    ];

    let values = vector[
        utf8(b"No. #{token_id}"),
        utf8(b"SPAM NFT Collection"),
        utf8(b"{image_url}"),
    ];

    // publisher
    let publisher = package::claim(otw, ctx);

    // display
    let mut disp = display::new_with_fields<SpamNFT>(
        &publisher, keys, values, ctx
    );
    display::update_version(&mut disp);

    // transfer objects to the sender
    transfer::public_transfer(publisher, ctx.sender());
    transfer::public_transfer(disp, ctx.sender());

    let admin_cap = AdminCap {
        id: object::new(ctx)
    };
    transfer::transfer(admin_cap, ctx.sender());

    // Create the `RebasedNftData` for keeping track of how many NFT's were
    // minted and who are the owners (for airdrops).
    let nft_manager = SpamNFTManager {
        id: object::new(ctx),
        current_supply: 0,
        mint_price: 1_000 * 10_000, // price in SPAM with 4 decimals
        base_image_url: utf8(b""),
        common_image_url: utf8(b""),
        paused: false,
        balance: balance::zero()
    };

    transfer::share_object(nft_manager);
}

public entry fun mint(
    nftManager: &mut SpamNFTManager,
    payment: Coin<SPAM>,
    ctx: &mut TxContext
) {
    assert!(nftManager.paused == false, EAlreadyPaused);

    let mint_price = nftManager.mint_price;
    let paid_amount = payment.value();
    assert!(paid_amount >= mint_price, ENotEnoughPay);
    nftManager.balance.join(payment.into_balance());

    let token_id = nftManager.current_supply + 1;

    let image_url = utf8(b"{nftManager.base_image_url}/{token_id}");
    let nft = SpamNFT {
        id: object::new(ctx),
        token_id: token_id,
        image_url: image_url,
    };

    // Transfer NFT to the sender
    transfer::public_transfer(nft, tx_context::sender(ctx));

    nftManager.current_supply = nftManager.current_supply + 1;

    event::emit(EventMint {
        token_id: token_id,
        image_url: image_url,
        mint_price: mint_price,
    });
}

/// User can only burn his own NFT
public entry fun burn(
    self: SpamNFT,
) {
    let SpamNFT { id, .. } = self;
    object::delete(id);
}

// === Admin control panel ===

public entry fun set_mint_price(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    mint_price: u64,
) {
    nftManager.mint_price = mint_price;
}

public entry fun set_base_image_url(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    base_image_url: String,
) {
    nftManager.base_image_url = base_image_url;
}

public entry fun set_common_image_url(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    common_image_url: String,
) {
    nftManager.common_image_url = common_image_url;
}

public entry fun set_paused(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    paused: bool,
) {
    nftManager.paused = paused;
}
}
