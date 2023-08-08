## How to setup Postgres on Mac

Visit https://www.postgresql.org/download/macosx/ for a number of different installation options for PostgreSQL on MacOS. As of Aug 7, 2023, the author of this doc was successful in using homebrew method in setting up the DB and running the dockerless version of the dev app (see details below).

### Homebrew

If you are following the homebrew installation method, you may need to add PostgreSQL to your PATH in your shell configuration file.
For example, if you use ZSH, you can run the following command:

```
echo 'export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
```

Run `brew services start postgresql@15` to start the background service. 

### Dev Database

Once PostgreSQL is installed, create and connect to the database you'll need to run the dev environment with the following commands:

```
createdb envless
psql -d envless
```

You may need to change the DATABASE_URL variable in your `.env` file. It should follow this pattern:
```
DATABASE_URL="postgres://<username>@<host>:<port>/envless"
```

The default port is `5432`. To find the host and port on which your DB is available, run the following command from in `psql` prompt:
```
SELECT name, setting FROM pg_settings WHERE name IN ('listen_addresses','port');
```
