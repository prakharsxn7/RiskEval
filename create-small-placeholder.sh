#!/bin/bash
# Create a small placeholder software.zip file without prompting

# Ensure the files directory exists
mkdir -p backend/files

# Backup existing file (optional)
if [ -f "backend/files/software.zip" ]; then
  echo "Backing up existing software.zip to software.zip.bak"
  cp backend/files/software.zip backend/files/software.zip.bak
fi

# Create a small placeholder file
echo "This is a placeholder file for the software package.
In production, replace this with the actual software package.
This file is only for development purposes." > backend/files/placeholder.txt

# Zip only this small text file
echo "Creating small placeholder software.zip file..."
zip -j backend/files/software.zip backend/files/placeholder.txt

# Clean up
rm backend/files/placeholder.txt

# Verify the file was created
if [ -f "backend/files/software.zip" ]; then
  FILE_SIZE=$(du -h backend/files/software.zip | cut -f1)
  echo "Success! Created placeholder software.zip file ($FILE_SIZE)"
  echo "This is only for development. Replace with your actual software package in production."
else
  echo "Error: Failed to create software.zip file."
  exit 1
fi 