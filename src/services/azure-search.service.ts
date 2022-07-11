import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AzureSearchService {

  constructor(private http: HttpClient) { }

  query = "https://search-service-2.search.windows.net/indexes/azureblob-index-2/docs?api-version=2021-04-30-Preview&" + 
          "speller=lexicon&$queryLanguage=en-us&queryType=semantic&captions=extractive&answers=extractive%7Ccount-3&semanticConfiguration=semcfg"
          + "&$top=3&highlight=merged_content,text&$count=true&suggesterName=sug&highlightPreTag=<mark>&highlightPostTag=</mark>"
          + "&queryLanguage=en-US&search="


  getAzureSearch(search_word: string | any): any {
    return this.http.get<any>(this.query + search_word, { headers: new HttpHeaders().set("api-key", "TcOW7xSZPg90rDCzltfQQyZXEST1VoEg1hKKtzAVqoAzSeBILs11") })
  }

  // S2 TcOW7xSZPg90rDCzltfQQyZXEST1VoEg1hKKtzAVqoAzSeBILs11
  // S1 zjKxrllLrklgiLnfxZHyNgB0iKskQgNBy8zEyLj7H4AzSeBpR6Mp

  //&highlightPreTag=<mark>&highlightPostTag=</mark>

  getAzureBlobs():any{
    return this.http.get<any>("https://stellantisstorageaccount.blob.core.windows.net/azureblob-skillset-2-image-projection?restype=container&comp=list",
    {headers: new HttpHeaders().set("x-ms-version", "2021-06-08") })
  }
}
