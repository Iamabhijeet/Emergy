using System;
using Emergy.Mobile.Pages;
using GalaSoft.MvvmLight;
using GalaSoft.MvvmLight.Command;
using Xamarin;
using Xamarin.Forms;

namespace Emergy.Mobile.ViewModel
{
    /// <summary>
    /// This class contains properties that the main View can data bind to.
    /// <para>
    /// Use the <strong>mvvminpc</strong> snippet to add bindable properties to this ViewModel.
    /// </para>
    /// <para>
    /// You can also use Blend to data bind with the tool's support.
    /// </para>
    /// <para>
    /// See http://www.galasoft.ch/mvvm
    /// </para>
    /// </summary>
    public class MainViewModel : ViewModelBase
    {
        /// <summary>
        /// Initializes a new instance of the MainViewModel class.
        /// </summary>
        public MainViewModel()
        {
            ////if (IsInDesignMode)
            ////{
            ////    // Code runs in Blend --> create design time data.
            ////}
            ////else
            ////{
            ////    // Code runs "for real"
            ////}
        }

        private SendPage _sendPage;
        public SendPage SendPage
        {
            get { return _sendPage ?? (_sendPage = new SendPage()); }
        }

        private ReportsPage _reportsPage;
        public ReportsPage ReportsPage
        {
            get { return _reportsPage ?? (_reportsPage = new ReportsPage()); }
        }
    }
}