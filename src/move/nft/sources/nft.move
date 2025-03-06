module nft::nft;

// === imports ===

use std::string::{utf8, String};
use iota::display::{Self};
use iota::package::{Self};
use iota::balance::{Self, Balance};
use iota::coin::{Self, Coin};
use iota::event;
use spam::spam::{SPAM};

// === errors ===

/// For when someone except of the related `AdminCap` tries to perform an operation.
const ENotEnoughPay: u64 = 1;

/// Not the rightful owner of the NFT.
const EAlreadyPaused: u64 = 2;

/// Redeem is disabled.
const ERedeemDisabled: u64 = 3;

// === structs ===

public struct SpamNFT has key, store {
    id: UID,
    token_id: u64,
    base_image_url: String,
    common_image_url: String
}

public struct SpamNFTManager has key {
    id: UID,
    current_supply: u64,
    max_supply: u64,
    mint_price: u64, // price in SPAM with 4 decimals
    redeem_percentage: u64, // percentage of the mint price to redeem
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
        utf8(b"Token #{token_id}"),
        utf8(b"SPAM NFT Collection"),
        // utf8(b"{base_image_url}/{token_id}.png"),
        utf8(b"{common_image_url}"),
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

    let nft_manager = SpamNFTManager {
        id: object::new(ctx),
        current_supply: 0,
        max_supply: 0, // zero means no max limit
        mint_price: 1_000 * 10_000, // price in SPAM with 4 decimals
        redeem_percentage: 80, // 80%
        base_image_url: utf8(b""),
        common_image_url: utf8(b""),
        paused: false,
        balance: balance::zero()
    };
    transfer::share_object(nft_manager);
}

#[allow(lint(self_transfer))]
fun mint_and_transfer(
    nftManager: &mut SpamNFTManager,
    price: u64,
    to: address,
    ctx: &mut TxContext
) {
    assert!(nftManager.paused == false, EAlreadyPaused);
    assert!(nftManager.max_supply == 0 || nftManager.max_supply > nftManager.current_supply, EAlreadyPaused);

    let token_id = nftManager.current_supply + 1;

    let nft = SpamNFT {
        id: object::new(ctx),
        token_id: token_id,
        base_image_url: nftManager.base_image_url,
        common_image_url: nftManager.common_image_url,
    };

    // Transfer NFT to the sender
    transfer::public_transfer(nft, to);

    nftManager.current_supply = nftManager.current_supply + 1;

    event::emit(EventMint {
        token_id: token_id,
        mint_price: price,
    });
}

public entry fun admin_mint(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    to: address,
    ctx: &mut TxContext
) {
    mint_and_transfer(nftManager, 0, to, ctx);
}

/// Can be used for airdrops
public entry fun admin_mint_many(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    to_list: vector<address>,
    ctx: &mut TxContext
) {
    to_list.do_ref!(|to| {
        mint_and_transfer(nftManager, 0, *to, ctx);
    });
}

/// Mint a new NFT with the given payment.
public entry fun mint(
    payment: &mut Coin<SPAM>,
    nftManager: &mut SpamNFTManager,
    to: address,
    ctx: &mut TxContext
) {
    let mint_price = nftManager.mint_price;
    let paid_amount = coin::value(payment);
    assert!(paid_amount >= mint_price, ENotEnoughPay);

    let fee = coin::split(payment, mint_price, ctx);
    nftManager.balance.join(fee.into_balance());

    mint_and_transfer(nftManager, mint_price, to, ctx);
}

/// User can burn his own NFT to redeem the SPAM coins.
public entry fun redeem(
    self: SpamNFT,
    nftManager: &mut SpamNFTManager,
    to: address,
    ctx: &mut TxContext
) {
    assert!(nftManager.redeem_percentage > 0, ERedeemDisabled);

    // Burn NFT
    let SpamNFT { id, .. } = self;
    object::delete(id);

    let redeem_amount = nftManager.mint_price * nftManager.redeem_percentage / 100;

    let coin = coin::take(&mut nftManager.balance, redeem_amount, ctx);
    transfer::public_transfer(coin, to);
}

// === Admin control panel ===

public entry fun set_mint_price(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    mint_price: u64,
) {
    nftManager.mint_price = mint_price;
}

public entry fun set_redeem_percentage(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    redeem_percentage: u64, // e.g. 70 for 70%
) {
    nftManager.redeem_percentage = redeem_percentage;
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

public entry fun set_max_supply(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    max_supply: u64,
) {
    nftManager.max_supply = max_supply;
}

/// Withdraw SPAM coins for the given amount
public entry fun withdraw(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    to: address,
    amount: u64,
    ctx: &mut TxContext
) {
    let coin = coin::take(&mut nftManager.balance, amount, ctx);
    transfer::public_transfer(coin, to);
}

/// Withdraw SPAM coins for the given amount
public entry fun withdraw_all(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    to: address,
    ctx: &mut TxContext
) {
    let amount = balance::value(&nftManager.balance);
    let coin = coin::take(&mut nftManager.balance, amount, ctx);
    transfer::public_transfer(coin, to);
}
