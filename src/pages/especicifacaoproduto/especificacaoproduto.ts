import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { FeedbackPage } from '../feedback/feedback';

@Component({
    selector: "page-especificacaoProduto",
    templateUrl: "especificacaoproduto.html"
})
export class EspecificacaoProdutoPage{
    items: any;
    loading: any;
    idProduto: any;
    idLoja: any;
    showLoad: boolean;
    usuarioLogado: boolean;

    constructor(public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController, public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController){
        this.showLoad = true;
        this.idProduto = this.navParams.get('IdProduto');
        this.initializeItems();
        this.usuarioLogado = this.validaLogin();
    }

    initializeItems(): void{
        if(this.showLoad)
            this.showLoader();
        
        //if(localStorage.getItem('Produtos' + this.idProduto) == "" || localStorage.getItem('Produtos' + this.idProduto) == null){
        this.http.get('https://api.modazapp.online/api/produto/GetProdutoId?id=' + this.idProduto).subscribe(data =>{
        //this.http.get('http://localhost:65417/api/produto/GetProdutoId?id=' + this.idProduto).subscribe(data =>{
            this.items = data;
            this.loading.dismiss();
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                this.loading.dismiss();
                this.goRootPage();
        });
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

    goLoginPage(){
        this.navCtrl.push(LoginPage);
    }

    goCarrinhoPage(){
        this.navCtrl.push(CarrinhoPage);
    }

    goPedidosPage(){
        this.navCtrl.push(PedidosPage);
    }

    goDetalhesPage(){
        this.navCtrl.pop();
    }

    goRootPage(): void{
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }

    validaLogin(){
        if(localStorage.getItem("tokenLogin") != null && localStorage.getItem("tokenLogin")){
          return true;
        }else{
          return false;
        }
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