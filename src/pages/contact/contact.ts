import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { LoginPage } from '../login/login';
import { ProdutosPage } from '../produtos/produtos';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  items: any;
  produtos: any;
  loading: any;
  public comprovante = "";
  showLoad: boolean;
  usuarioLogado: boolean;
  
  constructor(public navCtrl: NavController, private http: HttpClient, public location: Location, public platform: Platform,
    private loadingCtrl: LoadingController, public toastCtrl: ToastController, public camera: Camera, public alertCtrl: AlertController, public statusBar: StatusBar) {
      this.showLoad = true;
      this.initializeItems();
      this.usuarioLogado = this.validaLogin();
  }  
  
  initializeItems(): void{
    if(this.showLoad)
      this.showLoader();

    if(localStorage.getItem('Lojas') == "" || localStorage.getItem('Lojas') == null){
        this.http.get('https://api.modazapp.online/api/lojas').subscribe(data =>{
        //this.http.get('http://localhost:65417/api/lojas').subscribe(data =>{
        this.items = data;     
        localStorage.setItem('Lojas', JSON.stringify(data));
        this.loading.dismiss();
      }, (error) =>{
        this.showAlert('Erro', 'Falha na comunicação com o servidor');
        this.loading.dismiss();
      });
    }else{
      this.items = JSON.parse(localStorage.getItem('Lojas'));
      this.loading.dismiss();
    }
  }

  showLoader(){    
    this.loading = this.loadingCtrl.create({
      spinner: 'crescent',
      content: 'Carregando...'
    });

    this.loading.present();
  }

  getItems(ev:any){
    let val = ev.target.value;
      
    this.http.get('http://api.modazapp.online/api/produto/PesquisaProduto?id=' + val).subscribe(data =>{
      this.items = data;
    }, (error) =>{
      this.showAlert('Erro', 'Falha na comunicação com o servidor.');
      this.goRootPage();
    });
  }

  goLoginPage(){
    this.navCtrl.push(LoginPage);
  }

  goProdutos(idLoja: string): void{
    localStorage.setItem('IdLoja', idLoja);
    this.navCtrl.push(ProdutosPage, {
      IdLoja: idLoja
    });
  }

  goCarrinhoPage(){
    this.navCtrl.push(CarrinhoPage);
  }

  goPedidosPage(){
    this.navCtrl.push(PedidosPage);
  }

  goRootPage(): void{
    this.navCtrl.setRoot(HomePage);
    this.navCtrl.popToRoot();
  }

  goCamera(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
      // sourceType: this.camera.PictureSourceType.CAMERA,
      // correctOrientation: true
    }
    
    this.camera.getPicture(options).then((imageData) => {
     // imageData is either a base64 encoded string or a file URI
     // If it's base64:
     let base64Image = 'data:image/jpeg;base64,' + imageData;
     this.comprovante = base64Image;
    }, (err) => {
     // Handle error
     console.log(err);
    });
  }

  validaLogin(){
    if(localStorage.getItem("tokenLogin") != null && localStorage.getItem("tokenLogin")){
      return true;
    }else{
      return false;
    }
  }

  logoff(){
    localStorage.setItem("tokenLogin", "");
    localStorage.setItem("TipoUsuario", "");
    localStorage.setItem("IdUsuario", "");
    this.goRootPage();
    this.showToast("top", "Logoff realizado!");
  }

  doRefresh(refresher) {
    this.showLoad = false;
    localStorage.setItem('Lojas', "");
    this.initializeItems();
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
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