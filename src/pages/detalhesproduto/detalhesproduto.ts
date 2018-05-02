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
import { ProdutoProvider } from '../../providers/produto/produto';
import * as moment from 'moment';

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
    qtdP: any;
    qtdM: any;
    qtdG: any;
    qtdGG: any;
    qtdXG: any;
    qtdXGG: any;
    tam: any;
    showLoad: boolean;
    dataRegistro: any;
    isAndroid: boolean;
    usuarioLogado: boolean;
    tipoUsuario: any;
    esconderDivP: boolean;
    esconderDivM: boolean;
    esconderDivG: boolean;
    esconderDivGG: boolean;
    esconderDivXG: boolean;
    esconderDivXGG: boolean;

    constructor(public platform: Platform, public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController, private localNotifications: LocalNotifications,
        public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, public produtosProvider: ProdutoProvider){            
            this.qtdP = 0;
            this.qtdM = 0;
            this.qtdG = 0;
            this.qtdGG = 0;
            this.qtdXG = 0;
            this.qtdXGG = 0;
            this.tam = "P";
            this.showLoad = true;
            this.idProduto = this.navParams.get('IdProduto');            
            this.usuarioLogado = this.validaLogin();
            this.tipoUsuario = localStorage.getItem('TipoUsuario');
            this.esconderDivP = false;
            this.esconderDivM = false;
            this.esconderDivG = false;
            this.esconderDivGG = false;
            this.esconderDivXG = false;
            this.esconderDivXGG = false;
            this.initializeItems();
    }

    hideDivP(){
        if(this.esconderDivP == true){
            this.esconderDivP = false;
        }else{
            this.esconderDivP = true;
            this.esconderDivM = false;
            this.esconderDivG = false;
            this.esconderDivGG = false;
            this.esconderDivXG = false;
            this.esconderDivXGG = false;
        }
    }

    hideDivM(){
        if(this.esconderDivM == true){
            this.esconderDivM = false;
        }else{
            this.esconderDivM = true;
            this.esconderDivP = false;            
            this.esconderDivG = false;
            this.esconderDivGG = false;
            this.esconderDivXG = false;
            this.esconderDivXGG = false;
        }
    }

    hideDivG(){
        if(this.esconderDivG == true){
            this.esconderDivG = false;
        }else{
            this.esconderDivG = true;
            this.esconderDivP = false;
            this.esconderDivM = false;
            this.esconderDivGG = false;
            this.esconderDivXG = false;
            this.esconderDivXGG = false;
        }
    }

    hideDivGG(){
        if(this.esconderDivGG == true){
            this.esconderDivGG = false;
        }else{
            this.esconderDivGG = true;
            this.esconderDivG = false;
            this.esconderDivP = false;
            this.esconderDivM = false;            
            this.esconderDivXG = false;
            this.esconderDivXGG = false;
        }
    }

    hideDivXG(){
        if(this.esconderDivXG == true){
            this.esconderDivXG = false;
        }else{                        
            this.esconderDivXG = true;
            this.esconderDivP = false;
            this.esconderDivM = false;            
            this.esconderDivG = false;
            this.esconderDivGG = false;            
            this.esconderDivXGG = false;
        }
    }

    hideDivXGG(){
        if(this.esconderDivXGG == true){
            this.esconderDivXGG = false;
        }else{
            this.esconderDivXGG = true;           
            this.esconderDivP = false;
            this.esconderDivM = false;            
            this.esconderDivG = false;
            this.esconderDivGG = false;
            this.esconderDivXG = false;            
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
        
        //if(localStorage.getItem('Produtos' + this.idProduto) == "" || localStorage.getItem('Produtos' + this.idProduto) == null){
        this.http.get('https://api.modazapp.online/api/produto/GetProdutoId?id=' + this.idProduto).subscribe(data =>{
        //this.http.get('http://localhost:65417/api/produto/GetProdutoId?id=' + this.idProduto).subscribe(data =>{
            this.items = data;
            this.qtdP = 0;
            this.qtdM = 0;
            this.qtdG = 0;
            this.qtdGG = 0;
            this.qtdXG = 0;
            this.qtdXGG = 0;
            this.loading.dismiss();            
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                this.loading.dismiss();
                this.goRootPage();
        });
        // }else{
        //     this.items = JSON.parse(localStorage.getItem('Produtos' + this.idProduto));
        //     this.loading.dismiss();
        // }
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

    addQtdP(){
        this.qtdP = parseInt(this.qtdP) + 1;
    }

    removeQtdP(){
        this.qtdP = this.qtdP - 1;
        
        if(this.qtdP <= 0)
            this.qtdP = 0;
    }

    addQtdM(){
        this.qtdM = this.qtdM + 1;
    }

    removeQtdM(){
        this.qtdM = this.qtdM - 1;
        
        if(this.qtdM <= 0)
            this.qtdM = 0;
    }

    addQtdG(){
        this.qtdG = this.qtdG + 1;
    }

    removeQtdG(){
        this.qtdG = this.qtdG - 1;
        
        if(this.qtdG <= 0)
            this.qtdG = 0;
    }

    addQtdGG(){
        this.qtdGG = this.qtdGG + 1;
    }

    removeQtdGG(){
        this.qtdGG = this.qtdGG - 1;
        
        if(this.qtdGG <= 0)
            this.qtdGG = 0;
    }

    addQtdXG(){
        this.qtdXG = this.qtdXG + 1;
    }

    removeQtdXG(){
        this.qtdXG = this.qtdXG - 1;
        
        if(this.qtdXG <= 0)
            this.qtdXG = 0;
    }

    addQtdXGG(){
        this.qtdXGG = this.qtdXGG + 1;
    }

    removeQtdXGG(){
        this.qtdXGG = this.qtdXGG - 1;
        
        if(this.qtdXGG <= 0)
            this.qtdXGG = 0;
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
        this.goRootPage();
        this.showToast("top", "Logoff realizado!");
    }

    comprar(idProduto: any){   
        if(this.showLoad)     
            this.showLoader();

        this.idLoja = localStorage.getItem('IdLoja');

        var dados = { 'IdProduto': idProduto, 'QtdPedidoP': this.qtdP, 'QtdPedidoM': this.qtdM, 'QtdPedidoG': this.qtdG, 'QtdPedidoGG': this.qtdGG, 'QtdPedidoXG': this.qtdXG, 'QtdPedidoXGG': this.qtdXGG, 'Usuario': localStorage.getItem("tokenLogin"), "CodPedido": localStorage.getItem("CodPedido"), 'Tamanho': this.tam, 'IdLoja': this.idLoja };
                
        if(this.qtdP <= 0 && this.qtdM <= 0 && this.qtdG <= 0 && this.qtdGG <= 0 && this.qtdXG <= 0 && this.qtdXGG <= 0){
            this.loading.dismiss();
            this.showAlert('Atenção', 'Não é permitido comprar com quantidade 0 (zero).');
        }
        else
        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ''){
            localStorage.setItem("Produto", idProduto);

            this.http.post("https://api.modazapp.online/api/carrinho/", dados).subscribe(data => {
            //this.http.post("http://localhost:65417/api/carrinho/", dados).subscribe(data => {
                if(data == "Erro"){
                    this.loading.dismiss();
                    this.goLoginPage();
                }else{
                    console.log(data);
                    this.idCarrinho = data["idCarrinho"];

                    if(localStorage.getItem('ExpirarCarrinho') == null || localStorage.getItem('ExpirarCarrinho') == "")
                        this.agendarNotificacao();

                    localStorage.setItem("CodPedido", data["codPedido"]);
                    this.showToast("top", "Adicionado ao carrinho!");
                    this.loading.dismiss();

                    this.navCtrl.pop();
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
        let dateobject = moment(this.dataRegistro).toDate();
        this.isAndroid = true;
        this.dataRegistro = new Date(new Date().getHours() + 1);
        localStorage.setItem('ExpirarCarrinho', this.dataRegistro);
                
        this.localNotifications.schedule({
          id: 1,
          title: 'Atenção',
          sound: this.isAndroid ? 'file://sound.mp3': 'file://beep.caf',
          text: 'Você tem mais 1 hora para finalizar o seu pedido.',
          at: dateobject
        });
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