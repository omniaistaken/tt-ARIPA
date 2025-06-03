#!/bin/bash

echo "Did you create the database before launching this script ? (y/n)"
read -r answer
if [[ $answer != "y" ]]; then
  echo "Create it then come back..."
  exit 1
fi
echo "Enter the database name (default: test_technique_aripa):"
read -r db_name
if [[ -z $db_name ]]; then
  db_name="test_technique_aripa"
fi

# ask user for the database user
echo "Enter the database user (default: postgres):"
read -r db_user
if [[ -z $db_user ]]; then
  db_user="postgres"
fi

psql -h localhost -U "$db_user" -d "$db_name" -f init.sql
if [ $? -ne 0 ]; then
    echo "❌ Error executing init.sql"
    exit 1
fi

psql -h localhost -U "$db_user" -d "$db_name" -f insert_species.sql
if [ $? -ne 0 ]; then
    echo "❌ Error executing insert_species.sql"
    exit 1
fi

psql -h localhost  -U "$db_user" -d "$db_name" -f insert_fish.sql
if [ $? -ne 0 ]; then
    echo "❌ Error executing insert_fish.sql"
    exit 1
fi

psql -h localhost -U "$db_user" -d "$db_name" -f insert_entities_boats_bills.sql
if [ $? -ne 0 ]; then
    echo "❌ Error executing insert_entities_boats_bills.sql"
    exit 1
fi

echo "✅ Successfully inserted all data in '$DB_NAME'."
