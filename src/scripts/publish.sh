#!/usr/bin/env bash

set -o nounset      # Treat unset variables as an error when substituting
set -o errexit      # Exit immediately if any command returns a non-zero status
set -o pipefail     # Prevent errors in a pipeline from being masked
# set -o xtrace       # Print each command to the terminal before execution

script_dir=$(cd "$(dirname "$0")" && pwd)
iota_path="$script_dir/../../src/iota";

if [ "$(iota client active-env)" != "localnet" ]; then
    echo "The active environment is not localnet. Aborting."
    exit 1
fi

cd "$iota_path"
iota client publish --gas-budget 600600600
