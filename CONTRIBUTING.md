# Contribution Guidelines

## Table of contents

- <a href="#start">Getting started</a>
- <a href="#setup">Setup development environment</a>
- <a href="#changes">Implement your changes</a>
- <a href="#pr">Open a pull request</a>

<h2 id="start">Getting started</h2>
When contributing to `envless`, whether on GitHub or in other community spaces:

- Be respectful, civil, and open-minded.
- Before opening a new pull request, try searching through the [issue tracker](https://github.com/envless/envless/issues) for known issues or fixes.
- If you want to make code changes based on your personal opinion(s), make sure you open an issue first describing the changes you want to make, and open a pull request only when your suggestions get approved by maintainers.

In order to not waste your time implementing a change that has already been declined, or is generally not needed, start by [opening an issue](https://github.com/envless/envless/issues/new) describing the problem you would like to solve.

---

<h2 id="setup">Setup development environment</h2>

- <a href="#with-docker">Development environment with Docker</a>
- <a href="#without-docker">Development environment without docker</a>

<h3 id="with-docker">Development environment with Docker</h3>

* [Install Docker](https://docs.docker.com/get-docker/) on your machine.
* [Install Docker Compose](https://docs.docker.com/compose/install/) on your machine.
* [Fork the repository](https://github.com/envless/envless/fork)
* Clone the repository
  ```bash
  git clone https://github.com/<your-github-name>/envless.git
  ```
* Copy `.env.example` to `.env`
  ```bash
  cp .env.example .env
  ```
* Run the following command to start the development environment
  ```bash
  docker-compose up -d
  ```
* Run the following command to migrate and seed the database
  ```bash
  docker-compose exec platform yarn db:migrate
  docker-compose exec platform yarn db:seed
  ```
* Your server will be up and running on `http://localhost:3000`

---

<h3 id="without-docker">Development environment without Docker</h3>
This has been well tested on Mac OS and works really well. So, if you are on Mac we highly recommend this setup.

_We assume that you have latest version of node, and yarn installed, if latest version is creating any issue please [open and issue](https://github.com/envless/envless/issues/new)_


In order to contribute to this project, you will need to fork the repository:

Then, clone it to your local machine:

```bash
git clone https://github.com/<your-github-name>/envless.git
```

This project uses [yarn](https://yarnpkg.com/) as its package manager. Install it if you haven't already:

```bash
npm install -g yarn
```

Then, install the project's dependencies:

```bash
yarn install
```

Then, copy `.env.example` to `.env`

```bash
cp .env.example .env
```

We use [postgres database](#postgres-setup), once you have database setup, run following commands :-

```bash
yarn db:migrate
yarn ab:seed
```

<h2 id="postgres-setup">Setting up databases</h2>

- <a href="#postgres">Setup Postgres Database</a>

<h3 id="postgres">Setup Postgres Database</h3>

- [How to setup Postgres on Mac](/setup/postgres-on-mac.md)
- [How to setup Postgres on Linux](/setup/postgres-on-linux.md)
- [How to setup Postgres on Windows / WSL](/setup/postgres-on-windows.md)

For a quickstart, you can setup Postgres database on [Supabase](https://supabase.com/) or [Neon](https://neon.tech/) as well.

Copy/paste these env variables to .env file.

```
DATABASE_URL="postgres://{username}:{password}@localhost:{port}/envless"
```

> Note: please change username, password and port (default port is 5432) as according to your setup.

---

### Implement your changes

When making commits, make sure to follow the [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/) guidelines, i.e. prepending the message with `feat:`, `fix:`, `chore:`, `docs:`, etc... You can use `git status` to double check which files have not yet been staged for commit:

```bash
git add <file> && git commit -m "feat/fix/chore/docs: commit message"
```

<h3 id="pr">Open a pull request</h3>

### When you're done

Check that your code follows the project's style guidelines by running:

```bash
yarn format
```

Then, make a commit and push your code to your github fork and make a pull-request.

Thanks for contributing. Much ❤️

## Tests

For more information on how to help with tests (e2e, or unit tests), please see the [create an issue](https://github.com/envless/envless/issues/new).

<h2 id="contributors">Contributors</h2>

We ❤️ contributors! Feel free to contribute to this project but **please read the [Contributing Guidelines](CONTRIBUTING.md) before opening an issue or PR** so you understand the branching strategy and local development environment. We also welcome you to join our [Slack](https://dub.sh/envless-slack) or [Discord](https://dub.sh/envless-discord) community for either support or contributing guidance.

<a href="https://github.com/envless/envless/graphs/contributors">
  <p>
    <img src="https://contrib.rocks/image?repo=envless/envless" alt="A table of avatars from the project's contributors" />
  </p>
</a>
