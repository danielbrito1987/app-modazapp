import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController, Platform } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { DetalhesProdutoPage } from '../detalhesproduto/detalhesproduto';
import { FeedbackPage } from '../feedback/feedback';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { EspecificacaoProdutoPage } from '../especicifacaoproduto/especificacaoproduto';
import { ProdutoProvider } from '../../providers/produto/produto';

@Component({
    selector: 'page-produtos',
    templateUrl: 'produtos.html'
})
export class ProdutosPage{
    public carrinhoPage = CarrinhoPage;
    items: any;
    loading: any;
    idLoja: any;
    idCarrinho: any;
    qtdP: any;
    qtdM: any;
    qtdG: any;
    qtdGG: any;
    qtdXG: any;
    qtdXGG: any;
    tam: any;
    showLoad: boolean;
    dataRegistro: any;
    usuarioLogado: boolean;
    tipoUsuario: any;

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
            this.idLoja = this.navParams.get('IdLoja');
            this.tipoUsuario = localStorage.getItem('TipoUsuario');

            this.initializeItems();
            this.usuarioLogado = this.validaLogin();
    }

    initializeItems(): void{
        if(this.showLoad)
            this.showLoader();

        this.http.get('https://api.modazapp.online/api/produto/GetProdutosPelaLoja?id=' + this.idLoja).subscribe(data =>{
        //this.http.get('http://localhost:65417/api/produto/GetProdutosPelaLoja?id=' + this.idLoja).subscribe(data =>{                
                this.items = data;
                console.log(this.items);
                //localStorage.setItem('Produtos' + this.idLoja, JSON.stringify(data["DescricaoCompleta"]));
                this.loading.dismiss();
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                this.loading.dismiss();
                this.goRootPage();
        });

        // this.produtosProvider.get(this.idLoja)
        // .then((result: any) =>{            
        //     if(result != null){
        //        this.items = result;
        //        this.loading.dismiss();
        //     }else{
        //         this.http.get('https://api.modazapp.online/api/produto/GetProdutosPelaLoja?id=' + this.idLoja).subscribe(data =>{
        //         //this.http.get('http://localhost:65417/api/produto/GetProdutosPelaLoja?id=' + this.idLoja).subscribe(data =>{                
        //             this.items = data;
        //             //localStorage.setItem('Produtos' + this.idLoja, JSON.stringify(data));
        //             this.items.forEach(element => {    
        //                 this.produtosProvider.insert(element); 
        //             });
        //             this.loading.dismiss();
        //         }, (error) =>{
        //             this.showAlert('Erro', 'Falha na comunicação com o servidor.');
        //             this.loading.dismiss();
        //             this.goRootPage();
        //         });
        //     }
        // });

        // if(localStorage.getItem('Produtos' + this.idLoja) == "" || localStorage.getItem('Produtos' + this.idLoja) == null){
        //     this.http.get('https://api.modazapp.online/api/produto/GetProdutosPelaLoja?id=' + this.idLoja).subscribe(data =>{
        //     //this.http.get('http://localhost:65417/api/produto/GetProdutosPelaLoja?id=' + this.idLoja).subscribe(data =>{                
        //         this.items = data;
        //         //localStorage.setItem('Produtos' + this.idLoja, JSON.stringify(data));
        //         let produto = new Produto();

        //         produto.IdProduto = data["IdProduto"]; 
        //         produto.Descricao = data["Descricao"]; 
        //         produto.Valor = data["Valor"]; 
        //         produto.Imagem = data["Imagem"]; 
        //         produto.DataRegistro = data["DataRegistro"]; 
        //         produto.IdLoja = data["IdLoja"];
        //         produto.EstoqueP = data["EstoqueP"];
        //         produto.EstoqueM = data["EstoqueM"];
        //         produto.EstoqueG = data["EstoqueG"]; 
        //         produto.EstoqueGG = data["EstoqueGG"];
        //         produto.EstoqueXG = data["EstoqueXG"];
        //         produto.EstoqueXGG = data["EstoqueXGG"];
        //         produto.DescricaoCompleta = data["DescricaoCompleta"];
        //         produto.ValorAtacado = data["ValorAtacado"]; 
        //         produto.Slide1 = data["Slide1"];
        //         produto.Slide2 = data["Slide2"];
        //         produto.Slide3 = data["Slide3"];

        //         this.produtosProvider.insert(produto);
        //         this.loading.dismiss();
        //     }, (error) =>{
        //         this.showAlert('Erro', 'Falha na comunicação com o servidor.');
        //         this.loading.dismiss();
        //         this.goRootPage();
        //     });
        // }else{
        //     this.items = JSON.parse(localStorage.getItem('Produtos' + this.idLoja));
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
        this.goRootPage();
        this.showToast("top", "Logoff realizado!");
    }

    comprar(idProduto: any){   
        if(this.showLoad)     
            this.showLoader();

        var dados = { 'IdProduto': idProduto, 'QtdPedidoP': this.qtdP, 'QtdPedidoM': this.qtdM, 'QtdPedidoG': this.qtdG, 'QtdPedidoGG': this.qtdGG, 'QtdPedidoXG': this.qtdXG, 'QtdPedidoXGG': this.qtdXGG, 'Usuario': localStorage.getItem("tokenLogin"), 'IdLoja': this.idLoja, "CodPedido": localStorage.getItem("CodPedido"), 'Tamanho': this.tam };

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
        this.localNotifications.schedule({
          id: 1,
          title: 'Atenção',
          text: 'Tempo limite para finzalizar o seu carrinho está se aproximando.',
          at: new Date(this.dataRegistro).getSeconds() + 5
        });
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

    // maisQtd(): void{
    //     this.qtd += 1;
    // }

    // menosQtd(): void{
    //     if(this.qtd > 0){
    //         this.qtd -= 1;
    //     }
    //     else{
    //         this.qtd = 0;
    //     }
    // }

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