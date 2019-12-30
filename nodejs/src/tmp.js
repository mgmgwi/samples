// POST
// ​/common​/upload
// Upload image

// GET
// ​/common​/networks
// List available ledger networks

// GET
// ​/common​/networks​/{networkId}​/txnAuthorAgreement
// Return the latest transaction author agreement and acceptance methods if one is set on the network with the specified {networkId}

// PUT
// ​/common​/networks​/{networkId}​/txnAuthorAgreement
// Accept the latest transaction author agreement on the specified network.

// Connections

// GET
// ​/connections
// List all connections
// POST
// ​/connections
// Create a new connection
// GET
// ​/connections​/{connectionId}
// Get a connection by connectionId
// DELETE
// ​/connections​/{connectionId}
// Delete a connection record
// Credentials

// GET
// ​/credentials
// Lists the credentials.
// POST
// ​/credentials
// Sends credential offer of the specified DefinitionId to the specified ConnectionId
// GET
// ​/credentials​/{credentialId}
// Gets the credentials.
// PUT
// ​/credentials​/{credentialId}
// Issues the credential.
// DELETE
// ​/credentials​/{credentialId}
// Revokes a credential.
// Definitions

// GET
// ​/definitions​/credentials
// List all credential definitions by this issuer.
// POST
// ​/definitions​/credentials
// Create new credential definition and schema with the given parameters.
// GET
// ​/definitions​/credentials​/{definitionId}
// Get the credential definition with the specified identifier.
// POST
// ​/definitions​/credentials​/{schemaId}
// Create credential definition from existing schema identifier.
// POST
// ​/definitions​/schemas
// Create new schema
// GET
// ​/definitions​/schemas
// List the schemas registered or used by this issuer.
// GET
// ​/definitions​/verifications​/{definitionId}
// Gets the specified verification definition.
// GET
// ​/definitions​/verifications
// List all verification definitions.
// POST
// ​/definitions​/verifications
// Creates new verification definition.
// Messaging

// POST
// ​/messages
// GET
// ​/messages​/connection​/{connectionId}

// GET
// ​/messages​/{messageId}



// GET
// ​/tenants
// List available tenants

// POST
// ​/tenants
// Create new tenant

// GET
// ​/tenants​/{tenantId}
// Returns the agent configuration

// DELETE
// ​/tenants​/{tenantId}
// Delete a tenant.

// GET
// ​/tenants​/issuerStatus
// Get the issuer status for the current tenant.



// Verifications

// GET
// ​/verifications
// Lists the verifications that have been sent to connections. Can filter by connectionId

// POST
// ​/verifications
// Creates a verification from a verification definition that will be sent to a specific connection .

// GET
// ​/verifications​/{verificationId}
// Get a verification by its identifier

// GET
// ​/verifications​/{verificationId}​/verify
// Execute a verification on this record. This is an expensive action and is executed by verifying the proof against the ledger data. More information about this operation can be found here: <a target="_blank" href="https://github.com/hyperledger/indy-sdk/blob/06429d5a544fe4e5f5e7632e4d04ff870105590a/libindy/src/api/anoncreds.rs#L2195">libindy implementation</a>



// Webhooks

// GET
// ​/webhooks
// List all webhooks
// POST
// ​/webhooks
// Create new webhook
// DELETE
// ​/webhooks​/{webhookId}
// Remove registered webhook
// PUT
// ​/webhooks​/{webhookId}​/enable
// Enables a webhook
// PUT
// ​/webhooks​/{webhookId}​/disable
// Disables a webhook