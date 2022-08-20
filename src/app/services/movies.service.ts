import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { RespuestaMDB, PeliculaDetalle, RespuestaCredits } from '../interfaces/interfaces';
import { environment } from '../../environments/environment';

const URL = environment.url;
const apiKey = environment.apiKey;

@Injectable({
  providedIn: 'root'
})
export class MoviesService implements OnInit{

  private popularesPage = 0;

  private inicio = '';
  private fin = '';

  constructor(private http:HttpClient) { }

  ngOnInit() {
    const hoy = new Date();
    const ultimoDia = new Date( hoy.getFullYear(), hoy.getMonth() + 1, 0 ).getDate()
    const mes = hoy.getMonth() + 1;

    let mesString;

    if( mes< 10 ) {
      mesString = '0' + mes;
    }else{
      mesString = mes;
    }

    this.inicio = `${hoy.getFullYear() }-${ mesString }-01`;
    this.fin = `${hoy.getFullYear() }-${ mesString }-${ ultimoDia }`;
  }

  private ejecutarQuery<T>(query: string){
    query = URL + query;
    query += `&api_key=${apiKey}&language=es&include_image_language=es`;
    
    return this.http.get<T>( query );
  }


  getGeature(){

    

    return this.ejecutarQuery<RespuestaMDB>(`/discover/movie?primary_release_date.gte=${ this.inicio }&primary_release_date.lte=${ this.fin }`);
  }


  getPopulares(){
    
    this.popularesPage++;

    const query = `/discover/movie?sort_by=populariry.desc&page=${ this.popularesPage}`;

    return this.ejecutarQuery<RespuestaMDB>(query)

  }


  getPeliculasDetalle(id: string){
    return this.ejecutarQuery<PeliculaDetalle>(`/movie/${id}?a=1`);
  }

  getActoresPelicula(id: string){
    return this.ejecutarQuery<RespuestaCredits>(`/movie/${id}/credits?a=1`);
  }

  buscarPeliculas(texto: string){
    return this.ejecutarQuery(`/search/movie?query=${texto}`);
  }

}
