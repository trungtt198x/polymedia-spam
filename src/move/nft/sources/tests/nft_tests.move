#[test_only]
module nft::nft_tests {
    use nft::test_runner;

    #[test]
    fun test_mint() {
        let mut runner = test_runner::start();
        runner.mint();
        runner.end();
    }
}
