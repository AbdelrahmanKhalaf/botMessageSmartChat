import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ProdactsService {
  constructor(private http: HttpClient) { }
  allProdactes(page: any, limit: any) {
    return this.http.get(`${environment.url}/prodact/getAll?page=${page}&&limit=${limit}`)
  }
 saleProdactes() {
    return this.http.get(`${environment.url}/prodact/sale`)
  }
 ProdactesbySale(id:any) {
    return this.http.get(`${environment.url}/prodact/sale/${id}`)
  }
  ProdactesbyCateg(id:any) {
    return this.http.get(`${environment.url}/prodact/getByIdCategory/${id}`)
  }
  detailsProdact(id: any) {
    return this.http.get(`${environment.url}/prodact/getDetails/${id}`)

  }
  getProdactsByCAtegory(id:any){
    return this.http.get(`${environment.url}/prodact/getByCategory?id=${id}`)

  }
  getAllOrders() {
    return this.http.get(`${environment.url}/orders`)
  }
  getAllSubCatg() {
    return this.http.get(`${environment.url}/subcategories/get`)

  }
  getAllCategory() {
    return this.http.get(`${environment.url}/categories/get`)

  }
  getSubCategoryByIdCategory(id:any) {
    return this.http.get(`${environment.url}/subcategories/IdCategory/${id}`)

  }
}
