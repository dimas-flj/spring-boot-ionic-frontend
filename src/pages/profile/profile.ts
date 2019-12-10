import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component(
	{
		selector: 'page-profile',
		templateUrl: 'profile.html'
	}
)

export class ProfilePage {
	cliente: ClienteDTO;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public storage: StorageService,
		public clienteService: ClienteService
	) { };

	ionViewDidLoad() {
		let localUser = this.storage.getLocalUser();
		let email: string;
		if (localUser && localUser.email) {
			email = localUser.email;
			this.clienteService.findByEmail(email).subscribe(
				response => {
					this.cliente = response;

					// buscar imagem no bucket
					this.getImageIfExists();
				},
				error => {
					switch (error.status) {
						case API_CONFIG.HTTP_STATUS_403: {
							this.navCtrl.setRoot("HomePage");
							break;
						}
						default: { break; }
					}
				}
			);
		}
		else {
			this.storage.setLocalUser(null);
			this.navCtrl.setRoot("HomePage");
		}
	}

	getImageIfExists() {
		let img_url = `${API_CONFIG.bucketBaseUrl}/imgs/cp${this.cliente.id}.jpg`;
		this.clienteService.getImageFromBucket(img_url)
			.subscribe(
				response => {
					this.cliente.imageUrl = img_url;
				},
				error => {
					this.cliente.imageUrl = "assets/imgs/avatar-blank.png";
				}
			);
	}
}