using System;

using Android.App;
using Android.Content.PM;
using Android.Graphics.Drawables;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using Android.OS;

namespace Emergy.Mobile.Droid
{
    [Activity(Label = "Emergy", Icon = "@drawable/icon", MainLauncher = true, ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation)]
    public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsApplicationActivity
    {
        protected override void OnCreate(Bundle bundle)
        {
            base.OnCreate(bundle);

            global::Xamarin.Forms.Forms.Init(this, bundle);
            LoadApplication(new App());

            if ((int) Android.OS.Build.VERSION.SdkInt >= 21)
            {
                ActionBar.SetIcon (new ColorDrawable (Resources.GetColor (Android.Resource.Color.Transparent)));
            }
        }
    }
}

