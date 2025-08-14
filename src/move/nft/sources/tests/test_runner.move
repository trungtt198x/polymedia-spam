#[test_only]
module nft::test_runner {

    use iota::test_utils::{Self, assert_eq};
    use iota::test_scenario::{Self, Scenario};
    
    use iota::package::{Publisher};
    use iota::display::{Display};
    use std::string::{utf8, String};
    use iota::coin::{Coin};

    use spam::spam::{SPAM, Director};
    use nft::nft::{Self, SpamNFT, SpamNFTManager};
    use nft::custom_metadata_registry::{Self, AdminCap, Attribute, CustomMetadataRegistry, make_attr_list_list};

    const ADMIN: address = @0x12;
    const USER_1: address = @0x23;
    const WITHDRAW_TO_ADDR: address = @0x45;
    const WITHDRAW_TO_AMOUNT: u64 = 20_000 * 10_000; // 4 decimals
    const COIN_AMOUNT: u64 = 1_000_000 * 10_000; // 4 decimals

    public struct SpamCoinData {
        publisher: Publisher,
        display: Display<SpamNFT>,
        director: Director
    }

    public struct SpamNFTData {
        admin: AdminCap,
        nftManager: SpamNFTManager,
    }

    public struct TestRunner {
        scenario: Scenario,
        spam_coin_data: SpamCoinData,
        spam_nft_data: SpamNFTData,
        custom_metadata_reg: CustomMetadataRegistry,
    }

    /// Module one-time witness
    public struct TESTRUNNER has drop {}

    fun get_test_data(): (vector<vector<String>>, vector<vector<String>>) {
        let trait_type_list_list: vector<vector<String>> = vector[
            vector[
                utf8(b"some_trait_1"),
                utf8(b"another_trait_1"),
            ],
            vector[
                utf8(b"some_trait_2"),
                utf8(b"another_trait_2"),
            ],
            vector[
                utf8(b"some_trait_3"),
                utf8(b"another_trait_3"),
            ],
            vector[
                utf8(b"some_trait_4"),
                utf8(b"another_trait_4"),
            ]
        ];

        let value_list_list: vector<vector<String>> = vector[
            vector[
                utf8(b"some_value_1"),
                utf8(b"another_value_1"),
            ],
            vector[
                utf8(b"some_value_2"),
                utf8(b"another_value_2"),
            ],
            vector[
                utf8(b"some_value_3"),
                utf8(b"another_value_3"),
            ],
            vector[
                utf8(b"some_value_4"),
                utf8(b"another_value_4"),
            ]
        ];

        (trait_type_list_list, value_list_list)
    }

    fun mint_spam_coin(scenario_mut: &mut Scenario, receiver: address, amount: u64): Director {
        spam::spam::init_for_testing(scenario_mut.ctx());

        scenario_mut.next_tx(ADMIN);

        let mut director = scenario_mut.take_shared<Director>();

        let coin = spam::spam::mint_for_testing(&mut director, amount, scenario_mut.ctx());
        transfer::public_transfer(coin, receiver);

        // scenario_mut.return_to_sender(director);
        scenario_mut.next_tx(ADMIN);

        director
    }

    fun set_custom_metadata(_: &mut Scenario, custom_metadata_registry: &mut CustomMetadataRegistry, admin: &AdminCap,) {
        let token_id_list: vector<u64> = vector[1, 2, 3, 4];
        // let attributes_list: vector<vector<Attribute>> = vector[
        //     vector[
        //         make_attr(
        //             utf8(b"some_trait_1"),
        //             utf8(b"some_value_1"),
        //         ),
        //         make_attr(
        //             utf8(b"another_trait_1"),
        //             utf8(b"another_value_1"),
        //         ),
        //     ],
        //     vector[
        //         make_attr(
        //             utf8(b"some_trait_2"),
        //             utf8(b"some_value_2"),
        //         ),
        //         make_attr(
        //             utf8(b"another_trait_2"),
        //             utf8(b"another_value_2"),
        //         ),
        //     ],
        //     vector[
        //         make_attr(
        //             utf8(b"some_trait_3"),
        //             utf8(b"some_value_3"),
        //         ),
        //         make_attr(
        //             utf8(b"another_trait_3"),
        //             utf8(b"another_value_3"),
        //         ),
        //     ],
        //     vector[
        //         make_attr(
        //             utf8(b"some_trait_4"),
        //             utf8(b"some_value_4"),
        //         ),
        //         make_attr(
        //             utf8(b"another_trait_4"),
        //             utf8(b"another_value_4"),
        //         ),
        //     ],
        // ];

        let (trait_type_list_list, value_list_list) = get_test_data();

        let attributes_list: vector<vector<Attribute>> = make_attr_list_list(trait_type_list_list, value_list_list);

        let dna_list: vector<String> = vector[utf8(b"dna_1"), utf8(b"dna_2"), utf8(b"dna_3"), utf8(b"dna_4")];

        custom_metadata_registry.add_custom_metadata_many(admin, token_id_list, dna_list, &attributes_list);
    }

