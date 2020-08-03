# Meter Readings Display

A webapp designed to search for a meter and to visualize its consumption for WH and VARH in a graph over time.

## Requirements:

- A running instance of Postgres
  -- Host: `localhost`
  -- Database : `postgres`
  -- User: `postgres`
  -- Password: `password`
  -- Port: `5432`

# Steps to run

- `git clone https://github.com/vegtelenseg/meter-readings.git`
- `cd packages/sever && yarn`
- `yarn rollback && yarn migrate && yarn seed`
  > NOTE: if rollback, migrate, and/or seed command fails, it's likely that your database is not running
- `cd ../web-public && yarn && cd ../../`
  and finally
- `yarn start`

## Roadmap

- Add environment variables for database configuration
- Improve how FE queries the BE (Debouncing input, Adding submit button)
- Improve querying strategy (Paginate data)
- Add Unit tests for logic and automated test for UI
