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
import { ProdutoProvider } from '../../providers/produto/produto';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder } from '@ionic-native/native-geocoder';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {    
  public carrinhoPage = CarrinhoPage;
  items: any;
  loading: any;
  public comprovante = "";
  showLoad: boolean = true;  
  lojas: any[] = [];
  searchText: string = null;
  usuarioLogado: boolean;
  pedidos: any;
  results: any;
  cidade: any = "";
  uf: any = "";
  conexao: boolean;
  rootPage: any;
  qtdLojasCidade: any = 1;
  cidadeAnterior: any;
  procurando = true;
  api = "https://api.modazapp.online/api";
  //api = "http://localhost:65417/api";
    
  constructor(private geolocation: Geolocation, public navCtrl: NavController, private http: HttpClient, public location: Location, public platform: Platform, public geocoder: NativeGeocoder,
    private loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController, public statusBar: StatusBar, public produtosProvider: ProdutoProvider) {      
      console.log(localStorage.getItem('Navegacao'));
      if(localStorage.getItem('Navegacao') != "" && localStorage.getItem('Navegacao') != null && localStorage.getItem('Navegacao') != undefined){
        this.obterGeolocalizacao();
        // this.initializeItems();      
        this.usuarioLogado = this.validaLogin();
      }
  }  
  
  initializeItems(): void{
    this.showLoader();

    this.http.get(this.api + '/Lojas/GetLojasPelaCidade?cidade=' + this.cidade).subscribe(data =>{
      this.items = data;
      
      this.qtdLojasCidade = this.items.length;

      localStorage.setItem('Lojas', JSON.stringify(data));

      this.loading.dismiss();
      this.procurando = false;
    }, (error) =>{
      this.showAlert('Erro', 'Falha na comunicação com o servidor');
      this.loading.dismiss();
    });
  }

  initializeItemsLocalizaao(): void{
    this.http.get(this.api + '/Lojas/GetLojasPelaCidade?cidade=' + this.cidade).subscribe(data =>{
      this.items = data;
      
      this.qtdLojasCidade = this.items.length;

      this.procurando = false;
      //localStorage.setItem('Lojas', JSON.stringify(data));
    }, (error) =>{
      this.showAlert('Erro', 'Falha na comunicação com o servidor');
    });
  }

  obterGeolocalizacao(){
    this.geolocation.watchPosition().subscribe((data) => {
      // this.geocoder.reverseGeocode(data.coords.latitude, data.coords.longitude).then(result => {
      //   console.log(result);
      // })
      //if(this.latAnterior != data.coords.latitude && this.longAnterior != data.coords.longitude)
      this.obterCidade(data.coords.latitude, data.coords.longitude);
    });
  }

  obterCidade(lat: any, long: any){
    this.cidadeAnterior = localStorage.getItem("Cidade");

    this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + long + '&key=AIzaSyCNn2lJChxvDkleHdqYUORmrSfIn_vkiVk').subscribe(data => {
      this.results = data;

      this.cidade = this.results.results[2].address_components[0].short_name;
      this.uf = this.results.results[2].address_components[1].short_name;
      // this.cidade = this.results.results[1].address_components[4].short_name;
      // this.uf = this.results.results[1].address_components[6].short_name;
      localStorage.setItem('Cidade', this.cidade);
      localStorage.setItem('UF', this.uf);

      if(this.cidadeAnterior != this.cidade)
        this.initializeItemsLocalizaao();
    })
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
    //this.navCtrl.popToRoot();
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

  removeAcentuacao(palavra){
    var string = palavra;

    var mapaAcentosHex = {
      a : /[\xE0-\xE6]/g,
      e : /[\xE8-\xEB]/g,
      i : /[\xEC-\xEF]/g,
      o : /[\xF2-\xF6]/g,
      u : /[\xF9-\xFC]/g,
      c : /\xE7/g,
      n : /\xF1/g
    };

    for(var letra in mapaAcentosHex){
      var expressaoRegular = mapaAcentosHex[letra];
      palavra = string.replace(expressaoRegular, letra);
    }

    return string;
  }
}