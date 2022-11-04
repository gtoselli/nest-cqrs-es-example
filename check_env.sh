#!/bin/bash
# Check Env script version 0.4 (update_env is executed on docker build)
echo "Environment variables check:"

declare -a unset=()

while IFS= read -r line
do
    var_name="${line//=}"
    if [[ -z "${!var_name}" ]]; then
        echo "- $var_name is unset or empty."
        unset+=($var_name)
    fi
    
done < ".env"


if (( ${#unset[@]} > 0)); then
    echo "${#unset[@]} unset vars. Exit! 🛑"
    exit 1
else
    echo "All vars set. Continue! ✅"
fi
