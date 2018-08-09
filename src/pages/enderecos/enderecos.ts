import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { FeedbackPage } from '../feedback/feedback';
import { NovoEnderecoPage } from '../novoEndereco/novoEndereco';

@Component({
    selector: 'page-enderecos',
    templateUrl: 'enderecos.html'
})
export class EnderecosPage{
    public carrinhoPage = CarrinhoPage;
    loading: any;
    items: any;    

    constructor(public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController,
        public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController){
            this.initializeItems();
    }

    initializeItems(){
        this.showLoader();

        this.http.get('https://api.modazapp.online/api/Usuarios/GetEnderecos?id=' + localStorage.getItem("IdUsuario")).subscribe(data => {
        //this.http.get('http://localhost:65417/api/Usuarios/GetEnderecos?id=' + localStorage.getItem("IdUsuario")).subscribe(data => {
            this.items = data;
            this.loading.dismiss();
        }, (error) => {
            console.error(error);
        })
    }

    novoEndereco(){
        this.navCtrl.push(NovoEnderecoPage);
    }

    validaLogin(){
        if(localStorage.getItem("tokenLogin") != null && localStorage.getItem("tokenLogin")){
          return true;
        }else{
          return false;
        }
    }

    goDetalhesEndereco(idEndereco){
        this.navCtrl.push(NovoEnderecoPage, { IdEndereco: idEndereco });
    }

    goLoginPage(){
        this.navCtrl.push(LoginPage);
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

    logoff(){
        localStorage.setItem("tokenLogin", "");
        localStorage.setItem("TipoUsuario", "");
        localStorage.setItem("IdUsuario", "");
        localStorage.setItem("NomeUsuario", "");
        this.goRootPage();
        this.showToast("top", "Logoff realizado!");
    }

    showLoader(){    
        this.loading = this.loadingCtrl.create({
          content: "Carregando..."
        });
    
        this.loading.present();
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