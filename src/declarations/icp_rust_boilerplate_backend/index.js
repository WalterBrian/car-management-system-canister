import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory } from "./icp_rust_boilerplate_backend.did.js";

// Re-export the idlFactory for others to use
export { idlFactory };

// Get the canisterId from environment variables
const canisterId =
  process.env.CANISTER_ID_ICP_RUST_BOILERPLATE_BACKEND ||
  process.env.ICP_RUST_BOILERPLATE_BACKEND_CANISTER_ID;

/**
 * Create an actor with the provided canister ID and options.
 * @param {string | Principal} canisterId - ID of the canister the Actor will communicate with.
 * @param {object} options - Configuration options for actor creation.
 * @param {Agent} options.agent - (Optional) Pre-configured agent to use.
 * @param {object} options.agentOptions - (Optional) Options for setting up a new agent.
 * @param {object} options.actorOptions - (Optional) Options for the Actor.
 * @returns {Actor} - The created actor instance.
 * @throws {Error} If canisterId is not provided or is invalid.
 */
export const createActor = (canisterId, options = {}) => {
  // Validate the canisterId.
  if (!canisterId) {
    throw new Error("Canister ID is required.");
  }

  if (typeof canisterId === "string") {
    try {
      canisterId = Principal.fromText(canisterId);
    } catch (error) {
      throw new Error("Invalid canister ID format.");
    }
  } else if (!(canisterId instanceof Principal)) {
    throw new Error("Invalid canister ID type.");
  }

  // Create the HttpAgent with options.
  const agent = options.agent || new HttpAgent({ ...options.agentOptions });

  if (options.agent && options.agentOptions) {
    console.warn(
      "Detected both agent and agentOptions passed to createActor. Ignoring agentOptions and proceeding with the provided agent."
    );
  }

  // Fetch the root key for certificate validation during development
  if (process.env.DFX_NETWORK !== "ic") {
    agent.fetchRootKey().catch((err) => {
      console.warn(
        "Unable to fetch the root key. Check to ensure that your local replica is running."
      );
      console.error(err);
    });
  }

  // Create an actor using the candid interface and the HttpAgent
  return Actor.createActor(idlFactory, {
    agent,
    canisterId,
    ...options.actorOptions,
  });
};

// Export the initialized actor for use in other modules.
export const icp_rust_boilerplate_backend = createActor(canisterId);
