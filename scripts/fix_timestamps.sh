#!/bin/bash

# Check if an argument was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <directory>"
    exit 1
fi

# The directory is the first argument to the script
DIRECTORY="$1"

# Check if the specified directory exists
if [ ! -d "$DIRECTORY" ]; then
    echo "Error: Directory does not exist."
    exit 1
fi

# Loop through all JSON files in the specified directory
for file in "$DIRECTORY"/*.json; do
    echo "Processing $file..."

    # Use jq to correct the dateAdded field and output to a temporary file
    jq 'map(.dateAdded |= if . < 10000000000 then . * 1000 else . end)' "$file" > temp.json

    # Move the temporary file to the original file
    mv temp.json "$file"

    echo "$file updated."
done

echo "All files processed."
