import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { HomePage } from '../home/home';
import { CadastroPage } from '../cadastro/cadastro';
import { TabsPage } from '../tabs/tabs';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage{
    form: FormGroup;
    token: any;
    loading: any;
    pedidos: any;
    email: string;
    
    constructor(public navCtrl: NavController, private http: HttpClient, private loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController){
        this.form = new FormGroup({ Login: new FormControl(), Senha: new FormControl() });
        this.email = '';
    }

    Login(): void{
        this.showLoader();

        this.http.post('https://api.modazapp.online/api/Login', this.form.value).subscribe(data =>{
        //this.http.post('http://localhost:65417/api/Login', this.form.value).subscribe(data =>{
            if(data != null){
                if(data["Usuario"] != null){
                    this.token = data["Token"];
                    localStorage.setItem("tokenLogin", this.token);
                    localStorage.setItem("IdUsuario", data["IdUsuario"]);
                    localStorage.setItem("TipoUsuario", data["Tipo"]);
                    localStorage.setItem('NomeUsuario', data['Usuario']);
                    localStorage.setItem('CpfUsuario', data['CPF']);
                    localStorage.setItem('EmailUsuario', data['Email']);
                    this.getPedidos();             
                    this.goRootPage();                    
                    this.showToast('top', 'Bem vindo ' + data["Usuario"] + '!');   
                    this.loading.dismiss();                 
                }
                else if(data == "Usuário ou Senha Inválidos!"){
                    localStorage.setItem("tokenLogin", '');
                    localStorage.setItem("IdUsuario", '');
                    localStorage.setItem("CodPedido", '');
                    localStorage.setItem("Produto", '');
                    this.showAlert('Erro', data.toString());
                    this.loading.dismiss();
                }
                else{
                    this.loading.dismiss();
                    this.showAlert("Atenção", data.toString());
                    this.goRootPage();
                }
            }
        }, (error) =>{
            console.log(error);
            this.showAlert('Erro', 'Falha na comunicação com o servidor.');
            this.loading.dismiss();
            this.goRootPage();
        });
    }

    getPedidos(){
        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ''){
            this.http.get('https://api.modazapp.online/api/Pedidos/GetPedidosCliente?id=' + localStorage.getItem("IdUsuario")).subscribe(data =>{            
            //this.http.get('http://localhost:65417/api/Pedidos/GetPedidosCliente?id=' + localStorage.getItem("IdUsuario")).subscribe(data =>{            
                this.pedidos = data;
                localStorage.setItem('Pedidos', JSON.stringify(data));
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                this.goRootPage();
            });
        } else{
            this.goLoginPage();
        }
    }

    EsqueciSenha(): void{
        if(this.email != "" && this.email != null){
            this.showLoading();
            
            this.http.get('https://api.modazapp.online/api/Usuarios/EsqueceuSenha?id=' + this.email).subscribe(data => {
            //this.http.get('http://localhost:65417/api/Usuarios/EsqueceuSenha?id=' + this.email).subscribe(data => {
                if(data["success"] == false){
                    this.showAlert("Erro!", data["message"]);
                    this.loading.dismiss();
                }else if(data["success"] == true){
                    this.showAlert("Sucesso", "Em instantes você receberá um e-mail com a nova senha.");
                    this.loading.dismiss();
                }
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                this.loading.dismiss();
                this.goRootPage();
            });
        }else{
            this.showAlert('Atenção', 'Campo Usuário é obrigatório.');
        }
    }

    goCadastroPage(): void{
        this.navCtrl.push(CadastroPage);
    }

    goLoginPage(): void{
        this.navCtrl.push(LoginPage);
    }

    goRootPage(): void{
        this.navCtrl.setRoot(TabsPage);
        this.navCtrl.popToRoot();
    }

    showLoader(){    
        this.loading = this.loadingCtrl.create({
          content: "Autenticando..."
        });
    
        this.loading.present();
    }

    showLoading(){    
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