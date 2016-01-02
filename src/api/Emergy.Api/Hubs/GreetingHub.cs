using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Hubs;

namespace Emergy.Api.Hubs
{
    [HubName("greetingHub")]
    public class GreetingHub : Hub
    {
        [HubMethodName("testPush")]
        public void TestPush(string greeting)
        {
            Clients.Caller.testSuccess(greeting);
        }
    }
}