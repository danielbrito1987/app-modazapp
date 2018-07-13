import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { FeedbackPage } from '../feedback/feedback';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
    selector: 'page-checkout',
    templateUrl: 'checkout.html'
})
export class CheckoutPage{
    public carrinhoPage = CarrinhoPage;
    loading: any;
    contato: any;
    endereco: any;
    numero: any;
    bairro: any;
    cidade: any;
    formaPgto: any;
    usuarioLogado: boolean;
    data: Date = new Date();
    dtVcto: Date = new Date();

    constructor(public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController, public localNotification: LocalNotifications,
        public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController){
            this.contato = "";
            this.endereco = "";
            this.numero = "";
            this.bairro = "";
            this.cidade = "";
            this.formaPgto = "";
            this.usuarioLogado = this.validaLogin();

            // this.http.get("https://api.iugu.com/v1/92FE03E4DB1840C6877548DFE41C6AB6/api_tokens").subscribe(data => {
            //     console.log(data);
            // }, (error) => {
            //     console.log(error);
            // })
    }

    finalizar(){        
        // this.Iugu.setApiKey('86e495fbec10b531a639c2d248056063');
        // this.Iugu.setTimeout(20000);
        //var iugu = require('iugu')('86e495fbec10b531a639c2d248056063');
        //var expect = require('chai').expect;        
        this.dtVcto.setDate(this.data.getDate() + 30);

          var dadosP = 
          {
            "email": localStorage.getItem('EmailUsuario'),
            "due_date": "02/12/2018",
            "items":[
                {
                    "description": "Produto 1",
                    "quantity": 1,
                    "price_cents": 50
                },{
                    "description": "Produto 2",
                    "quantity": 1,
                    "price_cents": 60
                }],
          "payer":{
              "cpf_cnpj": localStorage.getItem('CpfUsuario'),
              "name": localStorage.getItem('NomeUsuario'),
              "address":{
                  "zip_code": "29200000",
                  "number": "123"
                }
            }
          };

        let headers = new HttpHeaders({
            'authorization': 'Basic ODZlNDk1ZmJlYzEwYjUzMWE2MzljMmQyNDgwNTYwNjM6'
        })

        this.http.post('https://api.iugu.com/v1/invoices', JSON.stringify(dadosP), { headers: headers, responseType: "json", withCredentials: true }).subscribe(data => {
            console.log(data);
        }, (error) => {
            console.log(error);
        })
          
        //   request.post(options, function(err,httpResponse,body){
        //     console.log(body);
        //   })

        this.showLoader();

        var dados = { 'TokenUsuario': localStorage.getItem('tokenLogin'), 'CodPedido': localStorage.getItem('CodPedido'), 'Contato': this.contato, 'Endereco': this.endereco, 'Numero': this.numero, 'Bairro': this.bairro, 'Cidade': this.cidade, 'FormaPgto': this.formaPgto };

        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ''){            
            this.http.post("https://api.modazapp.online/api/pedidos/", dados).subscribe(data => {
            //this.http.post("http://localhost:65417/api/pedidos/", dados).subscribe(data => {                
                if(data == "Erro"){
                    this.loading.dismiss();
                    this.goLoginPage();
                }else{
                    // var player = { 'cpf_cnpj': localStorage.getItem('CpfUsuario'), 'name': localStorage.getItem('NomeUsuario'), 'phone_prefix': '27', 'phone': this.contato, 'email': localStorage.getItem('EmailUsuario'), 'address': { 'zip_code': 'cep', 'street': this.endereco, 'number': this.numero, 'district': this.bairro, 'city': this.cidade, 'state': 'UF', 'country': 'Brasil', 'complement': '' } };
                    // var items = localStorage.getItem('ItemIUGU');
                    // // var dados = { 'email': localStorage.getItem('EmailUsuario'), 'due_date': '2018-08-10', 'items': items, 'payable_with': this.formaPgto, 'player': player, 'order_id': localStorage.getItem("CodPedido") };
                    // var dados = { 'method': 'bank_slip',  'restrict_payment_method': false, 'customer_id': 1, 'email': localStorage.getItem('EmailUsuario'), 'items': JSON.stringify(items), 'player': JSON.stringify(player), 'order_id': localStorage.getItem("CodPedido") };
                    
                    // this.http.post("https://api.iugu.com/v1/charge", JSON.stringify(dados), { headers: new HttpHeaders().set('api_token', '86e495fbec10b531a639c2d248056063').set('Accept', 'application/json')}).subscribe(data => {
                    //     console.log(data);
                    // }, (error) => {
                    //     console.log(error);
                    // });
                    
                    //this.Iugu.invoices.create({ application_fee: 111 });
                    // expect(iugu.LAST_REQUEST).to.deep.equal({
                    //     method: 'POST',
                    //     url: '/v1/invoices',
                    //     data: { application_fee: 111 }
                    // });
                    

                    localStorage.setItem("CodPedido", "");
                    localStorage.setItem("ExpirarCarrinho", "");
                    this.showToast("top", "Pedido Finalizado!");
                    this.localNotification.clearAll();
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