// Migrations are an early API to inject custom deploy logic.
// Not used by this teaching project, but Anchor expects the file to exist.
import * as anchor from "@coral-xyz/anchor";

module.exports = async function (provider: anchor.AnchorProvider) {
  anchor.setProvider(provider);
  // Add custom deploy/init logic here if needed.
};
