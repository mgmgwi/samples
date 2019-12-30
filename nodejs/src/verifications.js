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
                            schemaId: credential.schemaId
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
    })
