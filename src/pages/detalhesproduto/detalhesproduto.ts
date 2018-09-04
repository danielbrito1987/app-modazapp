import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { FeedbackPage } from '../feedback/feedback';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { EspecificacaoProdutoPage } from '../especicifacaoproduto/especificacaoproduto';
import { OneSignal } from '@ionic-native/onesignal';
import { SocialSharing } from '@ionic-native/social-sharing';
import * as moment from 'moment';
import * as $ from 'jquery';

@Component({
    selector: "page-detalhesProduto",
    templateUrl: "detalhesproduto.html"
})
export class DetalhesProdutoPage{
    public carrinhoPage = CarrinhoPage;
    items: any;
    imagens: any;
    loading: any;
    idProduto: any;
    idCarrinho: any;
    idLoja: any;
    tam: any;
    showLoad: boolean;
    dataRegistro: any;
    isAndroid: boolean;
    usuarioLogado: boolean;
    tipoUsuario: any;
    esconderDiv: boolean;
    estoque = [];
    qtdPedido = [];
    carrinho = [];
    totalQtd: number = 0;
    valorProduto: number;
    navegacao: string;
    divAnterior: string;
    api = "https://api.modazapp.online/api";
    //api = "http://localhost:65417/api";

    constructor(private socialSharing: SocialSharing, private oneSignal: OneSignal, public platform: Platform, public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController,
        public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, private localNotification: LocalNotifications){
            this.tam = "P";
            this.showLoad = true;
            this.idProduto = this.navParams.get('IdProduto');            
            this.usuarioLogado = this.validaLogin();
            this.tipoUsuario = localStorage.getItem('TipoUsuario');
            this.navegacao = localStorage.getItem('Navegacao');
            this.esconderDiv = false;            
            this.initializeItems();
    }

    hideDiv(id: string){
        if(this.divAnterior == ""){
            $('#div' + id).show();

            this.divAnterior = id;
        }
        else
        if(this.divAnterior != id){
            $('#div' + this.divAnterior).hide();
            $('#div' + id).show();

            this.divAnterior = id;
        }
    }

    ionViewDidLoad(){
        let trimdate = new Date().toISOString();
        let hours = new Date().getHours() + 1;
        let minutes = new Date().getMinutes();

        let hour = ""
        let minute = ""
        let second = ""
        if (hours < 10) {
          hour += "0" + hours + ":"
        } else {
          hour += hours + ":"
        }
        if (minutes < 10) {
          minute += "0" + minutes + ":"
        } else {
          minute += minutes + ":"
        }
        second += "00"
    
        let currenttime = hour + minute + second;
        this.dataRegistro = trimdate.substring(0, 10) + " " + currenttime;
    }

    initializeItems(): void{                
        if(this.showLoad)
            this.showLoader();
        
        this.http.get(this.api + '/produto/GetProdutoId?id=' + this.idProduto).subscribe(data =>{
            this.items = data;
            localStorage.setItem('DescricaoProduto', data[0]['Descricao']);

            if(this.navegacao == "Varejo")
                this.valorProduto = parseFloat(data[0]['Valor']);
            else if(this.navegacao == "Atacado")
                this.valorProduto = parseFloat(data[0]['ValorAtacado']);
            
            this.estoque = data[0].Estoque.split(',');

            this.estoque.forEach(element => {            
                this.qtdPedido.push({ tamanho: element.split(':')[0].trim(), qtd: '' });
            });

            this.loading.dismiss();            
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                this.loading.dismiss();
                this.goRootPage();
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

    compartilharProduto(){
        var descricao = localStorage.getItem('DescricaoProduto');
        this.socialSharing.share(descricao + ' - ' + 'R$ ' + this.valorProduto, 'Produto').then(() => {
            
        }).catch((error) => {
            console.log(error);
        })
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

    goDetalhes(idLoja: string): void{
        this.navCtrl.push(DetalhesProdutoPage, {
            IdLoja: idLoja
        });
    }

    goEspecificacao(idProduto: string): void{
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

        this.idLoja = localStorage.getItem('IdLoja');

        var qtd = [];

        this.qtdPedido.forEach(element => {
            this.totalQtd += element.qtd != "" ? parseFloat(element.qtd) : 0;
            qtd.push(element.tamanho + ':' + parseFloat(element.qtd != "" ? element.qtd : 0));
        });

        //this.valorProduto = parseFloat(this.valorProduto.toString().replace('.', ',')) * this.totalQtd;

        var vlrProd = this.valorProduto.toFixed(2).replace('.', '');
        
        var dados = { 'IdProduto': idProduto, 'Usuario': localStorage.getItem("tokenLogin"), "CodPedido": localStorage.getItem("CodPedido"), 'Tamanho': this.tam, 'IdLoja': this.idLoja, 'QtdPedido': JSON.stringify(qtd), 'ValorProduto': this.valorProduto.toFixed(2) };
                
        if(localStorage.getItem('ItemIUGU') == "" || localStorage.getItem('ItemIUGU') == null){
            this.carrinho.push({ 'description': localStorage.getItem('DescricaoProduto'), 'quantity': this.totalQtd, 'price_cents': parseFloat(vlrProd) });
            localStorage.setItem('ItemIUGU', JSON.stringify(this.carrinho));
        }else{
            this.carrinho = JSON.parse(localStorage.getItem('ItemIUGU'));
            this.carrinho.push({ 'description': localStorage.getItem('DescricaoProduto'), 'quantity': this.totalQtd, 'price_cents': parseFloat(vlrProd) });
            localStorage.setItem('ItemIUGU', JSON.stringify(this.carrinho));
        }

        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ''){
            localStorage.setItem("Produto", idProduto);

            this.http.post(this.api + "/Carrinho/PostCarrinho?id=", dados).subscribe(data => {
                if(data == "Erro"){
                    this.loading.dismiss();
                    this.goLoginPage();
                }else{
                    this.idCarrinho = data["idCarrinho"];

                    if(localStorage.getItem('ExpirarCarrinho') == null || localStorage.getItem('ExpirarCarrinho') == "")
                        this.agendarNotificacao();

                    localStorage.setItem("CodPedido", data["codPedido"]);
                    this.showToast("top", "Adicionado ao carrinho!");
                    this.loading.dismiss();

                    this.navCtrl.pop();
                }
            }, (error) =>{
                console.log(error);
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
        if(localStorage.getItem("ExpirarCarrinho") != null && localStorage.getItem("ExpirarCarrinho") != ""){
            this.isAndroid = true;
            this.dataRegistro = new Date(new Date().getHours() + 1);
            localStorage.setItem('ExpirarCarrinho', this.dataRegistro);
                    
            this.localNotification.schedule({
                id: 1,
                title: 'Atenção',
                sound: this.isAndroid ? 'file://sound.mp3': 'file://beep.caf',
                text: 'Você tem mais 1 hora para finalizar o seu pedido.',
                trigger: { at: this.dataRegistro }
            });
        }
    }

    doRefresh(refresher) {
        this.showLoad = false;
        localStorage.setItem('Produtos' + this.idProduto, "");
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