import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { Camera } from '@ionic-native/camera';
import { LoginPage } from '../login/login';
import { ProdutosPage } from '../produtos/produtos';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { FeedbackPage } from '../feedback/feedback';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  lojas: any[] = [];
  items: any;
  produtos: any;
  loading: any;
  public comprovante = "";
  showLoad: boolean;
  usuarioLogado: boolean;
  page = 1;
  isLoadingMore = false;
  api = "https://api.modazapp.online/api";  
  //api = "http://localhost:65417/api";
  
  constructor(public navCtrl: NavController, private http: HttpClient, public location: Location, public platform: Platform,
    private loadingCtrl: LoadingController, public toastCtrl: ToastController, public camera: Camera, public alertCtrl: AlertController, public statusBar: StatusBar) {
      this.showLoad = true;
      this.initializeItems();
      this.usuarioLogado = this.validaLogin();
  }  
  
  initializeItems(): void{
    this.showLoader();
    
    this.http.get(this.api + '/Lojas/GetLojasPaginacao?paginaAtual=' + this.page).subscribe(data =>{
      this.items = data;
      this.page = this.page + 1;

      this.lojas.push(this.items);

      this.loading.dismiss();
    }, (error) =>{
      console.log(error);
      this.showAlert('Erro', 'Falha na comunicação com o servidor');
      this.loading.dismiss();
    });
  }

  doInfinite(infiniteScroll){
    if(this.isLoadingMore)
      return;

    this.isLoadingMore = true;

    setTimeout(() => {
        this.http.get(this.api + '/Lojas/GetLojasPaginacao?paginaAtual=' + this.page).subscribe(data =>{
            this.items = data;
            this.page = this.page + 1;

            this.lojas.push(this.items);

            infiniteScroll.complete();
            this.isLoadingMore = false;
        }, (error) =>{
            this.showAlert('Erro', 'Falha na comunicação com o servidor.');
            this.goRootPage();
        });
    });
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
      
    this.http.get(this.api + '/produto/PesquisaProduto?id=' + val).subscribe(data =>{
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
    this.navCtrl.push(FeedbackPage);
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
    localStorage.setItem("NomeUsuario", "");
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