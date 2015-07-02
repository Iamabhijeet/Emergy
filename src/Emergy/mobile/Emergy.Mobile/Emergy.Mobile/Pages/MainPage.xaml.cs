using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Emergy.Mobile.ViewModel;
using Xamarin.Forms;

namespace Emergy.Mobile.Pages
{
    public partial class MainPage : TabbedPage
    {
        public MainPage()
        {
            InitializeComponent();
            this.Title = "Emergy.";
            _mainViewModel = App.Locator.MainViewModel;
            SetPages();
        }


        private void SetPages()
        {
          
            this.Children.Add(_mainViewModel.SendPage);
            this.Children.Add(_mainViewModel.ReportsPage);
        }

        private readonly MainViewModel _mainViewModel;




    }
}
