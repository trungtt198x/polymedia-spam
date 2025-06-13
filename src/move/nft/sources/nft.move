module nft::nft;

// === imports ===

use std::string::{utf8, String};
use iota::display::{Self};
use iota::package::{Self};
use iota::balance::{Self, Balance};
use iota::coin::{Self, Coin};
use iota::event;
use spam::spam::{SPAM};
use nft::custom_metadata_registry::{AdminCap, Attribute, CustomMetadataRegistry, CustomMetadata};

// === errors ===

/// For when someone except of the related `AdminCap` tries to perform an operation.
const ENotEnoughPay: u64 = 1;

/// Not the rightful owner of the NFT.
const EAlreadyPaused: u64 = 2;

/// Redeem is disabled.
const ERedeemDisabled: u64 = 3;

/// Max supply reached.
const EMaxSupplyReached: u64 = 4;

// === Constants ===

const MAX_SUPPLY: u64 = 5_000; // 5 thousands of NFTs
const MINT_PRICE: u64 = 20_000 * 10_000; // 20 thousands of SPAM coins (4 decimals)

// === structs ===

public struct SpamNFT has key, store {
    id: UID,
    token_id: u64,
    base_image_url: String,
    common_image_url: String,
    attributes: vector<Attribute>,
    dna: String,
}

public struct SpamNFTManager has key {
    id: UID,
    total_supply: u64,
    max_supply: u64,
    current_token_id: u64,
    burnt_tokens: vector<u64>, // holds the token IDs of the burnt NFTs
    mint_price: u64, // price in SPAM with 4 decimals
    redeem_percentage: u64, // percentage of the mint price to redeem
    base_image_url: String, // base image URL for different NFT token images
    common_image_url: String, // one common image URL for all NFTs
    paused: bool,
    balance: Balance<SPAM>,
}

/// Module one-time witness
public struct NFT has drop {}

// === Events  ===

public struct EventMint has copy, drop {
    token_id: u64,
    mint_price: u64,
    recipient: address
}

public struct EventRedeem has copy, drop {
    token_id: u64,
    redeem_price: u64,
    recipient: address
}

public struct EventBurn has copy, drop {
    token_id: u64,
}

public struct EventWithdraw has copy, drop {
    to: address,
    amount: u64
}

// === initialization ===

