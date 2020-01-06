import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Loading } from 'ionic-angular';
import { PedidoDTO } from '../../models/pedido.dto';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/domain/cart.service';
import { ClienteDTO } from '../../models/cliente.dto';
import { EnderecoDTO } from '../../models/endereco.dto';
import { ClienteService } from '../../services/domain/cliente.service';
import { PedidoService } from '../../services/domain/pedido.service';
import { API_CONFIG } from '../../config/api.config';

@IonicPage()
@Component(
	{
		selector: 'page-order-confirmation',
		templateUrl: 'order-confirmation.html',
	}
)

export class OrderConfirmationPage {
	pedido: PedidoDTO;
	cartItens: CartItem[];
	cliente: ClienteDTO;
	endereco: EnderecoDTO;
	codpedido: string;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public cartService: CartService,
		public clienteService: ClienteService,
		public pedidoService: PedidoService,
		public loadingCtrl: LoadingController
	) {
		this.pedido = this.navParams.get('pedido');
	}

	ionViewDidLoad() {
		this.loadData();
	}

	presentLoading(msg: string): Loading {
		let loader = this.loadingCtrl.create(
			{
				content: `${msg}...`
			}
		);
		loader.present();
		return loader;
	}

	loadData() {
		let loader = this.presentLoading("Aguarde");
		this.cartItens = this.cartService.getCart().itens;
		this.clienteService.findById(this.pedido.cliente.id).
			subscribe(
				response => {
					this.cliente = response as ClienteDTO;
					this.endereco = this.findEndereco(
						this.pedido.enderecoDeEntrega.id,
						response['enderecos']
					);
					loader.dismiss();
				},
				error => {
					loader.dismiss();
					this.navCtrl.setRoot('HomePage');
				}
			)
	}

	private findEndereco(id: string, list: EnderecoDTO[]): EnderecoDTO {
		let position = list.findIndex(x => x.id == id);
		return list[position];
	}

	total() {
		return this.cartService.total();
	}

	back() {
		this.navCtrl.setRoot('CartPage');
	}

	home() {
		this.navCtrl.setRoot('CategoriasPage');
	}

	checkout() {
		let loader = this.presentLoading("Registrando seu pedido");
		this.pedidoService.insert(this.pedido).
			subscribe(
				response => {
					this.cartService.createOrClearCart();

					let location = response.headers.get('location');
					this.codpedido = this.extractId(location);
					loader.dismiss();
				},
				error => {
					loader.dismiss();
					if (error.status == API_CONFIG.HTTP_STATUS_403) {
						this.navCtrl.setRoot('HomePage');
					}
				}
			);
	}

	extractId(location: string): string {
		if (location) {
			let position = location.lastIndexOf('/');
			return location.substring(position + 1, location.length);
		}
		return null;
	}
}