import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { LoginPage } from '../pages/login/login'
import { TabsPage } from '../pages/tabs/tabs';
import { ProdutosPage } from '../pages/produtos/produtos';
import { CarrinhoPage } from '../pages/carrinho/carrinho';
import { CheckoutPage } from '../pages/checkout/checkout';
import { PedidosPage } from '../pages/pedidos/pedidos';
import { ChatPage } from '../pages/chat/chat';
import { DetalhesPedidoPage } from '../pages/detalhespedido/detalhespedido';
import { DetalhesProdutoPage } from '../pages/detalhesproduto/detalhesproduto';
import { FeedbackPage } from '../pages/feedback/feedback';
import { EspecificacaoProdutoPage } from '../pages/especicifacaoproduto/especificacaoproduto';
import { PerfilPage } from '../pages/perfil/perfil';
import { EnderecosPage } from '../pages/enderecos/enderecos';
import { NovoEnderecoPage } from '../pages/novoEndereco/novoEndereco';
import { PagamentoPage } from '../pages/pagamento/pagamento';
import { NovoPagamentoPage } from '../pages/novoPagamento/novoPagamento';
import { ModalNavegacao } from '../modals/navegacao/navegacao';

import { AppVersion } from '@ionic-native/app-version';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IonicStorageModule } from '@ionic/storage';
import { Camera } from '@ionic-native/camera';

import { BrMaskerModule } from 'brmasker-ionic-3';
import { ProdutoProvider } from '../providers/produto/produto';
import { EmailComposer } from '@ionic-native/email-composer';
import { Base64 } from '@ionic-native/base64';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { BackgroundMode } from '@ionic-native/background-mode';
import { Network } from '@ionic-native/network';
import { SQLite } from '@ionic-native/sqlite';
import { DatabaseProvider } from '../providers/database/database';
import { LojasProvider } from '../providers/lojas/lojas';
import { DatePicker } from '@ionic-native/date-picker';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { TooltipsModule } from 'ionic-tooltips';
import { Geolocation } from '@ionic-native/geolocation';
import { OneSignal } from '@ionic-native/onesignal';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    CadastroPage,
    LoginPage,
    ProdutosPage,
    CarrinhoPage,
    CheckoutPage,
    PedidosPage,
    ChatPage,
    DetalhesPedidoPage,
    DetalhesProdutoPage,
    FeedbackPage,
    EspecificacaoProdutoPage,
    PerfilPage,
    EnderecosPage,
    NovoEnderecoPage,
    PagamentoPage,
    NovoPagamentoPage,
    ModalNavegacao,
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    BrMaskerModule,
    TooltipsModule
    ///BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    CadastroPage,
    LoginPage,
    ProdutosPage,
    CarrinhoPage,
    CheckoutPage,
    PedidosPage,
    ChatPage,
    DetalhesPedidoPage,
    DetalhesProdutoPage,
    FeedbackPage,
    EspecificacaoProdutoPage,
    PerfilPage,
    EnderecosPage,
    NovoEnderecoPage,
    PagamentoPage,
    NovoPagamentoPage,
    ModalNavegacao,
    TabsPage
  ],
  providers: [
    StatusBar,
    AppVersion,
    SplashScreen,
    HttpClientModule,    
    {provide: ErrorHandler, useClass: IonicErrorHandler,},
    Camera,
    EmailComposer,
    ProdutoProvider,
    Base64,
    LocalNotifications,
    BackgroundMode,
    Network,
    SQLite,
    DatabaseProvider,
    LojasProvider,
    DatePicker,
    AndroidPermissions,
    ScreenOrientation,
    Geolocation,
    OneSignal,
    NativeGeocoder
  ]
})
export class AppModule {
  rootPage = TabsPage;
}