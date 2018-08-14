import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { FeedbackPage } from '../feedback/feedback';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { ModalEndereco } from '../../modals/endereco/endereco';

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
    selector: 'page-checkout',
    templateUrl: 'checkout.html'
})
export class CheckoutPage{
    public carrinhoPage = CarrinhoPage;
    loading: any;
    contato: any;
    cep: any;
    titulo: any;
    endereco: any;
    numero: any;
    bairro: any;
    cidade: any;
    estado: any;
    formaPgto: any;
    usuarioLogado: boolean;
    data: Date = new Date();
    dtVcto: Date = new Date();
    itemsIugu: any[];
    items: any;
    enderecos: any;
    meusEnderecos: any[] = []
    subTotal: number = 0;
    frete: number = 0;
    totalPedido: number = 0;
    tokenPagamento: any;

    constructor(public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController, public localNotification: LocalNotifications,
        public navParams: NavParams, public toastCtrl: ToastController, public alertCtrl: AlertController, public modalCtrl: ModalController){
            this.contato = "";
            this.endereco = this.navParams.get('Endereco');
            this.numero = "";
            this.bairro = this.navParams.get('Bairro');
            this.cidade = this.navParams.get('Cidade');
            this.estado = this.navParams.get('Estado');
            this.cep = "";
            this.formaPgto = "";
            this.usuarioLogado = this.validaLogin();
            this.subTotal = navParams.get('TotalPedido');            
            this.totalPedido = this.subTotal + this.frete;

            this.getMetodoPgto();
            this.getEndereco();            
    }

    getMetodoPgto(){
        this.http.get('/iugu/customers/' + localStorage.getItem("IdIugu") + '/payment_methods', httpOptions).subscribe(data => {
            this.items = data;
        }, (error) => {
            console.error(error);
        })
    }

    getEndereco(){
        this.http.get('https://api.modazapp.online/api/Usuarios/GetEnderecos?id=' + localStorage.getItem("IdUsuario")).subscribe(data => {
        //this.http.get('http://localhost:65417/api/Usuarios/GetEnderecos?id=' + localStorage.getItem("IdUsuario")).subscribe(data => {
            this.enderecos = data;
            this.meusEnderecos = this.enderecos;

            this.titulo = data[0]["Titulo"];
            this.endereco = data[0]["Endereco"];
            this.estado = data[0]["Estado"];
            this.cidade = data[0]["Cidade"];
            this.bairro = data[0]["Bairro"];
            this.cep = data[0]["Cep"];

        }, (error) => {
            console.error(error);
        })
    }

    getEnderecoPeloId(idEndereco){
        this.http.get('https://api.modazapp.online/api/Usuarios/GetEnderecoPeloId?id=' + idEndereco).subscribe(data => {
        //this.http.get('http://localhost:65417/api/Usuarios/GetEnderecoPeloId?id=' + idEndereco).subscribe(data => {
            this.titulo = data[0]["Titulo"];
            this.endereco = data[0]["Endereco"];
            this.estado = data[0]["Estado"];
            this.cidade = data[0]["Cidade"];
            this.bairro = data[0]["Bairro"];
            this.cep = data[0]["Cep"];
        }, (error) => {
            console.error(error);
        })
    }

    showModalEndereco(){
        let modal = this.modalCtrl.create(ModalEndereco);
        setTimeout(() => {
            modal.present();
        })
    }

    showAlertEnderecos(){
        let alert = this.alertCtrl.create();
        alert.setTitle('Meus Endereços');

        this.meusEnderecos.forEach(element => {
            alert.addInput({
                type: 'radio',
                label: element.Titulo,
                value: element.IdEndereco
            })
        });

        alert.addButton('Cancelar');
        alert.addButton({
            text: 'OK',
            handler: data => {
                this.getEnderecoPeloId(data);
            }
        });

        alert.present();
    }

