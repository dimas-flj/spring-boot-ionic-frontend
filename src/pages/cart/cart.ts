import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { API_CONFIG } from '../../config/api.config';
import { AWSService } from '../../services/aws.service';
import { CartService } from '../../services/domain/cart.service';

@IonicPage()
@Component({
	selector: 'page-cart',
	templateUrl: 'cart.html',
})
export class CartPage {
	itens: CartItem[];

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public cartService: CartService,
		public awsService: AWSService
	) { }

	ionViewDidLoad() {
		let cart = this.cartService.getCart();
		this.itens = cart.itens;
		this.loadSmallImagesFromBucket();
	}

	loadSmallImagesFromBucket() {
		for (var i = 0; i < this.itens.length; i++) {
			let item = this.itens[i];
			let url = `${API_CONFIG.bucketBaseUrl}/imgs/prod${item.produto.id}-small.jpg`;
			this.awsService.getImageFromBucket(url)
				.subscribe(
					response => {
						item.produto.imageUrl = url;
					},
					error => {
						item.produto.imageUrl = "assets/imgs/prod.jpg";
					}
				);
		}
	}
}