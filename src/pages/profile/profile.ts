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
					if (!this.cliente.imageUrl) {
						this.cliente.imageUrl = "assets/imgs/avatar-blank.png";
					}
				},
				error => { }
			);
		}
	}

	getImageIfExists() {
		let img_url = `${API_CONFIG.bucketBaseUrl}/imgs/cp${this.cliente.id}.jpg`;
		this.clienteService.getImageFromBucket(this.cliente.id)
			.subscribe(
				response => {
					this.cliente.imageUrl = img_url;
				},
				error => { }
			);
	}
}