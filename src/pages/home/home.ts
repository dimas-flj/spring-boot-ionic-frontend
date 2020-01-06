import { Component } from '@angular/core';
import { NavController, IonicPage, MenuController, LoadingController, Loading } from 'ionic-angular';
import { CredenciaisDTO } from '../../models/credenciais.dto';
import { AuthService } from '../../services/auth.service';
import { ProdutoService } from '../../services/domain/produto.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component(
	{
		selector: 'page-home',
		templateUrl: 'home.html'
	}
)

export class HomePage {
	sServidor: string;

	creds: CredenciaisDTO = {
		email: "",
		senha: ""
	};

	constructor(
		public navCtrl: NavController,
		public menu: MenuController,
		public auth: AuthService,
		public produtoService: ProdutoService,
		public loadingCtrl: LoadingController
	) { };

	ionViewDidEnter() {
		this.loadData();
	}

	loadData() {
		let loader = this.presentLoading();
		this.produtoService.findByCategoria("1", 0, 1)
			.subscribe(
				response => {
					this.sServidor = `${API_CONFIG.baseUrl}`;
					loader.dismiss();

					this.auth.refreshToken()
						.subscribe(
							response => {
								this.auth.successfulLogin(response.headers.get('Authorization'));
								this.navCtrl.setRoot('CategoriasPage');
							},
							error => { }
						);
				},
				error => {
					loader.dismiss();
					this.sServidor = `${API_CONFIG.baseUrl}`;
				}
			)
	}

	presentLoading(): Loading {
		let loader = this.loadingCtrl.create(
			{
				content: "Aguarde..."
			}
		);
		loader.present();
		return loader;
	}

	ionViewDidLeave() {
		this.menu.swipeEnable(true);
	};

	login() {
		this.auth.authenticate(this.creds)
			.subscribe(
				response => {
					this.auth.successfulLogin(response.headers.get('Authorization'));
					this.navCtrl.setRoot('CategoriasPage');
				},
				error => { }
			);
	};

	signup() {
		this.navCtrl.push('SignupPage');
	};
}