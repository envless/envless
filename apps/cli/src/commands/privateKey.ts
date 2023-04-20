import { spinner } from "@clack/prompts";
import { Command, Flags } from "@oclif/core";
import { cyan, grey } from "kleur/colors";
import { triggerCancel } from "../lib/helpers";
import { LINKS } from "../lib/helpers";
import {
  deletePrivateKeyFromDownloadsFolder,
  getPrivateKeyFromDownloadsFolder,
  getPrivateKeyFromKeyStore,
  savePrivateKeyToKeyStore,
} from "../lib/keyStore";

const loader = spinner();
const ncp = require("copy-paste");

export default class PrivateKey extends Command {
  static description = `Securely store your private key to your system's keychain.\n${grey(`
    ⚡ Please make sure you have created a project and downloaded envless.key to your downloads folder. If you haven't, create one at \n${cyan(
      LINKS.projects,
    )}`)}`;

  static flags = {
    secure: Flags.boolean({
      char: "s",
      default: false,
      description: "Securely store private key to your system's keychain",
    }),

    copy: Flags.boolean({
      char: "c",
      default: true,
      description: "Copy private key from system's keychain to your clipboard",
    }),

    help: Flags.help({
      char: "h",
      description: "Shows help for the link command",
    }),
  };

  static examples = [
    `
      $ envless privateKey
      $ envless privateKey --secure --copy
    `,
  ];

  async run(): Promise<void> {
    let pKey;
    const version = this.config.version;
    const { flags } = await this.parse(PrivateKey);
    this.log(`Envless CLI ${grey(`${version}`)}`);

    if (flags.secure) {
      loader.start(`Retriving private key from downloads folder...`);

      try {
        pKey = await getPrivateKeyFromDownloadsFolder();
        loader.stop(`Private key successfully retrieved!`);
        loader.start(`Storing private key to your system's keychain...`);
        await savePrivateKeyToKeyStore(pKey);
        loader.stop(`Private key securely stored to your system's keychain!`);

        loader.start(`Deleting private key from downloads folder...`);
        await deletePrivateKeyFromDownloadsFolder();
        loader.stop(`Private key deleted from downloads folder!`);
      } catch (error) {
        loader.stop(
          `Private key 'envless.key' not found in downloads folder, checking system's keychain...`,
        );
        loader.start(`Checking system's keychain for private key...`);
        pKey = await getPrivateKeyFromKeyStore();

        if (!pKey || pKey.length === 0) {
          loader.stop(`Private key not found in your system's keychain`);
          triggerCancel();
        }

        loader.stop(
          `Private key successfully retrieved from system's keychain!`,
        );
      }
    }

    if (flags.copy) {
      loader.start(
        `Copying private key from system's keychain to your clipboard...`,
      );
      pKey = await getPrivateKeyFromKeyStore();

      if (pKey && pKey.length > 0) {
        await ncp.copy(pKey, async () => {
          loader.stop(`Private key copied to your clipboard!`);
        });
      } else {
        loader.stop(`Private key not found in your system's keychain`);
        triggerCancel();
      }
    }
  }
}
