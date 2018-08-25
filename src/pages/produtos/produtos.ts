import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { DetalhesProdutoPage } from '../detalhesproduto/detalhesproduto';
import { FeedbackPage } from '../feedback/feedback';
//import { LocalNotifications } from '@ionic-native/local-notifications';
import { EspecificacaoProdutoPage } from '../especicifacaoproduto/especificacaoproduto';
import { ProdutoProvider } from '../../providers/produto/produto';

@Component({
    selector: 'page-produtos',
    templateUrl: 'produtos.html'
})
export class ProdutosPage{
    public carrinhoPage = CarrinhoPage;
    produtos: any[] = [];
    items: any;
    loading: any;
    idLoja: any;
    idCarrinho: any;
    tam: any;
    showLoad: boolean;
    dataRegistro: any;
    usuarioLogado: boolean;
    tipoUsuario: any;
    page = 1;
    errorMessage: string;
    api = "https://api.modazapp.online/api";
    //api = "http://localhost:65417/api";

    constructor(public platform: Platform, public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController,
        public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, public provider: ProdutoProvider){
            this.tam = "P";
            this.showLoad = true;
            this.idLoja = this.navParams.get('IdLoja');
            this.tipoUsuario = localStorage.getItem('TipoUsuario');            

            this.initializeItems();
            this.usuarioLogado = this.validaLogin();
    }

    initializeItems(): void{
        if(this.showLoad)
            this.showLoader();
                        
            this.http.get(this.api + '/produto/GetProdutosPelaLojaPaginacao?id=' + this.idLoja + "&paginaAtual=" + this.page).subscribe(data =>{
                this.items = data;
                this.page = this.page + 1;

                this.produtos.push(this.items);

                console.log(this.produtos);
                                
                this.loading.dismiss();
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                this.loading.dismiss();
                this.goRootPage();
        });
    }

    doInfinite(infiniteScroll){
        setTimeout(() => {
            this.http.get(this.api + '/produto/GetProdutosPelaLojaPaginacao?id=' + this.idLoja + "&paginaAtual=" + this.page).subscribe(data =>{
                this.items = data;
                this.page = this.page + 1;

                this.produtos.push(this.items);

                infiniteScroll.complete();
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                this.loading.dismiss();
                this.goRootPage();
            });
        });
    }

    getItems(ev:any){
        let val = ev.target.value;
        
        if(val && val.trim() != ''){
            this.items = this.items.filter((item) => {
            console.log(val);
            return (item.Descricao.toLowerCase().indexOf(val.toLowerCase()) > -1);        
            })
        }else{            
            this.initializeItems();
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

    goDetalhes(idProduto: string): void{
        this.navCtrl.push(DetalhesProdutoPage, {
            IdProduto: idProduto
        });
    }

    goEspecificacaoPage(idProduto: string): void{
        this.navCtrl.push(EspecificacaoProdutoPage, {
            IdProduto: idProduto
        });
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

    comprar(idProduto: any){   
        if(this.showLoad)     
            this.showLoader();

        var dados = { 'IdProduto': idProduto, 'Usuario': localStorage.getItem("tokenLogin"), 'IdLoja': this.idLoja, "CodPedido": localStorage.getItem("CodPedido"), 'Tamanho': this.tam };

        // if(this.qtdP <= 0 && this.qtdM <= 0 && this.qtdG <= 0 && this.qtdGG <= 0 && this.qtdXG <= 0 && this.qtdXGG <= 0){
        //     this.loading.dismiss();
        //     this.showAlert('Atenção', 'Não é permitido comprar com quantidade 0 (zero).');
        // }
        // else
        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ''){
            localStorage.setItem("Produto", idProduto);

            this.http.post(this.api + "/carrinho/", dados).subscribe(data => {
                if(data == "Erro"){
                    this.loading.dismiss();
                    this.goLoginPage();
                }else{
                    this.idCarrinho = data["IdCarrinho"];
                    this.dataRegistro = data["DataRegistro"];
                    this.agendarNotificacao();
                    localStorage.setItem("CodPedido", data["codPedido"]);
                    
                    this.showToast("top", "Adicionado ao carrinho!");
                    this.loading.dismiss();
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

    agendarNotificacao(){
        // this.localNotifications.schedule({
        //     id: 1,
        //     title: 'Atenção',
        //     text: 'Tempo limite para finalizar o seu carrinho está se aproximando.',
        //     at: new Date(this.dataRegistro).getSeconds() + 5
        // });
    }

    doRefresh(refresher) {
        this.showLoad = false;
        localStorage.setItem('Produtos' + this.idLoja, "");
        this.initializeItems();
        console.log('Begin async operation', refresher);
    
        setTimeout(() => {
          console.log('Async operation has ended');
          refresher.complete();
        }, 2000);
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