    finalizar(){
        this.dtVcto.setDate(this.data.getDate() + 30);
        this.itemsIugu = JSON.parse(localStorage.getItem('ItemIUGU'));

        this.itemsIugu.forEach(element => {
            this.totalPedido += element.price_cents;
        })
          
        this.showLoader();
        
        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ''){            
            var now = new Date();
            
            var payer = { "cpf_cnpj": localStorage.getItem('CpfUsuario').toString().replace('.', '').replace('.', '').replace('-', ''), "name": localStorage.getItem('NomeUsuario').toString(), "phone_prefix": "27", "phone": this.contato, "email": localStorage.getItem('EmailUsuario').toString(), "address": { "zip_code": this.cep, "street": this.endereco, "number": "0", "district": this.bairro, "city": this.cidade, "state": this.estado, "country": "Brasil", "complement": "" } };
            // // var dados = { 'email': localStorage.getItem('EmailUsuario'), 'due_date': '2018-08-10', 'items': items, 'payable_with': this.formaPgto, 'player': player, 'order_id': localStorage.getItem("CodPedido") };
            var dados = { "due_date": now.getDate() + "/" + (now.getMonth() + 1) + "/" + now.getFullYear(), "email": localStorage.getItem('EmailUsuario').toString(), "items": this.itemsIugu, "payer": payer, "order_id": localStorage.getItem("CodPedido"), "total": this.totalPedido };

            var pedido = { 'TokenUsuario': localStorage.getItem('tokenLogin'), 'CodPedido': localStorage.getItem('CodPedido'), 'Contato': this.contato, 'Endereco': this.endereco, 'Numero': this.numero, 'Bairro': this.bairro, 'Cidade': this.cidade, 'FormaPgto': this.formaPgto };
            
            this.http.post("https://api.modazapp.online/api/pedidos/", pedido).subscribe(data => {
            //this.http.post("http://localhost:65417/api/pedidos/", dados).subscribe(data => {                
                if(data == "Erro"){
                    this.loading.dismiss();
                    this.goLoginPage();
                }else{
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
            
            this.http.post("/iugu/invoices/", dados, httpOptions).subscribe(data => {
                console.log(data);
                if(this.tokenPagamento == "bank_slip"){
                    this.cobrancaBoletoIugu(data["id"])
                }else if(this.tokenPagamento != "deposito" && this.tokenPagamento != "em_maos" && this.tokenPagamento != "crediario"){
                    this.cobrancaCartaoIugu(data["id"]);
                }                
            }, (error) => {
                console.error(error);
            });            
        }else{
            this.loading.dismiss();
            this.navCtrl.push(LoginPage);
        }
    }

    cobrancaBoletoIugu(invoiceID: any){
        this.showLoader();
        
        var payer = { "cpf_cnpj": localStorage.getItem('CpfUsuario').toString().replace('.', '').replace('.', '').replace('-', ''), "name": localStorage.getItem('NomeUsuario').toString(), "phone_prefix": "27", "phone": this.contato, "email": localStorage.getItem('EmailUsuario').toString(), "address": { "zip_code": "29210220", "street": this.endereco, "number": "", "district": this.bairro, "city": this.cidade, "state": "MG", "country": "Brasil", "complement": "" } };
        
        var dados = {
            "method": "bank_slip",
            "restrict_payment_method": "true",
            "customer_id": localStorage.getItem("IdIugu"),
            "invoice_id": invoiceID,
            "email": localStorage.getItem('EmailUsuario'),
            "payer": payer,
            "order_id": localStorage.getItem("CodPedido")
        };

        this.http.post("/iugu/charge", dados, httpOptions).subscribe(data => {
            this.showAlert("Linha Digitável", data["identification"]);
            this.loading.dismiss();
        }, (error) => {
            console.log(error);
        });
    }

    cobrancaCartaoIugu(invoiceID: any){
        var payer = { "cpf_cnpj": localStorage.getItem('CpfUsuario').toString().replace('.', '').replace('.', '').replace('-', ''), "name": localStorage.getItem('NomeUsuario').toString(), "phone_prefix": "27", "phone": this.contato, "email": localStorage.getItem('EmailUsuario').toString(), "address": { "zip_code": "29210220", "street": this.endereco, "number": "", "district": this.bairro, "city": this.cidade, "state": "MG", "country": "Brasil", "complement": "" } };
        
        var dados = {
            "customer_payment_method_id": this.tokenPagamento,
            "customer_id": localStorage.getItem("IdIugu"),
            "invoice_id": invoiceID,
            "email": localStorage.getItem('EmailUsuario'),
            "payer": payer,
            "order_id": localStorage.getItem("CodPedido")
        };

        this.http.post("/iugu/charge", dados, httpOptions).subscribe(data => {
            console.log(data);
        }, (error) => {
            console.log(error);
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