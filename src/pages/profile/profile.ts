import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
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
		private camera: Camera,
		public loadingCtrl: LoadingController
	) { };

	ionViewDidLoad() {
		this.loadData();
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

	loadData() {
		let loader = this.presentLoading();
		let localUser = this.storage.getLocalUser();
		let email: string;
		if (localUser && localUser.email) {
			email = localUser.email;
			this.clienteService.findByEmail(email).subscribe(
				response => {
					this.cliente = response as ClienteDTO;

					// buscar imagem no bucket
					this.getImageIfExists();
					loader.dismiss();
				},
				error => {
					switch (error.status) {
						case API_CONFIG.HTTP_STATUS_403: {
							this.navCtrl.setRoot("HomePage");
							break;
						}
						default: { break; }
					}
					loader.dismiss();
				}
			);
		}
		else {
			this.storage.setLocalUser(null);
			this.navCtrl.setRoot("HomePage");
		}
	}

	getImageIfExists() {
		let img_url = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
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

	getCameraPicture() {
		this.cameraOn = true;
		let options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.FILE_URI,
			encodingType: this.camera.EncodingType.PNG,
			mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options).
			then(
				(imageData) => {
					this.picture = 'data:image/png;base64,' + imageData;
					this.cameraOn = false;
				},
				(err) => { }
			);

	}

	getGalleryPicture() {
		this.cameraOn = true;
		let options: CameraOptions = {
			quality: 100,
			destinationType: this.camera.DestinationType.FILE_URI,
			sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
			encodingType: this.camera.EncodingType.PNG,
			mediaType: this.camera.MediaType.PICTURE
		}

		this.camera.getPicture(options).
			then(
				(imageData) => {
					this.picture = 'data:image/png;base64,' + imageData;
					this.cameraOn = false;
				},
				(err) => { }
			);

	}

	sendPicture() {
		this.clienteService.uploadPicture(this.picture).
			subscribe(
				response => {
					this.picture = null;
					this.loadData();
				},
				error => {

				}
			)
	}

	cancelPicture() {
		this.picture = null;
	}
}