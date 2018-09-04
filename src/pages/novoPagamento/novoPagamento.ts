import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { CarrinhoPage } from '../carrinho/carrinho';
import { FeedbackPage } from '../feedback/feedback';

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
    selector: 'page-novoPagamento',
    templateUrl: 'novoPagamento.html'
})
export class NovoPagamentoPage {
    loading: any;
    usuarioLogado: boolean;
    Descricao: any;
    NumeroCartao: any;
    Nome: any;
    MesVencimento: any;
    AnoVencimento: any;
    CodSeg: any;
    id: any;
    apiIugu = "https://api.iugu.com/v1";
    //apiIugu = "/iugu";
    
    constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, public alertCtrl: AlertController, 
        public toastCtrl: ToastController, private loadingCtrl: LoadingController) {
        this.usuarioLogado = this.validaLogin();
        this.id = this.navParams.get('id');
        this.Descricao = "";
        this.NumeroCartao = "";
        this.Nome = "";
        this.MesVencimento = "";
        this.AnoVencimento = "";
        this.CodSeg = "";

        console.log(this.id);
        if(this.id != "" && this.id != undefined){
            this.getItems();
        }
    }

    getItems(){
        this.showLoader();

        this.http.get(this.apiIugu + '/customers/' + localStorage.getItem('IdIugu') + '/payment_methods/' + this.id, httpOptions).subscribe(data => {
            this.Descricao = data['description'];
            this.NumeroCartao = data['data']['display_number'];
            this.Nome = data['data']['holder_name'];
            this.MesVencimento = data['data']['month'];
            this.AnoVencimento = data['data']['year'];
            this.CodSeg = "";
            this.loading.dismiss();
        }, (error) => {
            console.log(error);
        });
    }

    inserirPagamento(){
        this.showLoader();

        var dados = {
            account_id: '92FE03E4DB1840C6877548DFE41C6AB6',
            method: 'credit_card',
            test: 'true',
            data: {
                number: this.NumeroCartao,
                verification_value: this.CodSeg,
                first_name: this.Nome,
                last_name: '',
                month: this.MesVencimento,
                year: this.AnoVencimento,
            }
        };

        if(this.id != "" && this.id != undefined){
            this.http.put(this.apiIugu + '/customers/' + localStorage.getItem('IdIugu') + '/payment_methods/' + this.id, httpOptions).subscribe(data => {
                this.showAlert('Sucesso', 'Forma de Pagamento alterada com sucesso.');
                this.loading.dismiss();
            }, (error) => {
                console.log(error);
            });
        }else{
            this.http.post(this.apiIugu + '/payment_token', dados, httpOptions).subscribe(data => {
                this.criarMetodoPagamento(data['id']);
            }, (error) => {
                console.log(error);
                
                if(error.status == 422)
                    this.showAlert('Erro', 'Dados incorretos, por favor verifique.');
            });
        }

        this.navCtrl.pop();
    }

    criarMetodoPagamento(idToken){
        this.showLoader();

        var dados = {
            token: idToken,
            description: this.Descricao
        };

        this.http.post(this.apiIugu + '/customers/' + localStorage.getItem('IdIugu') + '/payment_methods', dados, httpOptions).subscribe(data => {
            if(data != null){
                this.showAlert('Sucesso', 'Forma de Pagamento cadastrada com sucesso.')
                this.loading.dismiss();
            }
        }, (error) => {
            console.log(error);
        });
    }

    goLoginPage(): void{
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

    validaLogin(){
        if(localStorage.getItem("tokenLogin") != null && localStorage.getItem("tokenLogin")){
          return true;
        }else{
          return false;
        }
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

    showAlert(titulo: string, texto: string) {
        let alert = this.alertCtrl.create({
          title: titulo,
          subTitle: texto,
          buttons: ['OK']
        });
        alert.present();
    }

    showLoader(){    
        this.loading = this.loadingCtrl.create({
          content: "Aguarde..."
        });
    
        this.loading.present();
    }
}