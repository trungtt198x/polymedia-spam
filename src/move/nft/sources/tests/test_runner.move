#[test_only]
module nft::test_runner {

    use iota::test_utils::{Self};
    use iota::test_scenario::{Self, Scenario};
    
    use iota::package::{Publisher};
    use iota::display::{Display};
    use std::string::{utf8};
    use iota::coin::{Coin};

    use spam::spam::{SPAM, Director};
    use nft::nft::{SpamNFT, AdminCap, SpamNFTManager};

    const ADMIN: address = @0x12;
    const USER_1: address = @0x23;
    const COIN_AMOUNT: u64 = 1_000_000 * 10_000;

    public struct TestRunner {
        scenario: Scenario,
        publisher: Publisher,
        display: Display<SpamNFT>,
        admin: AdminCap,
        nftManager: SpamNFTManager,
        director: Director
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

    public fun start(): TestRunner {
        let mut scenario = test_scenario::begin(ADMIN);

        let scenario_mut = &mut scenario;

        let director = mint_spam_coin(scenario_mut, USER_1, COIN_AMOUNT);

   nft::nft::init_for_testing(scenario_mut.ctx());
        scenario_mut.next_tx(ADMIN);

        let publisher = scenario_mut.take_from_sender<Publisher>();
        let display = scenario_mut.take_from_sender<Display<SpamNFT>>();
        let admin = scenario_mut.take_from_sender<AdminCap>();
        let mut nftManager = scenario_mut.take_shared<SpamNFTManager>();

        nft::nft::set_common_image_url(&admin, &mut nftManager, utf8(b"https://www.iota.org"));
        scenario_mut.next_tx(ADMIN);

        TestRunner {
            scenario,
            publisher,
            display,
            admin,
            nftManager,
            director
        }
    }

    public fun mint(
        self: &mut TestRunner,
    ) {
        self.scenario.next_tx(USER_1);
        let mut spam_coin = self.scenario.take_from_sender<Coin<SPAM>>();
        nft::nft::mint(&mut spam_coin, &mut self.nftManager, USER_1, self.scenario.ctx());
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
