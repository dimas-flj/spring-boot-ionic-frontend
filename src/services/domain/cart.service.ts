import { StorageService } from "../storage.service";
import { Injectable } from "@angular/core";
import { Cart } from "../../models/cart";
import { ProdutoDTO } from "../../models/produto.dto";

@Injectable()
export class CartService {
	constructor(public storage: StorageService) { }

	getCart(): Cart {
		let cart: Cart = this.storage.getCart();
		if (!cart) {
			cart = {
				itens: []
			};
			this.storage.setCart(cart);
		}
		return cart;
	}

	addProduto(produto: ProdutoDTO): Cart {
		let cart: Cart = this.getCart();
		let position = cart.itens.findIndex(x => x.produto.id == produto.id);
		if (position == -1) {
			cart.itens.push(
				{
					quantidade: 1,
					produto: produto
				}
			);
			this.storage.setCart(cart);
		}
		return cart;
	}
}