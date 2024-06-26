const { BIP39LIST } = require("./BIP-39 wordlist.js");
const crypto = require("crypto");
const readline = require("readline");
const { hexToBinary, generateSeedFromMnemonic } = require("./utils.js");
const HDKey = require("hdkey");
const ethUtil = require("ethereumjs-util");
const fs = require("fs");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


// code to generate a random seedPhrase
rl.question("Enter entropy size (128, 160, 192, 224, 256): ", (entropyInput) => {
  const entropySizes = [128, 160, 192, 224, 256];
  const selectedEntropySize = entropySizes.includes(Number(entropyInput))
    ? Number(entropyInput)
    : entropySizes[0];
  console.log(entropyInput);
  rl.question("Enter HD key derivation path (e.g., m/44'/0'/0'/0): ", (path) => {
    path = path || "m/44'/0'/0'/0";

    rl.question("Enter the number of accounts: ", (numAccountsInput) => {
      const numAccounts = Number(numAccountsInput) || 1;
      rl.question("Enter the passphrase(optional)", (passPhraseInput) => {
        // Code to generate random binary equal to the length of selectedEntropySize
        let randomBinaryNo = "";
        for (let i = 1; i <= selectedEntropySize; i++) {
          randomBinaryNo = randomBinaryNo + (Math.random() > 0.5 ? 1 : 0);
        }

        const uint8Array = new Uint8Array(randomBinaryNo.length / 8);
        for (let i = 0; i < randomBinaryNo.length; i += 8) {
          const byte = randomBinaryNo.slice(i, i + 8);
          uint8Array[i / 8] = parseInt(byte, 2);
        }

        const hashedRandomBinaryNo = crypto
          .createHash("sha256")
          .update(uint8Array)
          .digest("hex");

        // converting in binary to get checksum of size checkSumLengthInBits from starting of it

        const binaryOfHashedRandomBinaryNo = hexToBinary(hashedRandomBinaryNo);

        // Calculate checksum
        const checkSumLengthInBits = selectedEntropySize / 32;
        let checkSum = binaryOfHashedRandomBinaryNo.substring(
          0,
          checkSumLengthInBits
        );

        // Append checksum to randomBinaryNo
        const randomBinaryNoAndChecksum = `${randomBinaryNo}${checkSum}`;

        // split randomBinaryNoAndChecksum in group of 11 bits to get a seedphrase from bip-39 list of words

        let seedPhrase = "";
        for (
          let i = 0;
          i < randomBinaryNoAndChecksum.length;
          i += 11
        ) {
          seedPhrase +=
            BIP39LIST[
              parseInt(
                randomBinaryNoAndChecksum.substring(i, i + 11),
                2
              )
            ] + " ";
        }
        seedPhrase = seedPhrase.trim();
        console.log(
          "Your seed phrase is(Kindly keep it safe):" + seedPhrase
        );

        let passPhrase = passPhraseInput || "";
        const SEED = generateSeedFromMnemonic(seedPhrase, passPhrase);

        const root = HDKey.fromMasterSeed(Buffer.from(SEED, "hex"));

        const keyPairs = {};

        for (
          let accountIndex = 0;
          accountIndex < numAccounts;
          accountIndex++
        ) {
          const accountPath = `${path}/${accountIndex}`;
          const childkey = root.derive(accountPath);

          const publicKey = childkey.publicKey;
          const addressBuffer = ethUtil.pubToAddress(publicKey, true); // true indicates that the publicKey is uncompressed
          const addressHex = addressBuffer.toString("hex");
          const address = "0x" + addressHex;
          const privateKeyBuffer = childkey.privateKey.slice(0, 32);
          const privateKeyEVM = Buffer.from(privateKeyBuffer).toString("hex");
          keyPairs[address] = privateKeyEVM;

        //   console.log(
        //     `Account ${accountIndex + 1} (${accountPath}) - Private Key: ${
        //       childkey.privateExtendedKey
        //     }, Ethereum Address: ${address}`
        //   );
        }

        // Write key pairs to a JSON file
        fs.writeFile("PubPvt.json", JSON.stringify(keyPairs, null, 2), (err) => {
          if (err) {
            console.error("Error writing key pairs to file:", err);
          } else {
            console.log("Key pairs written to keyPairs.json successfully.");
          }
        });

        rl.close();
      });
    });
  });
});
