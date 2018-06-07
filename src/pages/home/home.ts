import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { LoginPage } from '../login/login';
import { ProdutosPage } from '../produtos/produtos';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { FeedbackPage } from '../feedback/feedback';
import { PerfilPage } from '../perfil/perfil';
import { StatusBar } from '@ionic-native/status-bar';
import { Platform } from 'ionic-angular';
import { LojasProvider } from '../../providers/lojas/lojas';
import { ProdutoProvider } from '../../providers/produto/produto';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {    
  public carrinhoPage = CarrinhoPage;
  items: any;
  loading: any;
  public comprovante = "";
  showLoad: boolean;  
  lojas: any[] = [];
  searchText: string = null;
  usuarioLogado: boolean;
  pedidos: any;
  results: any;
  cidade: any;
  uf: any;
  
  constructor(public navCtrl: NavController, private http: HttpClient, public location: Location, public platform: Platform, public lojasProvider: LojasProvider,
    private loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public statusBar: StatusBar, public produtosProvider: ProdutoProvider) {
      this.showLoad = true;
      //this.obterCidade();
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
    
    // this.lojasProvider.getAll(this.searchText)
    //   .then((result: any[]) => {
    //     this.items = result;
    //     localStorage.setItem('Lojas', JSON.stringify(result));
    //     this.loading.dismiss();
    // });
  }

  obterCidade(){
    if(navigator){
      navigator.geolocation.getCurrentPosition(pos => {
        this.http.get('http://maps.googleapis.com/maps/api/geocode/json?latlng=' + pos.coords.latitude + ',' + pos.coords.longitude).subscribe(data => {
          this.results = data;
          this.cidade = this.results.results[1].address_components[4].short_name;
          this.uf = this.results.results[1].address_components[6].short_name;
          console.log(this.cidade + '-' + this.uf);
        })
      })
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

    if(val && val.trim() != ''){
      this.items = this.items.filter((item) => {
        return (item.Nome.toLowerCase().indexOf(val.toLowerCase()) > -1);        
      })
    }else{
      this.initializeItems();
    }
  }

  goLoginPage(){
    this.navCtrl.push(LoginPage);
  }

  goPerfilPage(){
    this.navCtrl.push(PerfilPage);
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