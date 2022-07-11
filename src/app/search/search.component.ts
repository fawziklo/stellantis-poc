import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BlobServiceClient } from '@azure/storage-blob';
import { debounceTime, filter, switchMap } from 'rxjs/operators';
import { AzureSearchService } from 'src/services/azure-search.service';
import { semanticResponseI } from './azureReponse';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private searchService: AzureSearchService) { }

  searchForm = this.formBuilder.group({
    search: '',
  });


  serviceValueResponse = [];

  metadataCreationDate: string[] = [];
  metadataStorageName: string[] = [];
  metadataAuthor: string[] = [];
  organizations: string[] = [];
  people: string[] = [];


  captionsHighlights: string[] = [];
  captionsText: string[] = [];

  highlightsMergedContent: string[] = [];
  highlightsText: string[] = [];

  semResponseI: semanticResponseI[] = [];
  suggestion: any = undefined;
  imagesMetaData: string[] = []
  metadataStoragePaths: string[] = [];

  showSpinner = false;
  makeSearch = false;
  searchCount: number = 0;
  textSliderState = false;
  imageSliderState = false;
  checkedText = false;
  checkedImage = false;
  selectedIdx : number | undefined;
  panelOpenState = false;





  ngOnInit(): void {


    this.searchForm.controls.search.valueChanges.pipe(
      debounceTime(400),
      filter((term: any) => term?.length >= 3),
      switchMap((term: any) => this.searchService.getAzureSearch(term))).subscribe((valueAuto: any) => {
        this.makeSearch = true;

        this.searchCount = valueAuto['@odata.count']

        let serviceValueResponseAuto = valueAuto['value']
        console.warn(serviceValueResponseAuto)
        if (serviceValueResponseAuto) {
          let fileNameSug: string[] = []
          let imageMetadata: string[] = []

          Array.from(serviceValueResponseAuto).forEach((val: any) => (fileNameSug.push(val["metadata_storage_name"])))
          Array.from(serviceValueResponseAuto).forEach((val: any) => (imageMetadata.push(val["metadata_storage_path"])))

          let semResponseAuto = valueAuto["@search.answers"]
          let semanticSug: string[] = []

          if (semResponseAuto) {
            Array.from(semResponseAuto).forEach((val: any) => semanticSug.push(val))
          }


          let captionsText: string[] = []

          Array.from(serviceValueResponseAuto).forEach((val: any) =>
            Array.from(val["@search.captions"]).forEach(((nested_val: any) => {
              let lst = nested_val["text"].split(" ")
                .splice(0, 12)
                .toString()
                .replaceAll(",", " ")
              captionsText.push(lst)
            }
            )))


          this.suggestion = {
            fileName: fileNameSug,
            semanticSearch: semanticSug,
            text: captionsText
          }
        }


      });

  }


  trackByIdx(index: number, obj: any): any {
    return index && obj;
  }



  clearSearch() {
    this.serviceValueResponse = [];
    this.metadataCreationDate = [];
    this.metadataStorageName = [];
    this.metadataAuthor = [];
    this.organizations = [];
    this.people = [];
    this.captionsHighlights = [];
    this.captionsText = [];

    this.highlightsMergedContent = [];
    this.highlightsText = [];
    this.semResponseI = [];
    this.showSpinner = false;
    this.suggestion = undefined;
    this.makeSearch = false;
    this.searchCount = 0;
    this.textSliderState = false;
    this.imageSliderState = false;
    this.checkedText = false;
    this.checkedImage = false;
    this.imagesMetaData = [];
    this.selectedIdx = undefined;
  }

  onNavigate(file_name: string) {
    window.open("https://stellantisstorageaccount.blob.core.windows.net/datav2/" + file_name, "_blank");
  }

  async fetchImagePath(metadata_path:string) {
    let images = []
    const blobSasUrl = "https://stellantisstorageaccount.blob.core.windows.net/?sv=2021-06-08&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-08-06T16:45:11Z&st=2022-07-11T08:45:11Z&spr=https&sig=P%2BlrGex2mD1RllJEzr6QRgUG5rTyuaBpR58H1MLYIpU%3D"
    let blobServiceClient = new BlobServiceClient(blobSasUrl)
    const containerClient = blobServiceClient.getContainerClient("azureblob-skillset-2-image-projection");
    const pred = "https://stellantisstorageaccount.blob.core.windows.net/azureblob-skillset-2-image-projection/"

    let iter = containerClient.listBlobsFlat()
    let blobItem = await iter.next();
    while (!blobItem.done) {
      if (blobItem.value.name.split('/')[0] == metadata_path) {
        images.push(pred + blobItem.value.name)
        blobItem = await iter.next();
      }
      blobItem = await iter.next();
    }
    return images
    //this.searchService.getAzureBlobs().subscribe((val:any) => console.warn(val))
    //window.open("https://stellantisstorageaccount.blob.core.windows.net/azureblob-skillset-2-image-projection/" + 
    //"aHR0cHM6Ly9zdGVsbGFudGlzc3RvcmFnZWFjY291bnQuYmxvYi5jb3JlLndpbmRvd3MubmV0L2RhdGF2Mi9BMTBfMDUzMC5wZGY1/tableprojection_Images_0_imgdata.jpg", "_blank");
  }

  textSlide(event: any) {
    this.textSliderState = event.checked
    this.checkedText = event.checked
  }

  imageSlide(event: any) {
    this.imageSliderState = event.checked
    this.checkedImage = event.checked
  }

  async showGallery(metadata_path:string,idx:number){
    this.imagesMetaData = await this.fetchImagePath(metadata_path)
    this.selectedIdx = idx;
  }


  submit() {
    this.makeSearch = true;
    this.showSpinner = true
    const search_value = this.searchForm.controls.search.value;
    let semResponse = undefined;
    let highlightsResponse: string[] = [];

    this.searchService.getAzureSearch(search_value).subscribe((data: any) => {
      console.info(data)
      semResponse = data["@search.answers"]
      Array.from(semResponse).forEach((val: any) => {
        if (val) {
          this.semResponseI.push(val)
        }
      })

      //

      this.serviceValueResponse = data['value']
      Array.from(this.serviceValueResponse).forEach((val: any) => (this.metadataCreationDate.push(val["metadata_creation_date"])))
      Array.from(this.serviceValueResponse).forEach((val: any) => (this.metadataStorageName.push(val["metadata_storage_name"])))
      Array.from(this.serviceValueResponse).forEach((val: any) => (this.metadataStoragePaths.push(val["metadata_storage_path"])))

      Array.from(this.serviceValueResponse).forEach((val: any) => (this.metadataAuthor.push(val["metadata_author"])))
      Array.from(this.serviceValueResponse).forEach((val: any) => (this.organizations.push(val["organizations"].slice(0, 3))))
      Array.from(this.serviceValueResponse).forEach((val: any) => (this.people.push(val["people"].slice(0, 3))))


      //
      Array.from(this.serviceValueResponse).forEach((val: any) =>
        Array.from(val["@search.captions"]).forEach(((nested_val: any) => this.captionsHighlights.push(nested_val["highlights"]))))


      Array.from(this.serviceValueResponse).forEach((val: any) => Array.from(val["@search.captions"]).forEach(((nested_val: any) =>
        this.captionsText.push(nested_val["text"]))))

      //
      Array.from(this.serviceValueResponse).forEach((val: any) => {
        if (val["@search.highlights"]) {
          highlightsResponse.push(val["@search.highlights"])
        }
      })

      if (highlightsResponse && highlightsResponse.length > 0) {
        highlightsResponse.forEach((item: any) => {
          if (item["merged_content"])
            this.highlightsMergedContent.push(item["merged_content"])

          if (item["text"])
            this.highlightsText.push(item["text"])
        })
      }

    })

  }

}
