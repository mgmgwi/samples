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