import { Component } from '@angular/core';
import { NavController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { CarrinhoPage } from '../carrinho/carrinho';
import { FeedbackPage } from '../feedback/feedback';
declare var require: any;
@Component({
    selector: 'page-cadastro',
    templateUrl: 'cadastro.html'
})
export class CadastroPage {
    loading: any;
    form: FormGroup;
    cpf: any;
    Tipo: any;
    usuarioLogado: boolean;
    validaPoliticas: boolean = false;
    cidade: any;
    uf: any;
    public CPF = require("cpf_cnpj").CPF;
    public CNPJ = require("cpf_cnpj").CNPJ;
    
    constructor(public navCtrl: NavController, private http: HttpClient, public alertCtrl: AlertController, 
        public fbld: FormBuilder, public toastCtrl: ToastController, private loadingCtrl: LoadingController) {
        this.form = new FormGroup({ Tipo: new FormControl(), Nome: new FormControl(), DataNasc: new FormControl(), Email: new FormControl(), Telefone: new FormControl(), Sexo: new FormControl(), CPF: new FormControl(), Senha: new FormControl(), RazaoSocial: new FormControl(), CNPJ: new FormControl(), chkPol: new FormControl(), Pergunta1: new FormControl(), Pergunta2: new FormControl(), Pergunta3: new FormControl() });
        this.Tipo = "PF";
        this.usuarioLogado = this.validaLogin();
        this.cidade = localStorage.getItem('Cidade');
        this.uf = localStorage.getItem('UF');
    }

    inserirUsuario(): void{
        if(this.validaPoliticas){
            this.showLoader();
            this.http.post("https://api.modazapp.online/api/Usuarios/PostUsuario", this.form.value).subscribe(data =>{
            //this.http.post("http://localhost:65417/api/usuarios", this.form.value).subscribe(data =>{
                if(data["idUsuario"] != null){                    
                    this.showAlert('Sucesso', 'Cadastro realizado com sucesso.');
                    this.loading.dismiss();
                } else {
                    this.showAlert('Alerta', data.toString());
                    this.loading.dismiss();
                }

                this.loading.dismiss();
            }, error =>{
                console.log(error);
                this.showAlert('Erro', 'Erro ao enviar os dados.');
                this.loading.dismiss();
            });
            this.cadastroIugu();
        }else{
            this.showAlert('Atenção', 'Marque a opção Li e Aceito as Políticas de Uso do ModaZapp.');
        }
    }

    cadastroIugu(){
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Access-Control-Allow-Origin': 'http://localhost:8100',
              'Access-Control-Allow-Methods': 'GET,POST,DELETE,PUT,OPTIONS',
              'Access-Control-Allow-Headers': 'X-Requested-With, Content-Type, Authorization, Origin, Accept',
              'Authorization': 'Basic ODZlNDk1ZmJlYzEwYjUzMWE2MzljMmQyNDgwNTYwNjM6'
            })
        };
        
        var cliente = {
            email: this.form.value['Email'],
            name: this.form.value['Nome'],
            cpf_cnpj: this.form.value['CPF']
        };

        this.http.post('/iugu/customers', cliente, httpOptions).subscribe(data => {
            console.log(data);
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

    validarCPF(){
        var _cpf = this.form.value["CPF"].toString();

        if(!this.CPF.isValid(_cpf)){
            this.showAlert('Atenção', 'O CPF informado não é válido.');
        }
    }

    validarCNPJ(){
        var _cnpj = this.form.value["CNPJ"].toString();

        if(!this.CNPJ.isValid(_cnpj)){
            this.showAlert('Atenção', 'O CNPJ informado não é válido.');
        }
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