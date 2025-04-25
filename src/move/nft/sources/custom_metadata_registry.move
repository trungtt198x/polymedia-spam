module nft::custom_metadata_registry;

// === imports ===

use iota::table::{Self, Table};
use std::string::{String};
use iota::package::{Self};

// === errors ===

const EInvalidLength: u64 = 0;

// === structs ===

/// Module one-time witness
public struct CUSTOM_METADATA_REGISTRY has drop {}

public struct AdminCap has key {
    id: UID
}

#[allow(unused_field)]
public struct Attribute has copy, drop, store {
    trait_type: String,
    value: String,
}

public struct CustomMetadata has copy, drop, store {
    attributes: vector<Attribute>,
    dna: String,
}

/// Registry storing custom metadata (tokenID => CustomMetadata)
public struct CustomMetadataRegistry has key {
    id: UID,
    table: Table<u64, CustomMetadata>,
}

// === initialization ===

fun init(otw: CUSTOM_METADATA_REGISTRY, ctx: &mut TxContext) {
    // publisher
    let publisher = package::claim(otw, ctx);
    transfer::public_transfer(publisher, ctx.sender());

    let admin_cap = AdminCap {
        id: object::new(ctx)
    };
    transfer::transfer(admin_cap, ctx.sender());

    let custom_metadata_registry = CustomMetadataRegistry {
        id: object::new(ctx),
        table: table::new(ctx),
    };
    transfer::share_object(custom_metadata_registry);
}

public fun make_attr(trait_type: String, value: String): Attribute {
    Attribute { trait_type, value }
}

public fun add_custom_metadata(
    custom_metadata_registry: &mut CustomMetadataRegistry,
    _: &AdminCap,
    token_id: u64,
    dna: String,
    attributes: vector<Attribute>,
) {
    let meta = CustomMetadata {
        dna,
        attributes,
    };
    table::add(&mut custom_metadata_registry.table, token_id, meta);
}

public fun add_custom_metadata_many(
    custom_metadata_registry: &mut CustomMetadataRegistry,
    _: &AdminCap,
    token_id_list: vector<u64>,
    dna_list: vector<String>,
    attributes_list: &vector<vector<Attribute>>,
) {
    assert!(vector::length(&token_id_list) == vector::length(&dna_list), EInvalidLength);
    assert!(vector::length(&token_id_list) == vector::length(attributes_list), EInvalidLength);

    let len = vector::length(&token_id_list);
    let mut i = 0;
    while (i < len) {
        let meta = CustomMetadata {
            dna: *vector::borrow(&dna_list, i),
            attributes: *vector::borrow(attributes_list, i),
        };
        table::add(&mut custom_metadata_registry.table, *vector::borrow(&token_id_list, i), meta);
        i = i + 1;
    }
}

/// Get custom metadata for a given token ID
public fun get_custom_metadata(
    self: &CustomMetadataRegistry,
    token_id: u64,
): CustomMetadata {
    // The borrow() will abort if the token_id is not found in the table
    let meta = *table::borrow(&self.table, token_id);
    meta
}

public fun attributes(self: &CustomMetadata): vector<Attribute> {
    self.attributes
}

public fun dna(self: &CustomMetadata): String {
    self.dna
}

#[test_only]
public fun init_for_testing(ctx: &mut TxContext) {
    init(CUSTOM_METADATA_REGISTRY {}, ctx)
}