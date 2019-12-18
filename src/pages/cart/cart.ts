import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartItem } from '../../models/cart-item';
import { API_CONFIG } from '../../config/api.config';
import { AWSService } from '../../services/aws.service';
import { CartService } from '../../services/domain/cart.service';
import { ProdutoDTO } from '../../models/produto.dto';

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
			let url = `${API_CONFIG.bucketBaseUrl}/prod${item.produto.id}-small.jpg`;
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

	removeItem(produto: ProdutoDTO) {
		this.itens = this.cartService.removeProduto(produto).itens;
	}

	increaseQuantity(produto: ProdutoDTO) {
		this.itens = this.cartService.increaseQuantity(produto).itens;
	}

	decreaseQuantity(produto: ProdutoDTO) {
		this.itens = this.cartService.decreaseQuantity(produto).itens;
	}

	total(): number {
		return this.cartService.total();
	}

	goOn() {
		this.navCtrl.setRoot('CategoriasPage');
	}

	checkout() {
		this.navCtrl.push('PickAddressPage');
	}
}