#[test_only]
module nft::test_runner {

    use iota::test_utils::{Self};
    use iota::test_scenario::{Self, Scenario};
    
    use iota::package::{Publisher};
    use iota::display::{Display};
    use std::string::{utf8, String};
    use iota::coin::{Coin};

    use spam::spam::{SPAM, Director};
    use nft::nft::{Self, SpamNFT, SpamNFTManager};
    use nft::custom_metadata_registry::{Self, AdminCap, Attribute, CustomMetadataRegistry, make_attr};

    const ADMIN: address = @0x12;
    const USER_1: address = @0x23;
    const COIN_AMOUNT: u64 = 1_000_000 * 10_000;

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
        let attributes_list: vector<vector<Attribute>> = vector[
            vector[
                make_attr(
                    utf8(b"some_trait_1"),
                    utf8(b"some_value_1"),
                ),
                make_attr(
                    utf8(b"another_trait_1"),
                    utf8(b"another_value_1"),
                ),
            ],
            vector[
                make_attr(
                    utf8(b"some_trait_2"),
                    utf8(b"some_value_2"),
                ),
                make_attr(
                    utf8(b"another_trait_2"),
                    utf8(b"another_value_2"),
                ),
            ],
            vector[
                make_attr(
                    utf8(b"some_trait_3"),
                    utf8(b"some_value_3"),
                ),
                make_attr(
                    utf8(b"another_trait_3"),
                    utf8(b"another_value_3"),
                ),
            ],
            vector[
                make_attr(
                    utf8(b"some_trait_4"),
                    utf8(b"some_value_4"),
                ),
                make_attr(
                    utf8(b"another_trait_4"),
                    utf8(b"another_value_4"),
                ),
            ],
        ];
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

    public fun mint(
        self: &mut TestRunner,
    ) {
        self.scenario.next_tx(USER_1);
        let mut spam_coin = self.scenario.take_from_sender<Coin<SPAM>>();
        nft::mint(&mut spam_coin, &mut self.spam_nft_data.nftManager, &self.custom_metadata_reg,  USER_1, self.scenario.ctx());
        self.scenario.return_to_sender(spam_coin);
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
