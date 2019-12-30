   
//Invite someone to connect
var connection = await client.createConnection({
    connectionInvitationParameters: {
        connectionId: "unique id", 
        multiParty: false
    }
});


    
/// ======== Manage Connections ======== ///
const connections = await client.listConnections({
    state: "Connected" // state could be { "Invited" | "Connected" | "Negotiating" }
});