fun init(otw: NFT, ctx: &mut TxContext)
{
    let keys = vector[
        utf8(b"name"),
        utf8(b"description"),
        utf8(b"image_url"),
        utf8(b"edition"),
        utf8(b"compiler"),
    ];

    let values = vector[
        utf8(b"Spamrus #{token_id}"),
        utf8(b"Nuked walruses with nothing to lose. Spam IOTA. Stack SPAM. Mint the mayhem."),
        utf8(b"{base_image_url}/{token_id}.png"), // each NFT has its own image
        // utf8(b"{common_image_url}"), // all NFTs have the same image
        utf8(b"1"),
        utf8(b"HashLips Art Engine"),
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

    let nft_manager = SpamNFTManager {
        id: object::new(ctx),
        total_supply: 0,
        max_supply: MAX_SUPPLY, // zero means no max limit
        current_token_id: 0,
        burnt_tokens: vector[],
        mint_price: MINT_PRICE,
        redeem_percentage: 0, // 0 means disable or set to 80 for 80%
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
    customMetadataRegistry: &CustomMetadataRegistry,
    price: u64,
    to: address,
    ctx: &mut TxContext
) {
    assert!(nftManager.paused == false, EAlreadyPaused);
    assert!(nftManager.max_supply == 0 || nftManager.max_supply > nftManager.total_supply, EMaxSupplyReached);

    let token_id = nftManager.current_token_id + 1;

    let custom_metadata: CustomMetadata = customMetadataRegistry.get_custom_metadata(token_id);

    let nft = SpamNFT {
        id: object::new(ctx),
        token_id: token_id,
        base_image_url: nftManager.base_image_url,
        common_image_url: nftManager.common_image_url,
        attributes: custom_metadata.attributes(),
        dna: custom_metadata.dna(),
    };

    // Transfer NFT to the sender
    transfer::transfer(nft, to);

    nftManager.total_supply = nftManager.total_supply + 1;
    nftManager.current_token_id = token_id;

    event::emit(EventMint {
        token_id: token_id,
        mint_price: price,
        recipient: to,
    });
}

public entry fun admin_mint(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    customMetadataRegistry: &CustomMetadataRegistry,
    to: address,
    ctx: &mut TxContext
) {
    mint_and_transfer(nftManager, customMetadataRegistry, 0, to, ctx);
}

/// Can be used for airdrops
public entry fun admin_mint_many(
    _: &AdminCap,
    nftManager: &mut SpamNFTManager,
    customMetadataRegistry: &CustomMetadataRegistry,
    to_list: vector<address>,
    ctx: &mut TxContext
) {
    to_list.do_ref!(|to| {
        mint_and_transfer(nftManager, customMetadataRegistry, 0, *to, ctx);
    });
}

/// Mint a new NFT with the given payment.
public entry fun mint(
    payment: &mut Coin<SPAM>,
    nftManager: &mut SpamNFTManager,
    customMetadataRegistry: &CustomMetadataRegistry,
    to: address,
    ctx: &mut TxContext
) {
    let mint_price = nftManager.mint_price;
    let paid_amount = coin::value(payment);
    assert!(paid_amount >= mint_price, ENotEnoughPay);

    let fee = coin::split(payment, mint_price, ctx);
    nftManager.balance.join(fee.into_balance());

    mint_and_transfer(nftManager, customMetadataRegistry, mint_price, to, ctx);
}

fun burn(
    self: SpamNFT,
    nftManager: &mut SpamNFTManager,
) {
    let SpamNFT { id, token_id, .. } = self;
    object::delete(id);
    vector::push_back(&mut nftManager.burnt_tokens, token_id);
    nftManager.total_supply = nftManager.total_supply - 1;

    event::emit(EventBurn {
        token_id: token_id,
    });
}

/// User can burn his own NFT to redeem the SPAM coins.
public entry fun redeem(
    self: SpamNFT,
    nftManager: &mut SpamNFTManager,
    to: address,
    ctx: &mut TxContext
) {
    assert!(nftManager.redeem_percentage > 0, ERedeemDisabled);

    let token_id = self.token_id;

    // Burn NFT
    burn(self, nftManager);

    let redeem_price = nftManager.mint_price * nftManager.redeem_percentage / 100;

    let coin = coin::take(&mut nftManager.balance, redeem_price, ctx);
    transfer::public_transfer(coin, to);

    event::emit(EventRedeem {
        token_id: token_id,
        redeem_price: redeem_price,
        recipient: to,
    });
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
    redeem_percentage: u64, // e.g. 70 for 70% or set to 0 to disable
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

    event::emit(EventWithdraw {
        to: to,
        amount: amount,
    });
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

    event::emit(EventWithdraw {
        to: to,
        amount: amount,
    });
}

// === SpamNFT getters ===

public fun token_id(self: &SpamNFT): u64 {
    self.token_id
}

public fun base_image_url(self: &SpamNFT): String {
    self.base_image_url
}

public fun common_image_url(self: &SpamNFT): String {
    self.common_image_url
}

public fun attributes(self: &SpamNFT): vector<Attribute> {
    self.attributes
}

public fun dna(self: &SpamNFT): String {
    self.dna
}

// === SpamNFTManager getters ===

public fun total_supply(self: &SpamNFTManager): u64 {
    self.total_supply
}

public fun max_supply(self: &SpamNFTManager): u64 {
    self.max_supply
}

public fun current_token_id(self: &SpamNFTManager): u64 {
    self.current_token_id
}

public fun burnt_tokens(self: &SpamNFTManager): vector<u64> {
    self.burnt_tokens
}

public fun mint_price(self: &SpamNFTManager): u64 {
    self.mint_price
}

public fun redeem_percentage(self: &SpamNFTManager): u64 {
    self.redeem_percentage
}

public fun paused(self: &SpamNFTManager): bool {
    self.paused
}

public fun balance(self: &SpamNFTManager): &Balance<SPAM> {
    &self.balance
}

#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(NFT {}, ctx)
}
