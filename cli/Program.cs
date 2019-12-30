using System;
using System.Collections.Generic;
using Streetcred.ServiceClients;
using Streetcred.ServiceClients.Models;
using Microsoft.Rest;
using Microsoft.Extensions.DependencyInjection;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace cli
{
    class Program
    {
        static HttpClient httpClient = new HttpClient();
        static void Main(string[] args)
        {
            Console.WriteLine("~~~~~~ Hello, Friend. Welcome to Streetcred CLI V0.0.01 ~~~~");
            RunAsync().GetAwaiter().GetResult();
        }

        static async Task RunAsync()
        {
            bool shouldContinue = true;         
            IAgencyServiceClient client = GetAuthorizedClient();
            Console.WriteLine("\nAuthorized");

            //populate state
            var verDefinitions = await client.ListVerificationDefinitionsAsync();
            State.verificationDefinitionId = verDefinitions[0].Id;

            var credDefinitions = await client.ListCredentialDefinitionsAsync();
            State.credentialDefinitionId = credDefinitions[0].DefinitionId;

            while(shouldContinue)
            {
                Console.Write("===========\nPlease select an option by number: \n\t[1] get new invitation url \n\t[2] send sample credential \n\t[3] send sample verification \n\t[4]Issue Credential \n\t[5] verify verification \n\t[*] quit\n===========\n>");
                int input = int.Parse(Console.ReadLine());
                switch(input)
                {
                    // get invitation url
                    case 1:
                        var connectionResult = await client.CreateConnectionAsync(new ConnectionInvitationParameters());
                        Console.WriteLine("Success! Invitation Url: {0}\n", connectionResult.InvitationUrl);
                        State.connectionId= connectionResult.ConnectionId;
                        break;

                    // send credential
                    case 2:
                        var credResult = await client.CreateCredentialAsync(new CredentialOfferParameters() {
                            DefinitionId = State.credentialDefinitionId,
                            ConnectionId = State.connectionId,
                            CredentialValues = new Dictionary<string, string>()
                            {
                                {"Name", "Michael"},
                                {"Date of Birth", "2000"}
                            },
                        });
                        Console.WriteLine("Credential Id: {0}", credResult.CredentialId);
                        State.credentialId = credResult.CredentialId;
                        break;

                    // send verification
                    case 3:
                        var verResult = await client.CreateVerificationAsync(new VerificationParameters() {
                            VerificationDefinitionId = State.verificationDefinitionId,
                            ConnectionId = State.connectionId
                        });
                        Console.WriteLine("Verification Id: {0}", verResult.Id);
                        State.verificationId = verResult.Id;
                        break;

                    //issue credential
                    case 4:
                        await client.IssueCredentialAsync(
                            State.credentialId,
                            new Dictionary<string, string>()
                            {
                                {"Name", "Michael"},
                                {"Date of Birth", "2000"}
                            });
                        Console.WriteLine("Credential Issued");
                        break;
                    //verify verification
                    case 5: 
                        var verExecResult = await client.VerifyVerificationAsync(State.verificationId);
                        Console.WriteLine("Verification Returned: {0}\nBody: ", verExecResult.Valid);
                        break;

                    // quit
                    default:
                        Console.WriteLine("Goodbye, friend.");
                        shouldContinue = false;
                        break;
                }
            }


        }
        static IAgencyServiceClient GetAuthorizedClient()
        {
            Console.WriteLine("Enter in your credentials below: ");
            Console.Write("\t| Access Token >");
            string accessToken = "e0ac71d72ce7438b48448ed1581b44c02ead684c1d673d8603e1a006f3f7307c";//Console.ReadLine();
            Console.Write("\t| Subscription Key >");
            string subscriptionKey = "5601d3bd26654e9e987805185b1eea05";//Console.ReadLine();
            StreetcredClientCredentials creds = new StreetcredClientCredentials(accessToken, subscriptionKey);
            return new AgencyServiceClient(creds);
        }
    }

    public static class State
    {
        public static string verificationId {get; set;}
        public static string verificationDefinitionId {get; set;}
        public static string credentialId {get; set;}

        public static string credentialDefinitionId {get; set;}

        public static string connectionId {get; set;}
    }

    public class StreetcredClientCredentials : ServiceClientCredentials
    {        
        private string AccessToken {get; set;}
        private string SubscriptionKey {get; set;}
        public StreetcredClientCredentials(string accessToken, string subscriptionKey)
        {
            AccessToken = accessToken;
            SubscriptionKey = subscriptionKey;
        }
        
        /// <inheritdoc />
        public override Task ProcessHttpRequestAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            request.Headers.Add("Authorization", $"Bearer {AccessToken}");
            request.Headers.Add("X-Streetcred-Subscription-Key", SubscriptionKey);
            request.Headers.Add("X-Scrd-Api-Key", SubscriptionKey);
            return base.ProcessHttpRequestAsync(request, cancellationToken);
        }
    }
}
