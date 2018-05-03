import { Component } from '@angular/core';
import { Platform, ToastController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  dataRegistroCarrinho: any;

  constructor(public platform: Platform, public http: HttpClient, public statusBar: StatusBar, public splashScreen: SplashScreen, public alertCtrl: AlertController, public toastCtrl: ToastController, public backgroundMode: BackgroundMode, public screen: ScreenOrientation, private androidPermissions: AndroidPermissions) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.  
      localStorage.clear();
            
      statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#11856E');
      
      this.openHomePage(splashScreen);

    });
  }

  private openHomePage(splashScreen: SplashScreen) {
    splashScreen.hide();
    this.rootPage = TabsPage;
  }
    
  showToast(position: string, msg: string){
    let toast = this.toastCtrl.create({
        message: msg,
        duration: 2000,
        position: position
    });

    toast.present(toast);
  }

  showAlert(titulo: string, texto: string) {
    let alert = this.alertCtrl.create({
      title: titulo,
      subTitle: texto,
      buttons: ['OK']
    });
    alert.present();
  }
}