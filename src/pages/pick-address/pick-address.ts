import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component(
	{
		selector: 'page-pick-address',
		templateUrl: 'pick-address.html',
	}
)

export class PickAddressPage {
	itens: EnderecoDTO[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public storage: StorageService,
		public clienteService: ClienteService) {
	}

	ionViewDidLoad() {
		let localUser = this.storage.getLocalUser();
		if (localUser && localUser.email) {
			this.clienteService.findByEmail(localUser.email)
				.subscribe(
					response => {
						this.itens = response['enderecos'];
					},
					error => {
						if (error.status == API_CONFIG.HTTP_STATUS_403) {
							this.navCtrl.setRoot('HomePage');
						}
					}
				);
		}
		else {
			this.navCtrl.setRoot('HomePage');
		}
	}
}