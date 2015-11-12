using System;
using System.Collections.Generic;
using System.IO;
using System.Security;
using Emergy.Core.Models.Log;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Emergy.Core.Services
{
    public class JsonService<T>
    {
        public JsonService(string path = null)
        {
            JsonPath = path;
        }
        public void Add(T item)
        {
            var collection = GetArray();
            collection.Add(JsonConvert.SerializeObject(item));
            Save(collection.ToString());
        }
        public IReadOnlyCollection<T> GetCollection()
        {
            return JsonConvert.DeserializeObject<IReadOnlyCollection<T>>(File.ReadAllText(JsonPath));
        }
        private JArray GetArray()
        {
            return JArray.Parse(File.ReadAllText(JsonPath));
        }
        private void Save(string json)
        {
            if (File.Exists(JsonPath))
            {
                File.Delete(JsonPath);
            }
            File.WriteAllText(JsonPath, json);
        }
        private string JsonPath { get; set; }
    }
}
