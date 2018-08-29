import { Component, ViewChild } from '@angular/core';
import { Platform, ToastController, AlertController, MenuController, ModalController, Nav } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/tabs/tabs';
import { BackgroundMode } from '@ionic-native/background-mode';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { OneSignal } from '@ionic-native/onesignal';
import { AppVersion } from '@ionic-native/app-version';
import { PerfilPage } from '../pages/perfil/perfil';
import { EnderecosPage } from '../pages/enderecos/enderecos';
import { PagamentoPage } from '../pages/pagamento/pagamento';
import { LoginPage } from '../pages/login/login';
import { ModalNavegacao } from '../modals/navegacao/navegacao';
import { ImageLoaderConfig } from 'ionic-image-loader';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;
  dataRegistroCarrinho: any;
  versao: any = "1.0.1.3";
  usuarioLogado: boolean;
  nomeUsuario: any = "Bem Vindo!";
  navegacao: string;
  @ViewChild(Nav) nav: Nav;

  constructor(private modalCtrl: ModalController, private appVersion: AppVersion, private oneSignal: OneSignal, public menuCtrl: MenuController, public platform: Platform, public http: HttpClient, public statusBar: StatusBar, public splashScreen: SplashScreen, public alertCtrl: AlertController, public toastCtrl: ToastController, public backgroundMode: BackgroundMode, public screen: ScreenOrientation, private imageLoaderConfig: ImageLoaderConfig) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      setTimeout(function(){
        splashScreen.hide();
      }, 500);

      this.imageLoaderConfig.enableFallbackAsPlaceholder(true);
      this.imageLoaderConfig.enableSpinner(true);
      this.imageLoaderConfig.setFallbackUrl("https://api.modazapp.online/Content/imagens/SemImagem.png");

      this.navegacao = localStorage.getItem('Navegacao');

      localStorage.setItem('tokenLogin', '');
      localStorage.setItem('IdUsuario', '');
      localStorage.setItem('EmailUsuario', '');
      localStorage.setItem('NomeUsuario', '');
      localStorage.setItem('TipoUsuario', '');
      localStorage.setItem('Pedidos', '');
      localStorage.setItem('Cidade', '');
      localStorage.setItem('UF', '');
            
      statusBar.overlaysWebView(false);
      this.statusBar.backgroundColorByHexString('#11856E');

      this.oneSignal.startInit('246b0a5b-d522-453e-b08f-7ab8707852e0');

      this.oneSignal.getIds().then(data => {
        localStorage.setItem('PlayerId', data.userId);
      })
            
      this.oneSignal.endInit();

      setTimeout(() => {
        this.appVersion.getVersionNumber().then(value => {
          this.versao = value;
        });
      });

      setInterval(() => {
        this.usuarioLogado = this.validaLogin();
      }, 1000);
      
      //this.openHomePage(splashScreen);

      if(localStorage.getItem('Navegacao') == null || localStorage.getItem('Navegacao') == "" || localStorage.getItem('Navegacao') == undefined){
        this.rootPage = ModalNavegacao;
        this.openModalNavegacao('inicio');
      }else{
        this.rootPage = TabsPage;
      }
    });
  }

  private openHomePage(splashScreen: SplashScreen) {
    this.rootPage = TabsPage;
  }

  openPerfilPage(){
    this.nav.push(PerfilPage);
    this.menuCtrl.close();
  }

  openEnderecosPage(){
    this.nav.push(EnderecosPage);
    this.menuCtrl.close();
  }

  openPagamentoPage(){
    this.nav.push(PagamentoPage);
    this.menuCtrl.close();
  }

  openLoginPage(){
    this.nav.push(LoginPage);
    this.menuCtrl.close();
  }

  openModalNavegacao(origem: any){
    let modal = this.modalCtrl.create(ModalNavegacao, { Origem: origem });
    setTimeout(() => {
      modal.present();
    });

    modal.onDidDismiss(() => {
      this.rootPage = TabsPage;
    });
  }

  goRootPage(): void{
    this.nav.setRoot(TabsPage);
    this.nav.popToRoot();    
  }

  logoff(){
    this.menuCtrl.close();
    localStorage.setItem("tokenLogin", "");
    localStorage.setItem("TipoUsuario", "");
    localStorage.setItem("IdUsuario", "");
    this.goRootPage();
    this.showToast("top", "Logoff realizado!");
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

  validaLogin(){
    if(localStorage.getItem("tokenLogin") != null && localStorage.getItem("tokenLogin")){
      this.nomeUsuario = localStorage.getItem("NomeUsuario");
      return true;
    }else{
      this.nomeUsuario = "Bem Vindo!"
      return false;
    }
  }
}