namespace SDL.Media.Delivery.Examples.Controllers
{
    using System.Web.Mvc;

    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Carousel()
        {
            return this.View();
        }
        public ActionResult Html5Player()
        {
            return this.View();
        }

        public ActionResult Html5PlayerIframe()
        {
            return this.View();
        }
    }
}
