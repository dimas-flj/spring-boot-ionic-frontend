import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import { StorageService } from '../services/storage.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(public storage: StorageService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req)
            .catch(
                (error, caught) => {
                    let errorObj = error;
                    if (errorObj.error) {
                        errorObj = errorObj.error;
                    }

                    if (!errorObj.status) {
                        errorObj = JSON.parse(errorObj);
                    }

                    console.log("Erro detectado pelo interceptor:");
                    console.log(errorObj);

                    switch (errorObj.status) {
                        //                       case 401:
                        //                           this.handle401();
                        //                            break;

                        case 403: {
                            this.handle403();
                            break;
                        };

                        //                        case 422:
                        //                            this.handle422(errorObj);
                        //                           break;

                        //                        default:
                        //                            this.handleDefaultEror(errorObj);
                    }

                    return Observable.throw(errorObj);
                }
            ) as any;
    }

    handle403() {
        this.storage.setLocalUser(null);
    }
}

export const ErrorInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
};