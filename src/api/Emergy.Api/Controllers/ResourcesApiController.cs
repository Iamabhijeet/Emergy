using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Description;
using Emergy.Core.Common;
using Emergy.Core.Models.File;
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
        [ResponseType(typeof(Resource))]
        public async Task<IHttpActionResult> Get([FromUri] int id)
        {
            var resource = await _resourcesRepository.GetAsync(id);
            return (resource != null) ? (IHttpActionResult)Ok(resource) : BadRequest();
        }
        [Route("upload-file")]
        public async Task<IHttpActionResult> Upload(ValidatedHttpPostedFileBase file)
        {
            if (file != null && ModelState.IsValid)
            {
                int imageId = await SaveFile(file);
                return Ok(imageId);
            }
            return BadRequest();
        }
        [Route("upload-files")]
        public IHttpActionResult Upload(UploadMultipleResourcesViewModel model)
        {
            if (model != null && ModelState.IsValid)
            {
                ICollection<int> uploadedIds = new List<int>();
                model.Files.ForEach(async (file) =>
                {
                    uploadedIds.Add(await SaveFile(file).WithoutSync());
                });
                return Ok(uploadedIds);
            }
            return BadRequest();
        }
        [Route("upload-blob")]
        public async Task<IHttpActionResult> Upload(UploadResourceModel file)
        {
            if (file != null && ModelState.IsValid)
            {
                int imageId = await SaveFile(file);
                return Ok(imageId);
            }
            return BadRequest();
        }
        [Route("upload-blobs")]
        public IHttpActionResult Upload(IEnumerable<UploadResourceModel> model)
        {
            if (model != null && ModelState.IsValid)
            {
                ICollection<int> uploadedIds = new List<int>();
                model.ForEach(async (file) =>
                {
                    uploadedIds.Add(await SaveFile(file).WithoutSync());
                });
                return Ok(uploadedIds);
            }
            return BadRequest();
        }
        private async Task<int> SaveFile(UploadResourceModel file)
        {
            Resource newResource = new Resource
            {
                Name = file.Name,
                MimeType = file.ContentType,
                Base64 = file.Base64,
                Url = file.Base64,
                DateUploaded = DateTime.Now,
            };
            await SaveToDatabase(newResource).WithoutSync();
            return newResource.Id;
        }
        private async Task<int> SaveFile(HttpPostedFileBase file)
        {
            string path = SaveToDisk(file);
            byte[] rawBytes;
            using (MemoryStream stream = new MemoryStream())
            {
                file.InputStream.CopyTo(stream);
                rawBytes = stream.ToArray();
            }
            string base64 = Convert.ToBase64String(rawBytes);
            base64 = $"data:{ file.ContentType.ToLower().Trim() };base64,{ base64 }";
            Resource newResource = new Resource
            {
                Name = file.FileName,
                MimeType = file.ContentType,
                Url = path,
                Base64 = base64,
                DateUploaded = DateTime.Now,
            };
            await SaveToDatabase(newResource).WithoutSync();
            return newResource.Id;
        }
        private string SaveToDisk(HttpPostedFileBase file)
        {
            if (file != null)
            {
                using (MemoryStream stream = new MemoryStream())
                {
                    string path = HttpContext.Current.Server.MapPath("~/Content/Resources/" + file.FileName);
                    file.InputStream.CopyTo(stream);
                    try
                    {
                        File.WriteAllBytes(path, stream.ToArray());
                    }
                    catch (Exception)
                    {
                        path = "file_system_error";
                    }
                    return path;
                }
            }
            return "";
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
