using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Emergy.Core.Common;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;


namespace Emergy.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/Resources")]
    public class ResourcesApiController : MasterApiController
    {
        public ResourcesApiController(IRepository<Resource> resourcesRepository)
        {
            _resourcesRepository = resourcesRepository;
        }
        [Route("get/{id}")]
        public async Task<IHttpActionResult> Get([FromUri] int id)
        {
            var resource = await _resourcesRepository.GetAsync(id);
            return (resource != null) ? (IHttpActionResult)Ok(resource) : BadRequest();
        }
        [Route("upload")]
        public async Task<IHttpActionResult> Upload(HttpPostedFileBase file)
        {
            if (file != null)
            {
                if (file.ContentLength <= (25 * 1024 * 1024))
                {
                    return BadRequest("Maximum resource upload size is 25 MB!");
                }
                int imageId = await SaveFile(file);
                return Ok(imageId);
            }
            return BadRequest();
        }
        [Route("upload")]
        public IHttpActionResult Upload(IEnumerable<HttpPostedFileBase> files)
        {
            ICollection<int> uploadedIds = new List<int>();
            files?.ForEach(async (file) =>
            {
                if (file.ContentLength <= (25 * 1024 * 1024))
                {
                    uploadedIds.Add(await SaveFile(file).WithoutSync());
                }
            });
            return Ok(uploadedIds);
        }
        private async Task<int> SaveFile(HttpPostedFileBase file)
        {
            SaveToDisk(file);
            Resource newResource = new Resource
            {
                Name = file.FileName,
                MimeType = file.ContentType,
                DateUploaded = DateTime.Now,
            };
            await SaveToDatabase(newResource).WithoutSync();
            return newResource.Id;
        }
        private void SaveToDisk(HttpPostedFileBase file)
        {
            if (file != null)
            {
                using (MemoryStream stream = new MemoryStream())
                {
                    string path = HttpContext.Current.Server.MapPath("~/Content/Resources/" + file.FileName);
                    file.InputStream.CopyTo(stream);
                    File.WriteAllBytes(path, stream.ToArray());
                }
            }
        }
        private async Task<int> SaveToDatabase(Resource resource)
        {
            _resourcesRepository.Insert(resource);
            await _resourcesRepository.SaveAsync();
            int resourceId = resource.Id;
            resource.Url = ApplicationUrl + resourceId;
            _resourcesRepository.Update(resource);
            await _resourcesRepository.SaveAsync();
            return resourceId;
        }
        private readonly IRepository<Resource> _resourcesRepository;
        protected override void Dispose(bool disposing)
        {
            _resourcesRepository.Dispose();
            base.Dispose(disposing);
        }
    }
}
