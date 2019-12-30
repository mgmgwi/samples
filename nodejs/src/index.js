const AgencyServiceClient = require("@streetcred.id/service-clients").AgencyServiceClient;
const Credentials = require("@streetcred.id/service-clients").Credentials;

const client = new AgencyServiceClient(new Credentials("", "<subscription key>"));

async function endpoints() {

    // ======= Common ======= //

    const imageUploadResponse = await client.uploadImage({
        filename: "string",
        contentType: "png"
    });

    const tenant = await client.createTenant({
        tenantParameters: {
            name: "Hooli Corporation",
            networkId = "sovrin-staging",
            endorserType: "Shared",
            imageUrl: null, // optional. image automatically populates if using above endpoint
            issuerSeed: null // a 32 byte string that will deterministically select the did and verkey for an organization
        }
    });

    await client.getTenant(tenant.tenantId); // same response as create tenant

    await client.deleteTenant(tenant.tenantId);

    /// ======== Manage Connections ======== ///
    const connections = await client.listConnections({
        state: "Connected" // state could be { "Invited" | "Connected" | "Negotiating" }
    });

    /// ======== Manage Definitions ======= ///

    // list Credential Definitions
    const credentialDefinitions = await client.listCredentialDefinitions();
 
    // list Schemas
    const schemas = await client.listSchemas();

    const schema = await client.createSchema({
        schemaParameters: {
            name: "Employee Badge",
            version: "1.0",
            attrNames: [
                "Name",
                "Role",
                "Email",
                "Age"
            ]
        }
    });

    var customCredentialDefinition = await client.createCredentialDefinition(schemaId, {
        credentialDefinitionFromSchemaParameters: {
            supportRevocation: true,
            tag: "unique identifier"
        }
    });

    // Create a custom credential definition
    var customCredentialDefinition = await client.createCredentialDefinition({
        credentialDefinitionFromSchemaParameters: {
            name: "Hooli Employee Badge",
            version: "1.0",
            attrNames: ["Name", "Role", "Email", "Age"],
            supportRevocation: true,
            tag: "unique identifier"
        }
    });

    // Create a cred def from a schema
    var schemaCredentialDefinition = await client.createCredentialDefinitionForSchemaId(schema)

    //Invite someone to connect
    var connection = await client.createConnection({
        connectionInvitationParameters: {
            connectionId: "unique id", 
            multiParty: false
        }
    });

    // create a credential and send a credential offer
    var credential = await client.createCredential({
        definitionId: customCredentialDefinition.definitionId,
        connectionId: connection.connectionId
    });

    // you must now wait for the holder to accept the credential. 
    // you can use webhooks to be notified once the holder accepts, or 
    // get the credential record from your wallet to check for yourself.
    credential = await client.getCredential(credential.credentialId);

    // The potential credential states are: 
    // 'Offered' | 'Requested' | 'Issued' | 'Rejected' | 'Revoked'
    if(credential.state === 'Requested')
    {
        await client.issueCredential(credential.credentialId);
    } 

    /**
     * Now that the holder has been issued a credential, we can ask them to prove information to us using their credential. 
     * For example, when an employee needs to show their employee badge to verify they're an employee, 
     * a verifier can add the following code to their application
     */
    /// ============ Manage Verifications ============ ///
    const verificationDefinition = await client.createVerificationDefinition({
        proofRequest: {
            name: "Proof of Employment",
            version: "1.0",
            requestedAttributes: {
                "Verify Name": {
                    name: "Name",
                    restrictions: 
                    [
                        {
                            schemaId: credential.schemaId,
                        },
                        {
                            credDefId: credential.credentialId
                        },
                        {
                            issuerDid: credential.issuerDid
                        }
                    ]
                }
            },
            requestedPredicates: {
                "Over Age": {
                    pType: ">=",
                    pValue: "21",
                    name: "Age",
                    restrictions:[
                        {
                            schemaId: credential.schemaId
                        }
                    ]
                }
            }
        }
    });

    const verification = await client.createVerification(verificationDefinition.definitionId, connection.connectionId);
    // Now a verifier can verify the verification against the ledger
    
    const verificationResult = await client.verifyVerification(verification.id);

    if(verificationResult.valid)
    {
        console.log("success!");
    }
    
    const verifications = await client.listVerificationDefinitions();

    const verificationsByConnection = await client.listVerificationsForConnection({
        connectionId: connection.connectionId
    });

/// ========= Manage Webhooks ======== ///
    const webhook = await client.createWebhook({
        webhookParameters: {
            url: "string",
            type: "Notification" // Type DelegatedEndorser will be supported soon
        }
    });

    const webhooks = await client.listWebhooks();

    await client.enableWebhook(webhook.id);

    await client.disableWebhook(webhook.id);

    await client.removeWebhook(webhook.id);

}

samples();