import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
import { CarrinhoPage } from '../carrinho/carrinho';
import { LoginPage } from '../login/login';
import { DetalhesPedidoPage } from '../detalhespedido/detalhespedido';
import { FeedbackPage } from '../feedback/feedback';

@Component({
    selector: 'page-pedidos',
    templateUrl: 'pedidos.html'
})
export class PedidosPage{
    public carrinhoPage = CarrinhoPage;
    items: Object;
    loading: any;
    idLoja: any;
    idUsuario: any;
    total: any;
    teste: any;
    usuarioLogado: boolean;
    showLoad: boolean;

    constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public alertCtrl: AlertController,
        private http: HttpClient, public toastCtrl: ToastController){
            this.initializeItems();
            this.usuarioLogado = this.validaLogin();
    }

    initializeItems(): void{
        // this.items = JSON.parse(localStorage.getItem('Pedidos'));
        this.getItems();
    }

    getItems(){
        this.showLoader();
        this.http.get('https://api.modazapp.online/api/Pedidos/GetPedidosCliente?id=' + localStorage.getItem("IdUsuario")).subscribe(data =>{
        //this.http.get('http://localhost:65417/api/Pedidos/GetPedidosCliente?id=' + localStorage.getItem("IdUsuario")).subscribe(data =>{
          this.items = data;
          this.loading.dismiss();
        }, (error) =>{
            this.showAlert('Erro', error.message);
            this.loading.dismiss();
            this.goRootPage();
        });
    }

    doRefresh(refresher) {
        localStorage.setItem('Pedidos', "");
        this.getItems();
        console.log('Begin async operation', refresher);
    
        setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
        }, 2000);
      }

    goLoginPage(){
        this.navCtrl.push(LoginPage);
    }

    goCarrinhoPage(){
        this.navCtrl.push(CarrinhoPage);
    }

    goDetalhesPedido(codPedido: string){
        this.navCtrl.push(DetalhesPedidoPage, {CodPedido: codPedido});
    }

    goRootPage(): void{
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }

    goCamera(){
        this.navCtrl.push(FeedbackPage);
    }

    logoff(){
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

    showLoader(){    
        this.loading = this.loadingCtrl.create({
          content: "Carregando..."
        });
    
        this.loading.present();
    }

    validaLogin(){
        if(localStorage.getItem("tokenLogin") != null && localStorage.getItem("tokenLogin")){
          return true;
        }else{
          return false;
        }
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