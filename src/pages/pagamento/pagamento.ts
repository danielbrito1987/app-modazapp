import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { FeedbackPage } from '../feedback/feedback';
import { NovoPagamentoPage } from '../novoPagamento/novoPagamento';

const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:8100',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT,OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization, Origin, Accept',
      'Authorization': 'Basic ODZlNDk1ZmJlYzEwYjUzMWE2MzljMmQyNDgwNTYwNjM6'
    })
};

@Component({
    selector: 'page-pagamento',
    templateUrl: 'pagamento.html'
})
export class PagamentoPage{
    public carrinhoPage = CarrinhoPage;
    loading: any;
    items: any;    
    apiIugu = "https://api.iugu.com/v1";
    //apiIugu = "/iugu";

    constructor(public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController,
        public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController){
            this.initializeItems();
    }

    initializeItems(){
        this.showLoader();
        
        this.http.get(this.apiIugu + '/customers/' + localStorage.getItem("IdIugu") + '/payment_methods', httpOptions).subscribe(data => {
            this.items = data;
            this.loading.dismiss();
        }, (error) => {
            console.error(error);
        })
    }

    novoPagamento(){
        this.navCtrl.push(NovoPagamentoPage);
    }

    goDetalhesPagamento(id){
        this.navCtrl.push(NovoPagamentoPage, { id: id });
    }

    validaLogin(){
        if(localStorage.getItem("tokenLogin") != null && localStorage.getItem("tokenLogin")){
          return true;
        }else{
          return false;
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