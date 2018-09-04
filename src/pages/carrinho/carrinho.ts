import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
import { CheckoutPage } from '../checkout/checkout';
import { PedidosPage } from '../pedidos/pedidos';
import { LoginPage } from '../login/login';
import { FeedbackPage } from '../feedback/feedback';

@Component({
    selector: 'page-carrinho',
    templateUrl: 'carrinho.html'
})
export class CarrinhoPage{
    items: Object;
    loading: any;
    idLoja: any;
    idUsuario: any;
    total: any;
    teste: any;
    usuarioLogado: boolean;
    qtdItems: any;
    qtdPedido: any[];
    carrinhoIugu: any[];
    api = "https://api.modazapp.online/api";
    //api = "http://localhost:65417/api";

    constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, public alertCtrl: AlertController,
        private http: HttpClient, public toastCtrl: ToastController){
            this.initializeItems();
            this.usuarioLogado = this.validaLogin();
    }

    initializeItems(): void{
        this.showLoader();

        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ''){
            this.http.get(this.api + '/Carrinho/GetCarrinhoPeloId?id=' + localStorage.getItem("tokenLogin")).subscribe(data =>{
                this.qtdPedido = [];
                this.qtdItems = [];
                this.carrinhoIugu = [];

                this.items = data;
                this.qtdItems = data;
                
                if(this.qtdItems.length > 0){ 
                    for(let i = 0; i < this.qtdItems.length; i++){
                        this.qtdPedido = data[i]['qtdPedido'].split(',');
                    }                    
                    //console.log(data[0]['qtdPedido'].split(','));
                    localStorage.setItem('Carrinho', JSON.stringify(data));

                    this.qtdItems.forEach(element => {
                        var valor = parseFloat(element.valorProduto).toFixed(2).replace('.', '');
                        var qtd = element.valorTotal / element.valorProduto;
                        this.carrinhoIugu.push({ 'description': element.descProduto, 'quantity': qtd, 'price_cents': valor });
                    });

                    localStorage.setItem('ItemIUGU', JSON.stringify(this.carrinhoIugu));
                    localStorage.setItem('CodPedido', data[0]['codPedido']);
                    this.loading.dismiss();
                }else{
                    this.loading.dismiss();
                }
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                this.loading.dismiss();
                this.goRootPage();
            });
        }else{
            this.goLoginPage();
        }     
    }

    public valorTotal(): any{
        var total = 0;
        this.teste = <any[]>this.items;

        if(this.teste){
            this.teste.forEach(element => {
                total += element.valorTotal            
            });
        }
        else{
            total = 0;
        }

        return total;
    }

    validaLogin(){
        if(localStorage.getItem("tokenLogin") != null && localStorage.getItem("tokenLogin")){
            return true;
        }else{
            return false;
        }
    }

    getItems(){
        this.showLoader();
        this.http.get(this.api + '/Carrinho/GetCarrinhoPeloId?id=' + localStorage.getItem("tokenLogin")).subscribe(data =>{
          this.items = data;      
          this.loading.dismiss();
        }, (error) =>{
            this.showAlert('Erro', 'Falha na comunicação com o servidor.');
            this.loading.dismiss();
            this.goRootPage();
        });
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

    goCheckou(){
        this.navCtrl.push(CheckoutPage, { 'TotalPedido': this.valorTotal() });
    }

    goRootPage(): void{
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }

    removeItem(item: any){
        console.log(item);
        this.http.get(this.api + '/Carrinho/AtualizaCarrinho?id=' + item).subscribe(
            resp => this.getItems(),
            (err) => { this.showToast('top', 'Erro ao excluir o item do carrinho.' + '<br />' + err.message); console.log(err) }
        );
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