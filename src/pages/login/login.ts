import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { HomePage } from '../home/home';
import { CadastroPage } from '../cadastro/cadastro';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage{
    form: FormGroup;
    token: any;
    loading: any;
    pedidos: any;
    
    constructor(public navCtrl: NavController, private http: HttpClient, private loadingCtrl: LoadingController, public toastCtrl: ToastController, public alertCtrl: AlertController){
        this.form = new FormGroup({ Login: new FormControl(), Senha: new FormControl() });        

        // if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ""){
        //     this.showAlert('Atenção', 'Usuário já está logado.');
        //     this.navCtrl.push(HomePage);
        // }
        // else{
        //     this.navCtrl.push(LoginPage);
        // }
    }

    Login(): void{
        this.showLoader();

        this.http.post('https://api.modazapp.online/api/Login', this.form.value).subscribe(data =>{
        //this.http.post('http://localhost:65417/api/Login', this.form.value).subscribe(data =>{
            if(data != null){
                if(data["Usuario"] != null){
                    console.log(data);
                    this.token = data["Token"];
                    localStorage.setItem("tokenLogin", this.token);
                    localStorage.setItem("IdUsuario", data["IdUsuario"]);
                    localStorage.setItem("TipoUsuario", data["Tipo"]);
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
                }
                else{
                    this.showAlert("Atenção", data.toString());
                    this.goRootPage();
                }
            }
            //this.loading.dismiss();
        }, (error) =>{
            this.showAlert('Erro', 'Falha na comunicação com o servidor.');
            this.loading.dismiss();
            this.goRootPage();
        });
    }

    getPedidos(){
        //this.showLoader();

        if(localStorage.getItem('tokenLogin') != null && localStorage.getItem('tokenLogin') != ''){
            this.http.get('https://api.modazapp.online/api/Pedidos/GetPedidosCliente?id=' + localStorage.getItem("IdUsuario")).subscribe(data =>{            
            //this.http.get('http://localhost:65417/api/Pedidos/GetPedidosCliente?id=' + localStorage.getItem("IdUsuario")).subscribe(data =>{            
                this.pedidos = data;
                localStorage.setItem('Pedidos', JSON.stringify(data));
                //this.loading.dismiss();
            }, (error) =>{
                this.showAlert('Erro', 'Falha na comunicação com o servidor.');
                //this.loading.dismiss();
                this.goRootPage();
            });
        } else{
            this.goLoginPage();
        }
    }

    EsqueciSenha(): void{
        var idUsuario = localStorage.getItem('IdUsuario');

        var alterarSenha = { IdUsuario: idUsuario };

        this.http.post('https://api.modazapp.online/api/EsqueceuSenha', JSON.stringify(alterarSenha)).subscribe(data => {
            if(data["Token"] != null){
                alert("Um link de recuperação de sua senha foi enviado para o e-mail cadastrado em nosso sistema.");
            }else{
                alert("Erro ao gerar o link de recuperação de senha.");
            }
        }, (error) =>{
            this.showAlert('Erro', 'Falha na comunicação com o servidor.');
            this.loading.dismiss();
            this.goRootPage();
        });
    }

    goCadastroPage(): void{
        this.navCtrl.push(CadastroPage);
    }

    goLoginPage(): void{
        this.navCtrl.push(LoginPage);
    }

    goRootPage(): void{
        this.navCtrl.setRoot(HomePage);
        this.navCtrl.popToRoot();
    }

    showLoader(){    
        this.loading = this.loadingCtrl.create({
          content: "Autenticando..."
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