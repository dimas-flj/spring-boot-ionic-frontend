import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StorageService } from '../../services/storage.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
import { AWSService } from '../../services/aws.service';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage()
@Component(
	{
		selector: 'page-profile',
		templateUrl: 'profile.html'
	}
)

export class ProfilePage {
	cliente: ClienteDTO;
	picture: string;
	cameraOn: boolean = false;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public storage: StorageService,
		public clienteService: ClienteService,
		public awsService: AWSService,
		private camera: Camera
	) { };

	ionViewDidLoad() {
		let localUser = this.storage.getLocalUser();
		let email: string;
		if (localUser && localUser.email) {
			email = localUser.email;
			this.clienteService.findByEmail(email).subscribe(
				response => {
					this.cliente = response as ClienteDTO;

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
		this.awsService.getImageFromBucket(img_url)
			.subscribe(
				response => {
					this.cliente.imageUrl = img_url;
				},
				error => {
					this.cliente.imageUrl = "assets/imgs/avatar-blank.png";
				}
			);
	}

	testeCamera() {
		console.log('VAI ACIONAR CAMERA.');
	}

	getCameraPicture() {
		this.cameraOn = true;
		let options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.PNG,
			mediaType: this.camera.MediaType.PICTURE
		}

		console.log('VAI ACIONAR CAMERA.');

		this.camera.getPicture(options).
			then(
				(imageData) => {
					this.picture = 'data:image/png;base64,' + imageData;
					this.cameraOn = false;
				},
				(err) => { }
			);
	}
}