import { Component } from '@angular/core';
import { Platform, ToastController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { BackgroundMode } from '@ionic-native/background-mode';
import { DatabaseProvider } from '../providers/database/database'
import { ProdutoProvider } from '../providers/produto/produto';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;
  dataRegistroCarrinho: any;

  constructor(public platform: Platform, public http: HttpClient, public statusBar: StatusBar, public splashScreen: SplashScreen, public alertCtrl: AlertController, public toastCtrl: ToastController, public backgroundMode: BackgroundMode, public dbProvider: DatabaseProvider, public produtosProvider: ProdutoProvider, public screen: ScreenOrientation) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.  
      localStorage.clear();

      this.screen.lock('portrait');
      
      statusBar.overlaysWebView(true);
      //statusBar.backgroundColorByHexString('#1ABC9C');
      //splashScreen.hide();

      // let connection = this.network.onDisconnect().subscribe(() =>{
      //   this.showAlert('Atenção', 'Sem conexão com a internet.');
      // });

      //this.checkNetwork();

      // this.backgroundMode.enable();
      // this.backgroundMode.on('activate').subscribe(data =>{
      //   this.backgroundMode.disableWebViewOptimizations();
      // })

      // this.backgroundMode.on('online').subscribe(data =>{

      // })

      //Criando o banco de dados
      dbProvider.createDatabase()
        .then(() => {
          // fechando a SplashScreen somente quando o banco for criado
          //this.inserirProdutos();
          this.openHomePage(splashScreen);
        })
        .catch(() => {
          // ou se houver erro na criação do banco
          this.openHomePage(splashScreen);
        });
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
