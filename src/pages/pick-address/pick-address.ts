import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { EnderecoDTO } from '../../models/endereco.dto';
import { StorageService } from '../../services/storage.service';
import { ClienteService } from '../../services/domain/cliente.service';
import { API_CONFIG } from '../../config/api.config';
import { CartService } from '../../services/domain/cart.service';
import { PedidoDTO } from '../../models/pedido.dto';

@IonicPage()
@Component(
	{
		selector: 'page-pick-address',
		templateUrl: 'pick-address.html',
	}
)

export class PickAddressPage {
	itens: EnderecoDTO[];
	pedido: PedidoDTO;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public storage: StorageService,
		public clienteService: ClienteService,
		public cartService: CartService) {
	}

	ionViewDidLoad() {
		let localUser = this.storage.getLocalUser();
		if (localUser && localUser.email) {
			this.clienteService.findByEmail(localUser.email)
				.subscribe(
					response => {
						this.itens = response['enderecos'];
						let cart = this.cartService.getCart();
						this.pedido = {
							cliente: {
								id: response['id']
							},
							enderecoDeEntrega: null,
							pagamento: null,
							itens: cart.itens.map(
								x => {
									return {
										quantidade: x.quantidade,
										produto: {
											id: x.produto.id
										}
									}
								}
							)
						}
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

	nextPage(endereco: EnderecoDTO) {
		this.pedido.enderecoDeEntrega = { id: endereco.id };
		this.navCtrl.push('PaymentPage', { pedido: this.pedido });
	}
}