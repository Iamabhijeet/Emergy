using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Emergy.Core.Common;
using Emergy.Core.Repositories.Generic;
using Emergy.Data.Models;
using static Emergy.Core.Common.IEnumerableExtensions;

namespace Emergy.Api.Controllers
{
    [Authorize]
    [RoutePrefix("api/Images")]
    public class ImagesApiController : MasterApiController
    {
        public ImagesApiController(IRepository<Image> imagesRepository)
        {
            _imagesRepository = imagesRepository;
        }
        [Route("upload")]
        public async Task<IHttpActionResult> Upload(HttpPostedFileBase file)
        {
            if (file != null)
            {
                int imageId = await SaveImageAsBase64(file);
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
                uploadedIds.Add(await SaveImageAsBase64(file).WithoutSync());
            });
            return Ok(uploadedIds);
        }

        private async Task<int> SaveImageAsBase64(HttpPostedFileBase file)
        {
            int imageId;
            using (var binaryReader = new BinaryReader(file.InputStream))
            {
                byte[] fileData = binaryReader.ReadBytes(file.ContentLength);
                Image image = new Image
                {
                    Base64 = Convert.ToBase64String(fileData)
                };
                _imagesRepository.Insert(image);
                await _imagesRepository.SaveAsync();
                imageId = image.Id;
            }
            return imageId;
        }

        private readonly IRepository<Image> _imagesRepository;
        protected override void Dispose(bool disposing)
        {
            _imagesRepository.Dispose();
            base.Dispose(disposing);
        }
    }
}
