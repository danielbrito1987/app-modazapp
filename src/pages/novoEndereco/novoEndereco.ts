import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { CarrinhoPage } from '../carrinho/carrinho';
import { FeedbackPage } from '../feedback/feedback';
import * as cep from 'cep-promise';

@Component({
    selector: 'page-novoEndereco',
    templateUrl: 'novoEndereco.html'
})
export class NovoEnderecoPage {
    loading: any;
    usuarioLogado: boolean;
    idEndereco: any;
    Titulo: string;
    TextoCep: string;
    Endereco: string;
    Bairro: string;
    Cidade: any;
    Estado: any;
    
    constructor(public navCtrl: NavController, public navParams: NavParams, private http: HttpClient, public alertCtrl: AlertController, 
        public toastCtrl: ToastController, private loadingCtrl: LoadingController) {
        this.usuarioLogado = this.validaLogin();
        this.Titulo = "";
        this.TextoCep = "";
        this.Endereco = "";
        this.Bairro = "";
        this.Cidade = "";
        this.Estado = "";
        this.idEndereco = this.navParams.get('IdEndereco');

        if(this.idEndereco != ""){
            this.getItems();
        }
    }

    getItems(){
        this.showLoader();

        this.http.get('https://api.modazapp.online/api/Usuarios/GetEnderecoPeloId?id=' + this.idEndereco).subscribe(data => {
            this.Titulo = data[0]['Titulo'];
            this.TextoCep = data[0]['Cep'];
            this.Endereco = data[0]['Endereco'];
            this.Bairro = data[0]['Bairro'];
            this.Cidade = data[0]['Cidade'];
            this.Estado = data[0]['Estado'];
            this.loading.dismiss();
        }, (error) => {
            console.log(error);
        });
    }

    inserirEndereco(){
        this.showLoader();

        var dados = { IdUsuario: localStorage.getItem('IdUsuario'), Titulo: this.Titulo, Endereco: this.Endereco, Bairro: this.Bairro, Cidade: this.Cidade, Estado: this.Estado, Cep: this.TextoCep }

        this.http.post('https://api.modazapp.online/api/Usuarios/PostEndereco', dados).subscribe(data => {
            this.loading.dismiss();
            this.showAlert('Sucesso', 'Endereço cadastrado com sucesso.');
            this.navCtrl.pop();
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

    buscaCep(){
        cep(this.TextoCep).then(data => {
            this.Endereco = data['street'];
            this.Bairro = data['neighborhood'];
            this.Cidade = data['city'];
            this.Estado = data['state'];
        }).catch(error => {
            this.showAlert('Atenção', error.message);
            this.Endereco = "";
            this.Bairro = "";
            this.Cidade = "";
            this.Estado = "";
        })
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