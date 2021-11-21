import * as anchor from "@project-serum/anchor";
import { expect } from "chai";
import { NbaGmWithFriendsPrograms } from "../target/types/nba_gm_with_friends_programs";

describe("nba-gm-with-friends-programs", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace
    .NbaGmWithFriendsPrograms as anchor.Program<NbaGmWithFriendsPrograms>;

  it("is initialized!", async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    const tx = await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    console.log("Your transaction signature", tx);
  });

  it("adds a player", async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.initialize({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [baseAccount],
    });
    let account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );

    expect(account.totalPlayers.toString()).to.equal("0");

    await program.rpc.addPlayer("Russell Westbrook", {
      accounts: { baseAccount: baseAccount.publicKey },
    });

    account = await program.account.baseAccount.fetch(baseAccount.publicKey);

    expect(account.totalPlayers.toString()).to.equal("1");
  });
});
