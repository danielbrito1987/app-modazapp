import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
import { CarrinhoPage } from '../carrinho/carrinho';
import { LoginPage } from '../login/login';
import { FeedbackPage } from '../feedback/feedback';

@Component({
    selector: 'page-detalhesPedido',
    templateUrl: 'detalhespedido.html'
})
export class DetalhesPedidoPage{
    public carrinhoPage = CarrinhoPage;
    items: any;
    lojas: any;
    loading: any;
    codPedido: any;
    teste: any;
    usuarioLogado: boolean;
    qtdPedido: any[];

    constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public navParams: NavParams,
        private http: HttpClient, public toastCtrl: ToastController, public alertCtrl: AlertController){
            this.codPedido = this.navParams.get('CodPedido');
            this.initializeItems();
            this.usuarioLogado = this.validaLogin();                  
    }

    initializeItems(){
        this.getPedidosPorLoja();

        this.showLoader();

        var dados = { 'CodPedido': this.codPedido };

        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ''){
            this.http.get('http://api.modazapp.online/api/Pedidos/GetItemPedido?id=' + JSON.stringify(dados)).subscribe(data =>{
            //this.http.get('http://localhost:65417/api/Pedidos/GetItemPedido?id=' + JSON.stringify(dados)).subscribe(data =>{                
                this.items = data;
                console.log(this.items);
                this.qtdPedido = data[0].QtdPedido.split(',');

                this.loading.dismiss();
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                this.loading.dismiss();
                this.goRootPage();
            });
        }else{
            this.goLoginPage();
        }
    }

    getPedidosPorLoja(){
        this.http.get('https://api.modazapp.online/api/Pedidos/GetPedidosLoja?id=' + this.codPedido).subscribe(data => {
        //this.http.get('http://localhost:65417/api/Pedidos/GetPedidosLoja?id=' + this.codPedido).subscribe(data => {
            this.lojas = data;
        }, (error) =>{
            this.showAlert('Erro', 'Falha na comunicação com o servidor.');
            this.loading.dismiss();
            this.goRootPage();
        });
    }

    valorTotal(): any{
        var total = 0;
        this.teste = <any[]>this.items;

        if(this.teste){
            this.teste.forEach(element => {
                total += element.ValorTotal            
            });
        }
        else{
            total = 0;
        }

        return total;
    }

    goLoginPage(){
        this.navCtrl.push(LoginPage);
    }

    goCarrinhoPage(){
        this.navCtrl.push(CarrinhoPage);
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

    showToast(position: string, msg: string){
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 2000,
            position: position
        });
    
        toast.present(toast);
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

    showAlert(titulo: string, texto: string) {
        let alert = this.alertCtrl.create({
          title: titulo,
          subTitle: texto,
          buttons: ['OK']
        });
        alert.present();
    }
}