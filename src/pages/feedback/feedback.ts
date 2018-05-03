import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, NavParams, ToastController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { HttpClient } from '@angular/common/http';
import { LoginPage } from '../login/login';
import { CarrinhoPage } from '../carrinho/carrinho';
import { PedidosPage } from '../pedidos/pedidos';
import { HomePage } from '../home/home';
import { EmailComposer } from '@ionic-native/email-composer';

@Component({
    selector: 'page-feedback',
    templateUrl: 'feedback.html'
})
export class FeedbackPage{
    public carrinhoPage = CarrinhoPage;
    loading: any;
    nome: any;
    email: any;
    pedido: any;
    pedidos: any;
    loja: any;
    lojas: any;
    idUsuario: any;
    comprovante: any;
    base64Image: any;
    imageURI:any;
    imageFileName:any;
    usuarioLogado: boolean;
    temPermissao: boolean = false;

    constructor(public navCtrl: NavController, private http: HttpClient, public loadingCtrl: LoadingController, public camera: Camera,
        public navParams: NavParams, public toastCtrl: ToastController, private alertCtrl: AlertController, public emailComposer: EmailComposer){
            this.nome = "";
            this.email = "";
            this.pedido = "";
            this.idUsuario = localStorage.getItem("IdUsuario");
            this.usuarioLogado = this.validaLogin();
            this.getPedidos();
            this.getLojas();
    }

    getPedidos(){
        this.pedidos = JSON.parse(localStorage.getItem("Pedidos"));
    }

    getLojas(){
        this.http.get('http://api.modazapp.online/api/lojas').subscribe(data =>{
            //this.http.get('http://localhost:65417/api/lojas').subscribe(data =>{
            this.lojas = data;
        }, (error) =>{
            this.showAlert('Erro', 'Falha na comunicação com o servidor');
        });
    }

    getImage() {
        const options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            encodingType: this.camera.EncodingType.PNG,
            targetWidth: 850,
            targetHeight: 900
        }
    
        this.showLoader();
        
        this.camera.getPicture(options).then((imageData) => {            
            this.imageURI = "data:image/png;base64," + imageData;
            this.loading.dismiss();
        }, (err) => {
            console.log(err);
            this.loading.dismiss();
            this.showAlert('Erro', err);
        });
    }

    enviar(){
        this.showLoader();
                
        var dados = { 'IdUsuario': this.idUsuario, 'Nome': this.nome, 'Email': this.email, 'CodPedido': this.pedido, 'IdLoja': this.loja, 'Imagem': this.imageURI };
                
        this.http.post('https://api.modazapp.online/api/Pedidos/SalvarComprovante', dados).subscribe(data =>{
        //this.http.post('http://localhost:65417/api/Pedidos/SalvarComprovante', dados).subscribe(data =>{
            if(data.toString() == 'OK'){
                this.loading.dismiss();
                this.showAlert('Sucesso', 'Comprovante enviado com sucesso.');
            } else {
                this.loading.dismiss();
                this.showAlert('Erro', data.toString());
            }
            this.loading.dismiss();
            this.navCtrl.popToRoot();
        }, (error) =>{
            this.showAlert('Erro', error.message);
            this.loading.dismiss();
            this.goRootPage();
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