import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable()
export class AWSService {
	constructor(public http: HttpClient) { }

	getImageFromBucket(url: string): Observable<any> {
		return this.http.get(url, { responseType: 'blob' });
	}
}