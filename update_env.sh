#!/bin/bash

echo "Extracting from code variables read from environment..."

grep -E 'process\.env\.[[:alnum:]_]*' -oh src/* -r | cut -d . -f 3 | sed 's/$/\=/' | sort | uniq > .env
