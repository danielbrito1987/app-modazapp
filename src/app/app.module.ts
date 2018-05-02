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

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IonicStorageModule } from '@ionic/storage';
// import { TooltipModule } from 'angular2-tooltips';
import { Camera } from '@ionic-native/camera';
import { AndroidPermissions } from '@ionic-native/android-permissions';

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
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { AutoHideDirective } from '../directives/auto-hide/auto-hide';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

@NgModule({
  declarations: [
    MyApp,
    AutoHideDirective,
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
    TabsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    // BrowserAnimationsModule,
    HttpClientModule,
    // TooltipModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    BrMaskerModule
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
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    HttpClientModule,    
    {provide: ErrorHandler, useClass: IonicErrorHandler,},
    Camera,
    EmailComposer,
    AndroidPermissions,
    ProdutoProvider,
    Base64,
    LocalNotifications,
    BackgroundMode,
    Network,
    SQLite,
    DatabaseProvider,
    LojasProvider,
    DatePicker,
    InAppBrowser,
    ScreenOrientation
  ]
})
export class AppModule {
  rootPage = TabsPage;
}