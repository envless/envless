# Contribution Guidelines

## Table of contents
* <a href="#start">Getting started</a>
* <a href="#setup">Setting up databases</a>
* <a href="#server">Running the server</a>
* <a href="#changes">Implement your changes</a>
* <a href="#pr">Open a pull request</a>

<h2 id="start">Getting started</h2>
When contributing to `envless`, whether on GitHub or in other community spaces:

- Be respectful, civil, and open-minded.
- Before opening a new pull request, try searching through the [issue tracker](https://github.com/envless/envless/issues) for known issues or fixes.
- If you want to make code changes based on your personal opinion(s), make sure you open an issue first describing the changes you want to make, and open a pull request only when your suggestions get approved by maintainers.

### Prerequisites

In order to not waste your time implementing a change that has already been declined, or is generally not needed, start by [opening an issue](https://github.com/envless/envless/issues/new) describing the problem you would like to solve.

### Setup your environment

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

> Of-course this will change and we no longer will need .env files once we are ready to go live.


```bash
cp .env.example .env
```

<h2 id="setup">Setting up databases</h2>

* <a href="#mysql">Setup MySQL Database</a>
* <a href="#redis">Setup Upstash Redis</a>

<h3 id="mysql">Setup MySQL Database</h3>
This project uses MySQL database. Every environment and OS has a different way to setup MySQL. Here is how I setup on my MacOS machines.

* `brew install mysql`

After installation I had to go through these steps
* Run `mysql_secure_installation`
* This steps prompts you to create root user/password
* Login using `root` user `mysql -u root -p`
* Create `envless` and `envless_shadow` databases

  * `CREATE DATABASE envless;`
  * `CREATE DATABASE envless_shadow;`

* Copy/paste these env variables to .env file. Of-course this will change and we no longer will need .env files once we are ready to go live.

```
DATABASE_URL="mysql://root:password@localhost:3306/envless"
SHADOW_DATABASE_URL="mysql://root:password@localhost:3306/envless_shadow"
```
> Note: please change user/password if your setup has different user/password combination

### MySQL commands
> Some MySQL commands with homebrew that might come handy
* `brew services start mysql`
* `brew services restart mysql`
* `brew services stop mysql`

> If you are working with different OS, please submit a pull-request with MySQL setup instructions.

<h3 id="redis">Setup Upstash Redis</h3>

Go ahead and create a free [Upstash](https://upstash.com/) account and copy/paste these env variables to `.env` file.

![upstash](./.github/images/upstash.png)

### Or you can use local Redis with Upstash

- Install `Golang` https://go.dev/doc/install
- Install `Redis` https://redis.io/docs/getting-started/installation/

Then install upstash redis server

`go install github.com/mna/upstashdis/cmd/upstash-redis-rest-server@latest`

Update your `.env` with
```
UPSTASH_REDIS_REST_URL="http://127.0.0.1:3010"
UPSTASH_REDIS_REST_TOKEN="asd"
```
Start Local upstash redis server with

`upstash-redis-rest-server --addr 127.0.0.1:3010 --redis-addr 127.0.0.1:6379 --api-token asd`
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

## Translations

For more information on how to help with translation, please see the [create an issue](https://github.com/envless/envless/issues/new).

## Credits

This documentation was inspired by the contributing guidelines for [t3-oss/create-t3-app](https://github.com/t3-oss/create-t3-app/blob/next/CONTRIBUTING.md).

<h2 id="contributors">Contributors</h2>

We ❤️ contributors! Feel free to contribute to this project but **please read the [Contributing Guidelines](CONTRIBUTING.md) before opening an issue or PR** so you understand the branching strategy and local development environment. We also welcome you to join our [Slack](https://dub.sh/envless-slack) or [Discord](https://dub.sh/envless-discord) community for either support or contributing guidance.

<a href="https://github.com/envless/envless/graphs/contributors">
  <p>
    <img src="https://contrib.rocks/image?repo=envless/envless" alt="A table of avatars from the project's contributors" />
  </p>
</a>
