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
    produtos: any[] = [];
    items: any;
    lojas: any;
    loading: any;
    codPedido: any;
    teste: any;
    usuarioLogado: boolean;
    qtdPedido: any[];
    totalLoja: any;
    frete: any;
    freteArray: any[];
    api = "https://api.modazapp.online/api";
    //api = "http://localhost:65417/api";

    constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public navParams: NavParams,
        private http: HttpClient, public toastCtrl: ToastController, public alertCtrl: AlertController){
            this.totalLoja = 0;
            this.frete = 0;
            this.codPedido = this.navParams.get('CodPedido');
            this.initializeItems();
            this.usuarioLogado = this.validaLogin();
            this.freteArray = [];
    }

    initializeItems(){
        this.getPedidosPorLoja();

        this.showLoader();

        var dados = { 'CodPedido': this.codPedido };

        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ''){
            this.http.get(this.api + '/Pedidos/GetItemPedido?id=' + JSON.stringify(dados)).subscribe(data =>{
                this.items = data;
                this.produtos = this.items;
                this.qtdPedido = data[0].QtdPedido.split(',');
                
                this.produtos.forEach(element => {
                    this.totalLoja += element.ValorTotal;
                });

                this.frete += ((this.totalLoja * 0.01) > 5 ? this.totalLoja * 0.01 : 5);

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
        this.http.get(this.api + '/Pedidos/GetPedidosLoja?id=' + this.codPedido).subscribe(data => {
            this.lojas = data;
            this.lojas.forEach(element => {
                this.freteArray.push(element.NomeLoja + "|" + element.Frete + ";");
            });
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

        return total + this.frete;
    }

    calculoFrete(): any {
        var total = 0;
        var frete = 0;
        this.teste = <any[]>this.lojas;

        if(this.teste) {
            this.teste.forEach(element => {
                total += element.Frete < 5 ? 5 : element.Frete;
            });
            frete = total;
        } else {
            frete = 0;
        }

        this.frete = frete;
        
        return frete;
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