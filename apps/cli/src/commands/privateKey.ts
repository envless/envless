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
      description: "Show help for the link command",
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
      await loader.start(`Retriving private key from downloads folder...`);

      try {
        pKey = await getPrivateKeyFromDownloadsFolder();
      } catch (error) {
        await loader.stop(`Private key 'envless.key' not found!`);
        triggerCancel();
      }
      await loader.stop(`Private key successfully retrieved!`);

      await loader.start(`Storing private key to your system's keychain...`);
      await savePrivateKeyToKeyStore(pKey);
      await loader.stop(
        `Private key securely stored to your system's keychain!`,
      );

      await loader.start(`Deleting private key from downloads folder...`);
      await deletePrivateKeyFromDownloadsFolder();
      await loader.stop(`Private key deleted from downloads folder!`);
    }

    if (flags.copy) {
      await loader.start(
        `Copying private key from system's keychain to your clipboard...`,
      );
      pKey = await getPrivateKeyFromKeyStore();
      await ncp.copy(pKey, async () => {
        await loader.stop(`Private key copied to your clipboard!`);
      });
    }
  }
}
