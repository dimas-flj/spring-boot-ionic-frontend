import { Injectable } from "@angular/core";
import { LocalUser } from "../models/local_user";
import { STORAGE_KEYS } from "../config/storage_keys.config";
import { Cart } from "../models/cart";

@Injectable()
export class StorageService {
	getLocalUser(): LocalUser {
		let usr = localStorage.getItem(STORAGE_KEYS.localUser);
		if (usr) {
			return JSON.parse(usr);
		}
		return null;
	}

	setLocalUser(usr: LocalUser) {
		if (usr) {
			localStorage.setItem(STORAGE_KEYS.localUser, JSON.stringify(usr));
			return;
		}
		localStorage.removeItem(STORAGE_KEYS.localUser);
	}

	getCart(): Cart {
		let sCart = localStorage.getItem(STORAGE_KEYS.cart);
		if (sCart) {
			return JSON.parse(sCart);
		}
		return null;
	}

	setCart(cart: Cart) {
		if (cart) {
			localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
			return;
		}
		localStorage.removeItem(STORAGE_KEYS.cart);
	}
}