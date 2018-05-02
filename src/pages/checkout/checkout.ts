import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { FeedbackPage } from '../feedback/feedback';

@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html'
})
export class CheckoutPage{
    public carrinhoPage = CarrinhoPage;
    loading: any;
    contato: any;
    endereco: any;
    formaPgto: any;
    usuarioLogado: boolean;

    constructor(public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController, 
        public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController){
            this.contato = "";
            this.endereco = "";
            this.formaPgto = "";
            this.usuarioLogado = this.validaLogin();
    }

    finalizar(){
        this.showLoader();

        var dados = { 'TokenUsuario': localStorage.getItem('tokenLogin'), 'CodPedido': localStorage.getItem('CodPedido'), 'Contato': this.contato, 'Endereco': this.endereco, 'FormaPgto': this.formaPgto };

        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ''){            
            this.http.post("https://api.modazapp.online/api/pedidos/", dados).subscribe(data => {
            //this.http.post("http://localhost:65417/api/pedidos/", dados).subscribe(data => {                
                if(data == "Erro"){
                    this.loading.dismiss();
                    this.goLoginPage();
                }else{
                    localStorage.setItem("CodPedido", "");
                    this.showToast("top", "Pedido Finalizado!");
                    this.loading.dismiss();
                    this.goRootPage();
                }
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                this.loading.dismiss();
                this.goRootPage();
            });
        }else{
            this.loading.dismiss();
            this.navCtrl.push(LoginPage);
        }
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
        this.goRootPage();
        this.showToast("top", "Logoff realizado!");
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