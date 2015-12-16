using System;
using System.IO;
using RazorEngine;
using RazorEngine.Templating;
namespace Emergy.Core.Razor
{
    public static class RazorCompiler
    {
        public static string Compile<T>(string filePath, string key, T model, object bag, DynamicViewBag viewBag = null)
        {
            return Engine.Razor.RunCompile(new LoadedTemplateSource(File.ReadAllText(filePath), filePath), key, null, viewBag);
        }
        public static string Compile<T>(string filePath, string key, T model)
        {
            return Engine.Razor.RunCompile(File.ReadAllText(filePath), filePath, typeof(T), model);
        }
    }
 
}
