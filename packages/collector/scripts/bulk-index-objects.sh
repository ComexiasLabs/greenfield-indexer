#!/bin/bash

# Check if the environment parameter is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <environment>"
  echo "Example: $0 testnet"
  echo "Example: $0 mainnet"
  exit 1
fi

# Set the environment from the first argument
ENV=$1

# Validate the environment value
if [[ "$ENV" != "testnet" && "$ENV" != "mainnet" ]]; then
  echo "Error: Invalid environment. Must be 'testnet' or 'mainnet'."
  exit 1
fi

# Define the base URL
BASE_URL="http://localhost:3000/api/collect/objects"

COUNTER=1

# Infinite loop to make repeated calls
while true; do
  echo "Request #$COUNTER: GET ${BASE_URL}?env=${ENV}"

  curl -X GET "${BASE_URL}?env=${ENV}"

  echo -e "\n"
  
  COUNTER=$((COUNTER + 1))
  
  sleep 2
done