    public fun start(): TestRunner {
        let mut scenario = test_scenario::begin(ADMIN);

        let scenario_mut = &mut scenario;

        let director = mint_spam_coin(scenario_mut, USER_1, COIN_AMOUNT);

        nft::init_for_testing(scenario_mut.ctx());
        custom_metadata_registry::init_for_testing(scenario_mut.ctx());
        scenario_mut.next_tx(ADMIN);
        
        let publisher = scenario_mut.take_from_sender<Publisher>();
        let display = scenario_mut.take_from_sender<Display<SpamNFT>>();
        let mut nftManager = scenario_mut.take_shared<SpamNFTManager>();
        let admin = scenario_mut.take_from_sender<AdminCap>();
        let mut custom_metadata_reg = scenario_mut.take_shared<CustomMetadataRegistry>();

        // nft::set_common_image_url(&admin, &mut nftManager, utf8(b"https://www.iota.org"));
        nft::set_base_image_url(&admin, &mut nftManager, utf8(b"https://somewhere.com"));
        scenario_mut.next_tx(ADMIN);

        set_custom_metadata(scenario_mut, &mut custom_metadata_reg, &admin);
        scenario_mut.next_tx(ADMIN);

        TestRunner {
            scenario,
            spam_coin_data: SpamCoinData {
                publisher,
                display,
                director
            },
            spam_nft_data: SpamNFTData {
                admin,
                nftManager
            },
            custom_metadata_reg
        }
    }

    fun do_mint(
        self: &mut TestRunner,
        recipient: address, // USER_1
    ) {
        self.scenario.next_tx(recipient);
        let mut spam_coin = self.scenario.take_from_sender<Coin<SPAM>>();
        nft::mint(&mut spam_coin, &mut self.spam_nft_data.nftManager, &self.custom_metadata_reg,  recipient, self.scenario.ctx());
        self.scenario.next_tx(recipient);
        self.scenario.return_to_sender(spam_coin);
    }

    public fun mint(
        self: &mut TestRunner,
    ) {
        self.do_mint(USER_1);

        let minted_nft = self.scenario.take_from_sender<SpamNFT>();
        let token_id = minted_nft.token_id();
        let custom_metadata = self.custom_metadata_reg.get_custom_metadata(token_id);
        let attributes = custom_metadata.attributes();
        let dna = custom_metadata.dna();
        
        assert_eq(token_id, 1);
        assert_eq(attributes[0].trait_type(), utf8(b"some_trait_1"));
        assert_eq(attributes[0].value(), utf8(b"some_value_1"));
        assert_eq(attributes[1].trait_type(), utf8(b"another_trait_1"));
        assert_eq(attributes[1].value(), utf8(b"another_value_1"));
        assert_eq(dna, utf8(b"dna_1"));
        assert_eq(minted_nft.base_image_url(), utf8(b"https://somewhere.com"));
        assert_eq(minted_nft.common_image_url(), utf8(b""));
        assert_eq(self.spam_nft_data.nftManager.current_token_id(), 1);
        assert_eq(self.spam_nft_data.nftManager.total_supply(), 1);
        assert_eq(self.spam_nft_data.nftManager.max_supply(), 5_000);
        assert_eq(self.spam_nft_data.nftManager.mint_price(), 20_000 * 10_000);
        
        self.scenario.return_to_sender(minted_nft);
    }

    public fun mint_many_till_no_attrs(
        self: &mut TestRunner,
    ) {
        let count = 6;
        let mut i = 0;
        while (i < count) {
            self.do_mint(USER_1);
            i = i + 1;

            let minted_nft = self.scenario.take_from_sender<SpamNFT>();
            let token_id = minted_nft.token_id();
            assert_eq(token_id, i);
            self.scenario.return_to_sender(minted_nft);
        };

        let token_id = 5; // this token_id does not have custom metadata
        let custom_metadata = self.custom_metadata_reg.get_custom_metadata(token_id);
        let attributes = custom_metadata.attributes();
        let dna = custom_metadata.dna();
        
        assert_eq(attributes, vector::empty<Attribute>());
        assert_eq(dna, utf8(b""));
        assert_eq(self.spam_nft_data.nftManager.current_token_id(), count);
        assert_eq(self.spam_nft_data.nftManager.total_supply(), count);
    }

    public fun withdraw(
        self: &mut TestRunner,
    ) {
        self.do_mint(USER_1);

        self.scenario.next_tx(ADMIN);
        nft::withdraw(&self.spam_nft_data.admin, &mut self.spam_nft_data.nftManager, WITHDRAW_TO_ADDR, WITHDRAW_TO_AMOUNT, self.scenario.ctx());
    }

    public fun withdraw_all(
        self: &mut TestRunner,
    ) {
        self.do_mint(USER_1);

        self.scenario.next_tx(ADMIN);
        nft::withdraw_all(&self.spam_nft_data.admin, &mut self.spam_nft_data.nftManager, WITHDRAW_TO_ADDR, self.scenario.ctx());
    }

    public fun next_tx(self: &mut TestRunner): &mut TestRunner {
        self.scenario.next_tx(ADMIN);
        self
    }

    public fun ctx(self: &mut TestRunner): &mut TxContext {
        self.scenario.ctx()
    }

    public fun destroy<T>(self: &mut TestRunner, v: T): &mut TestRunner {
        test_utils::destroy(v);
        self
    }

    public fun end(self: TestRunner) {
        test_utils::destroy(self);
    }
}
